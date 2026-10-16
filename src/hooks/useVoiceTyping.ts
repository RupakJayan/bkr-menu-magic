import { useState, useEffect, useRef, useCallback } from "react";
import {
  VoiceLanguage,
  VoiceMode,
  RecognizedItemResult,
  splitContinuousSpeech,
  findBestDishMatch,
  findAllDishMatches,
  isSpeechRecognitionSupported,
  playVoiceTickSound,
  playAlreadyAddedSound,
  speakVoiceFeedback,
} from "@/services/voiceTypingService";
import type { CatalogDish } from "@/types/menu";

interface UseVoiceTypingOptions {
  catalogDishes: CatalogDish[];
  onDishAdded?: (dish: CatalogDish) => void;
  onDishAlreadyAdded?: (dish: CatalogDish) => void;
  onCustomDishSpoken?: (phrase: string) => CatalogDish | null | void;
  onSearchQueryChange?: (query: string) => void;
  onListeningStopped?: () => void;
  isDishAlreadySelected?: (dish: CatalogDish) => boolean;
  requireConfirmation?: boolean;
  isConfirmationPending?: boolean;
  onDishRecognizedForConfirmation?: (payload: {
    dish: CatalogDish;
    phrase: string;
    alternatives: CatalogDish[];
  }) => void;
}

