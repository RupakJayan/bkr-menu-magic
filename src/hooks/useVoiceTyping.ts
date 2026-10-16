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

  isListeningRef.current = isListening;
  voiceModeRef.current = voiceMode;

  const isSupported = isSpeechRecognitionSupported();

  // Helper to confirm and add a dish explicitly (via user confirmation card or direct action)
  const confirmAddDish = useCallback(
    (dish: CatalogDish, phrase?: string) => {
      const alreadyAdded = isDishAlreadySelected ? isDishAlreadySelected(dish) : false;
      if (!alreadyAdded) {
        onDishAdded?.(dish);
        playVoiceTickSound();
        setRecentResults((prev) => [
          { phrase: phrase || dish.name_en, matchedDish: dish, status: "added" },
          ...prev,
        ].slice(0, 15));
      } else {
        playAlreadyAddedSound();
        onDishAlreadyAdded?.(dish);
        setRecentResults((prev) => [
          { phrase: phrase || dish.name_en, matchedDish: dish, status: "already-added" },
          ...prev,
        ].slice(0, 15));
      }
    },
    [onDishAdded, onDishAlreadyAdded, isDishAlreadySelected]
  );

  // Process a finalized spoken phrase
  const handleFinalPhrase = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      if (voiceModeRef.current === "single") {
        // Single mode: updates the search query and closes
        onSearchQueryChange?.(trimmed);
        return;
      }

      // Continuous mode: split phrases and evaluate dishes
      const phrases = splitContinuousSpeech(trimmed);
      const newResults: RecognizedItemResult[] = [];
      const now = Date.now();

      for (const phrase of phrases) {
        const lower = phrase.toLowerCase().trim();
        if (!lower) continue;

        // Debounce rapid identical repeats from speech API interim bursts (< 1.2s)
        const lastSpoken = recentSpokenTimestampsRef.current.get(lower) || 0;
        if (now - lastSpoken < 1200) {
          continue;
        }
        recentSpokenTimestampsRef.current.set(lower, now);

        const matched = findBestDishMatch(phrase, catalogDishes);
        if (matched) {
          const alreadyAdded = isDishAlreadySelected ? isDishAlreadySelected(matched) : false;
          if (alreadyAdded) {
            // Item is repeated / already in menu: play warning pip, tell user, record status
            playAlreadyAddedSound();
            speakVoiceFeedback(`${matched.name_en} already in menu`);
            onDishAlreadyAdded?.(matched);
            newResults.push({ phrase, matchedDish: matched, status: "already-added" });
          } else if (requireConfirmation && onDishRecognizedForConfirmation) {
            // Optimal User Control: Ask user to confirm what they spoke before adding to menu
            const alternatives = findAllDishMatches(phrase, catalogDishes, 4).filter((d) => d.id !== matched.id);
            onDishRecognizedForConfirmation({
              dish: matched,
              phrase,
              alternatives,
            });
            playVoiceTickSound();
          } else {
            onDishAdded?.(matched);
            playVoiceTickSound();
            newResults.push({ phrase, matchedDish: matched, status: "added" });
          }
        } else if (onCustomDishSpoken) {
          // Auto-add not found items directly to catalog, session, and dictionary
          const created = onCustomDishSpoken(phrase);
          if (created) {
            playVoiceTickSound();
            newResults.push({ phrase, matchedDish: created, status: "added" });
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
    [
      catalogDishes,
      onDishAdded,
      onDishAlreadyAdded,
      onCustomDishSpoken,
      onSearchQueryChange,
      isDishAlreadySelected,
      requireConfirmation,
      onDishRecognizedForConfirmation,
    ]
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

  // Automatically pause/stop microphone when user touches or focuses any input field or dialog
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        if (isListeningRef.current) {
          stopListening();
        }
      }
    };

    window.addEventListener("focusin", handleFocusIn);
    return () => window.removeEventListener("focusin", handleFocusIn);
  }, [stopListening]);

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
    clearRecentResults: () => setRecentResults([]),
    confirmAddDish,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
    isSupported,
  };
};