export const useVoiceTyping = ({
  catalogDishes,
  onDishAdded,
  onDishAlreadyAdded,
  onCustomDishSpoken,
  onSearchQueryChange,
  onListeningStopped,
  isDishAlreadySelected,
  requireConfirmation = true,
  isConfirmationPending = false,
  onDishRecognizedForConfirmation,
}: UseVoiceTypingOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>("single");
  const [voiceLang, setVoiceLang] = useState<VoiceLanguage>("en-IN");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [recentResults, setRecentResults] = useState<RecognizedItemResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const voiceModeRef = useRef<VoiceMode>("single");
  // Track recently processed phrases with timestamps to debounce rapid speech duplicates (within 1.5s)
  const recentSpokenTimestampsRef = useRef<Map<string, number>>(new Map());

  // Store latest callbacks and dishes in refs to avoid re-triggering effects and breaking keyboard typing
  const callbacksRef = useRef({
    onDishAdded,
    onDishAlreadyAdded,
    onCustomDishSpoken,
    onSearchQueryChange,
    onListeningStopped,
    isDishAlreadySelected,
    onDishRecognizedForConfirmation,
  });
  callbacksRef.current = {
    onDishAdded,
    onDishAlreadyAdded,
    onCustomDishSpoken,
    onSearchQueryChange,
    onListeningStopped,
    isDishAlreadySelected,
    onDishRecognizedForConfirmation,
  };

  const catalogDishesRef = useRef(catalogDishes);
  catalogDishesRef.current = catalogDishes;

  isListeningRef.current = isListening;
  voiceModeRef.current = voiceMode;

  const isSupported = isSpeechRecognitionSupported();

  // Helper to confirm and add a dish explicitly (via user confirmation card or direct action)
  const confirmAddDish = useCallback(
    (dish: CatalogDish, phrase?: string) => {
      const alreadyAdded = callbacksRef.current.isDishAlreadySelected
        ? callbacksRef.current.isDishAlreadySelected(dish)
        : false;
      if (!alreadyAdded) {
        callbacksRef.current.onDishAdded?.(dish);
        playVoiceTickSound();
        setRecentResults((prev) => [
          { phrase: phrase || dish.name_en, matchedDish: dish, status: "added" },
          ...prev,
        ].slice(0, 15));
      } else {
        playAlreadyAddedSound();
        callbacksRef.current.onDishAlreadyAdded?.(dish);
        setRecentResults((prev) => [
          { phrase: phrase || dish.name_en, matchedDish: dish, status: "already-added" },
          ...prev,
        ].slice(0, 15));
      }
    },
    []
  );

  const clearRecentResults = useCallback(() => {
    setRecentResults([]);
  }, []);

  const isConfirmationPendingRef = useRef(isConfirmationPending);
  isConfirmationPendingRef.current = isConfirmationPending;

  // Process a finalized spoken phrase
  const handleFinalPhrase = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // If a confirmation is currently pending on screen, ignore incoming background noise/speech
      if (isConfirmationPendingRef.current) return;

      if (voiceModeRef.current === "single") {
        // Single mode: updates the search query and closes
        callbacksRef.current.onSearchQueryChange?.(trimmed);
        return;
      }

      // Continuous mode: split phrases and evaluate dishes
      const phrases = splitContinuousSpeech(trimmed);
      const newResults: RecognizedItemResult[] = [];
      const now = Date.now();
      const currentDishes = catalogDishesRef.current;

      for (const phrase of phrases) {
        const lower = phrase.toLowerCase().trim();
        if (!lower) continue;

        // Debounce rapid identical repeats from speech API interim bursts (< 1.5s)
        const lastSpoken = recentSpokenTimestampsRef.current.get(lower) || 0;
        if (now - lastSpoken < 1500) {
          continue;
        }
        recentSpokenTimestampsRef.current.set(lower, now);

        const matched = findBestDishMatch(phrase, currentDishes);
        if (matched) {
          const alreadyAdded = callbacksRef.current.isDishAlreadySelected
            ? callbacksRef.current.isDishAlreadySelected(matched)
            : false;
          if (alreadyAdded) {
            playAlreadyAddedSound();
            speakVoiceFeedback(`${matched.name_en} already in menu`);
            callbacksRef.current.onDishAlreadyAdded?.(matched);
            newResults.push({ phrase, matchedDish: matched, status: "already-added" });
          } else if (requireConfirmation && callbacksRef.current.onDishRecognizedForConfirmation) {
            // Confirm with user: provide exact match and alternative varieties (e.g. Sambar Idli, Podi Idli, Mini Idli)
            const alternatives = findAllDishMatches(phrase, currentDishes, 5).filter((d) => d.id !== matched.id);
            callbacksRef.current.onDishRecognizedForConfirmation({
              dish: matched,
              phrase,
              alternatives,
            });
            playVoiceTickSound();
          } else {
            callbacksRef.current.onDishAdded?.(matched);
            playVoiceTickSound();
            newResults.push({ phrase, matchedDish: matched, status: "added" });
          }
        } else if (callbacksRef.current.onCustomDishSpoken) {
          // If confirmation is required, do NOT auto-add custom dishes into the session without asking!
          const created = callbacksRef.current.onCustomDishSpoken(phrase);
          if (created) {
            if (requireConfirmation && callbacksRef.current.onDishRecognizedForConfirmation) {
              callbacksRef.current.onDishRecognizedForConfirmation({
                dish: created,
                phrase,
                alternatives: [],
              });
              playVoiceTickSound();
            } else {
              callbacksRef.current.onDishAdded?.(created);
              playVoiceTickSound();
              newResults.push({ phrase, matchedDish: created, status: "added" });
            }
          } else {
            newResults.push({ phrase, matchedDish: null, status: "not-found" });
          }
        } else {
          newResults.push({ phrase, matchedDish: null, status: "not-found" });
        }
      }

      if (newResults.length > 0) {
        setRecentResults((prev) => [...newResults, ...prev].slice(0, 15));
      }
    },
    [requireConfirmation]
  );

  const stopListening = useCallback(() => {
    setIsListening(false);
    isListeningRef.current = false;
    setInterimTranscript("");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop error
      }
    }
    onListeningStopped?.();
  }, [onListeningStopped]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setErrorMessage("Speech recognition is not supported in this browser. Please try Chrome or Edge.");
      return;
    }

    setErrorMessage(null);
    setTranscript("");
    setInterimTranscript("");
    if (voiceModeRef.current === "continuous") {
      recentSpokenTimestampsRef.current.clear();
    }

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();

      recognition.continuous = voiceModeRef.current === "continuous";
      recognition.interimResults = true;
      recognition.lang = voiceLang;

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
      };

      recognition.onresult = (event: any) => {
        let currentInterim = "";
        let currentFinal = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0]?.transcript || "";
          if (result.isFinal) {
            currentFinal += text + " ";
            handleFinalPhrase(text);
          } else {
            currentInterim += text;
          }
        }

        setInterimTranscript(currentInterim);
        if (currentFinal) {
          setTranscript((prev) => (prev ? `${prev} ${currentFinal}` : currentFinal).trim());
        }

        if (voiceModeRef.current === "single" && currentFinal) {
          // In single mode, stop after first final phrase
          stopListening();
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setErrorMessage("Microphone access was denied. Please allow microphone permissions.");
          stopListening();
        } else if (event.error === "no-speech") {
          // Ignore no-speech in continuous mode
          if (voiceModeRef.current === "single") {
            stopListening();
          }
        }
      };

      recognition.onend = () => {
        // If in continuous mode and user didn't explicitly stop, auto-restart
        if (isListeningRef.current && voiceModeRef.current === "continuous") {
          try {
            recognition.start();
          } catch {
            setIsListening(false);
            isListeningRef.current = false;
            onListeningStopped?.();
          }
        } else {
          setIsListening(false);
          isListeningRef.current = false;
          onListeningStopped?.();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("Could not start speech recognition:", err);
      setErrorMessage(err.message || "Failed to initialize microphone.");
      setIsListening(false);
    }
  }, [isSupported, voiceLang, handleFinalPhrase, stopListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    isListening,
    voiceMode,
    setVoiceMode,
    voiceLang,
    setVoiceLang,
    transcript,
    interimTranscript,
    recentResults,
    clearRecentResults,
    confirmAddDish,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
    isSupported,
  };
};
