import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Mic,
  MicOff,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  AlertCircle,
  Layers,
  CheckCircle2,
  Utensils,
  RefreshCw,
  Key,
  ExternalLink,
} from "lucide-react";
import {
  AudioRecordingController,
  processVoiceWithGemini,
  commitVoiceDishesToSession,
  isMediaRecorderSupported,
  parseSpokenDishesToReview,
  RecognizedVoiceDish,
} from "@/services/aiVoiceAssistantService";
import { playVoiceTickSound, playAlreadyAddedSound, isSpeechRecognitionSupported } from "@/services/voiceTypingService";

interface AiVoiceAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayNumber: number;
  sessionName: string;
  sessionDishKeys: string[];
  categories: string[];
  onAddDishToSession: (category: string, dishId: string) => void;
  onCatalogUpdated: () => void;
  onFallbackToBrowserVoice?: () => void;
}

type AssistantStep = "idle" | "recording" | "analyzing" | "review";

export const AiVoiceAssistantDialog: React.FC<AiVoiceAssistantDialogProps> = ({
  open,
  onOpenChange,
  dayNumber,
  sessionName,
  sessionDishKeys,
  categories,
  onAddDishToSession,
  onCatalogUpdated,
  onFallbackToBrowserVoice,
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<AssistantStep>("idle");
  const [engine, setEngine] = useState<"browser" | "gemini">("browser");
  const [speechLang, setSpeechLang] = useState<"ta-IN" | "en-IN">("ta-IN");
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recognizedDishes, setRecognizedDishes] = useState<RecognizedVoiceDish[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const controllerRef = useRef<AudioRecordingController | null>(null);
  const speechRecRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);
  const timerRef = useRef<any>(null);

  const isMediaSupported = isMediaRecorderSupported();
  const isBrowserSpeechSupported = isSpeechRecognitionSupported();

  // Reset state when dialog closes or sync API key when opened
  useEffect(() => {
    if (open) {
      setLiveTranscript("");
    } else {
      isRecordingRef.current = false;
      if (speechRecRef.current) {
        try { speechRecRef.current.abort(); } catch {}
        speechRecRef.current = null;
      }
      if (controllerRef.current) {
        controllerRef.current.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setStep("idle");
      setRecordingSeconds(0);
      setErrorMessage(null);
      setLiveTranscript("");
    }
  }, [open]);

  // Handle timer during recording
  useEffect(() => {
    if (step === "recording") {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => {
          if (s >= 45) {
            // Auto-stop at 45 seconds to prevent unbounded audio
            handleStopRecording();
            return s;
          }
          return s + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const handleStartRecording = async () => {
    setErrorMessage(null);
    setLiveTranscript("");

    // MODE 1: Free Browser Speech Recognition (100% Free, Zero Key Needed)
    if (engine === "browser") {
      const SpeechRec = typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
      if (!SpeechRec) {
        setErrorMessage("Voice recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.");
        return;
      }
      try {
        const rec = new SpeechRec();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = speechLang;

        rec.onresult = (event: any) => {
          let full = "";
          for (let i = 0; i < event.results.length; i++) {
            full += event.results[i][0].transcript + " ";
          }
          setLiveTranscript(full.trim());
        };

        rec.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            setErrorMessage("Microphone access was denied. Please allow microphone permissions in your browser.");
          }
        };

        rec.onend = () => {
          if (isRecordingRef.current && speechRecRef.current) {
            try { speechRecRef.current.start(); } catch {}
          }
        };

        rec.start();
        speechRecRef.current = rec;
        isRecordingRef.current = true;
        setStep("recording");
      } catch (err: any) {
        console.error("Failed to start speech recognition:", err);
        setErrorMessage(err.message || "Could not access microphone.");
        setStep("idle");
      }
      return;
    }

    // MODE 2: Gemini Cloud Multimodal Audio
    const activeKey = getGeminiApiKey();
    if (!activeKey) {
      // Seamlessly switch to Free Browser Voice rather than blocking user with an error
      setEngine("browser");
      toast({
        title: "Using Free Voice Engine 🎙️",
        description: "No Gemini API key detected. Switched to Free Browser Voice automatically.",
      });
      // Start free recording directly
      setTimeout(() => {
        handleStartRecording();
      }, 100);
      return;
    }

    try {
      if (!controllerRef.current) {
        controllerRef.current = new AudioRecordingController();
      }
      await controllerRef.current.start();
      isRecordingRef.current = true;
      setStep("recording");
    } catch (err: any) {
      console.error("Failed to start voice assistant recording:", err);
      setErrorMessage(err.message || "Microphone access denied or audio recording unsupported.");
      setStep("idle");
    }
  };

  const handleStopRecording = async () => {
    isRecordingRef.current = false;
    setStep("analyzing");

    // Process Free Browser Voice Transcript
    if (engine === "browser") {
      if (speechRecRef.current) {
        try { speechRecRef.current.stop(); } catch {}
        speechRecRef.current = null;
      }

      // Small delay to allow any pending speech recognition result to finalize
      setTimeout(() => {
        const textToParse = liveTranscript.trim();
        if (!textToParse) {
          setErrorMessage("No voice input was heard. Please check your microphone, speak clearly, and try again.");
          setStep("idle");
          return;
        }

        const dishes = parseSpokenDishesToReview(textToParse, sessionDishKeys);
        if (!dishes || dishes.length === 0) {
          setErrorMessage(`Heard: "${textToParse}", but could not find matching dishes. Try speaking catering items like 'இட்லி, மெது வடை, பொங்கல்' or 'Medu Vada, Sambar, Kesari'.`);
          setStep("idle");
          return;
        }

        setRecognizedDishes(dishes);
        setStep("review");
        playVoiceTickSound();
      }, 350);
      return;
    }

    // Process Gemini Cloud Recording
    if (!controllerRef.current) return;
    try {
      const { blob, mimeType } = await controllerRef.current.stop();
      const activeKey = getGeminiApiKey();

      const dishes = await processVoiceWithGemini(
        blob,
        mimeType,
        sessionDishKeys,
        activeKey
      );

      if (!dishes || dishes.length === 0) {
        setErrorMessage("No South Indian catering dishes were detected in the audio. Please try speaking dish names clearly.");
        setStep("idle");
        return;
      }

      setRecognizedDishes(dishes);
      setStep("review");
      playVoiceTickSound();
    } catch (err: any) {
      console.error("Gemini voice assistant processing error:", err);
      const msg = err?.message || "Failed to analyze speech. Please speak clearly and try again.";
      setErrorMessage(msg);
      
      setStep("idle");
    }
  };

  const handleCancelRecording = () => {
    isRecordingRef.current = false;
    if (speechRecRef.current) {
      try { speechRecRef.current.abort(); } catch {}
      speechRecRef.current = null;
    }
    if (controllerRef.current) {
      controllerRef.current.cancel();
    }
    setStep("idle");
    setRecordingSeconds(0);
    setLiveTranscript("");
  };

  const handleToggleDishSelected = (index: number) => {
    setRecognizedDishes((prev) =>
      prev.map((d, i) => (i === index ? { ...d, selected: !d.selected } : d))
    );
  };

  const handleUpdateDishNameEn = (index: number, val: string) => {
    setRecognizedDishes((prev) =>
      prev.map((d, i) => (i === index ? { ...d, name_en: val } : d))
    );
  };

  const handleUpdateDishNameTa = (index: number, val: string) => {
    setRecognizedDishes((prev) =>
      prev.map((d, i) => (i === index ? { ...d, name_ta: val } : d))
    );
  };

  const handleUpdateDishCategory = (index: number, val: string) => {
    setRecognizedDishes((prev) =>
      prev.map((d, i) => (i === index ? { ...d, category: val } : d))
    );
  };

  const handleDeleteDish = (index: number) => {
    setRecognizedDishes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCommitDishes = () => {
    const selectedCount = recognizedDishes.filter((d) => d.selected && !d.isAlreadyInSession).length;
    if (selectedCount === 0) {
      toast({
        title: "No Dishes Selected",
        description: "Please select at least one dish to add to this session.",
        variant: "destructive",
      });
      return;
    }

    const { addedCount, newDishesCreated } = commitVoiceDishesToSession(
      recognizedDishes,
      onAddDishToSession,
      onCatalogUpdated
    );

    playVoiceTickSound();

    toast({
      title: "Menu Items Added! 🎙️✨",
      description: `Added ${addedCount} dish${addedCount === 1 ? "" : "es"} to Day ${dayNumber} - ${sessionName}${
        newDishesCreated > 0 ? ` (${newDishesCreated} newly registered into dictionary)` : ""
      }.`,
    });

    onOpenChange(false);
  };

  const formatTimer = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto bg-surf border-line shadow-2xl p-0 gap-0 rounded-2xl">
        {/* Header - Signature Royal BKR Style */}
        <DialogHeader className="p-5 pb-4 bg-gradient-to-r from-[#762934] via-[#5c1f28] to-[#2a1708] text-white rounded-t-2xl border-b border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 shadow-inner">
                <Mic className="h-6 w-6 text-[#d8b36d]" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <span>AI Voice Assistant</span>
                  
                </DialogTitle>
                <DialogDescription className="text-white/80 text-xs mt-0.5">
                  World-class multimodal catering speech-to-menu for Day {dayNumber} – {sessionName}
                </DialogDescription>
              </div>
            </div>

            <Badge variant="outline" className="text-white/90 border-white/20 text-[11px] shrink-0 hidden sm:flex items-center gap-1">
              <VolumeX className="h-3 w-3 text-[#d8b36d]" />
              Zero Audio Reflection
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-4">
          {/* Language Selection & Voice Status */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-surf-2 rounded-xl text-xs text-ink border border-line">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">Voice Assistant Ready</span>
              <span className="text-mute hidden sm:inline">· Speak Tamil or English</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-mute font-medium">Language:</span>
              <button
                type="button"
                onClick={() => setSpeechLang(speechLang === "ta-IN" ? "en-IN" : "ta-IN")}
                className="px-2.5 py-1 rounded-lg bg-surf border border-line font-bold hover:shadow-sm transition-all text-ink"
              >
                {speechLang === "ta-IN" ? "தமிழ் (Tamil)" : "English (IN)"}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-xs text-danger space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold">Speech Error: </span>
                  {errorMessage}
                </div>
              </div>
              {onFallbackToBrowserVoice && (
                <div className="pt-1 flex items-center justify-end">
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() => {
                      onOpenChange(false);
                      onFallbackToBrowserVoice();
                    }}
                    className="h-7 text-xs bg-surf border-danger/40 text-danger hover:bg-danger/10 font-semibold rounded-lg shadow-sm"
                  >
                    🎙️ Switch to Browser Voice Typing
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 1: IDLE / READY TO RECORD */}
          {step === "idle" && (
            <div className="py-6 text-center space-y-5">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#762934]/20 dark:bg-[#d8b36d]/20 animate-ping" />
                <button
                  type="button"
                  onClick={handleStartRecording}
                  disabled={engine === "browser" ? !isBrowserSpeechSupported : !isMediaSupported}
                  className="relative p-6 rounded-full bg-gradient-to-tr from-[#762934] to-[#a03646] dark:from-[#d8b36d] dark:to-[#f3d99d] text-white dark:text-[#2a1708] shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
                  title="Click to start speaking dishes"
                >
                  <Mic className="h-10 w-10" />
                </button>
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-bold text-ink">
                  Tap to Speak Your Menu Order
                </h3>
                <p className="text-xs text-ink/70">
                  Speak continuously in <strong>Tamil (தமிழ்)</strong>, <strong>English</strong>, or <strong>Tanglish</strong>.
                  List items one after another naturally.
                </p>
              </div>

              {/* Spoken Examples Box */}
              <div className="p-3.5 rounded-xl border border-line bg-surf-2 text-left space-y-2 max-w-lg mx-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-mute flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-acc" />
                  Try Speaking Naturally Like:
                </span>
                <div className="space-y-1.5 text-xs text-ink">
                  <div className="p-2 rounded-lg bg-surf border border-line/60">
                    <span className="text-acc font-semibold">Tamil: </span>
                    &ldquo;ரெண்டு இட்லி, மெது வடை, நெய் பொங்கல், பில்டர் காபி, ரவா கேசரி&rdquo;
                  </div>
                  <div className="p-2 rounded-lg bg-surf border border-line/60">
                    <span className="text-acc font-semibold">English/Tanglish: </span>
                    &ldquo;Add Medu Vada, Arachuvitta Sambar, Pineapple Kesari, and Curd Rice&rdquo;
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-mute pt-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Multilingual Understanding
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Auto-Translates to Tamil
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Anti-Echo Guard
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: RECORDING IN PROGRESS */}
          {step === "recording" && (
            <div className="py-8 text-center space-y-6 animate-fade-in">
              {/* Visual Pulsing Waveform */}
              <div className="flex items-center justify-center gap-1.5 h-16">
                {[12, 28, 48, 64, 40, 56, 32, 60, 44, 20, 52, 36, 16].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-gradient-to-t from-[#762934] to-[#d8b36d] animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                    }}
                  />
                ))}
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-danger/10 text-danger border border-danger/20 text-xs font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger animate-ping" />
                  <span>Listening Live · {formatTimer(recordingSeconds)}</span>
                </div>
                <p className="text-sm font-semibold text-ink pt-1">
                  Speak dishes freely... Say &ldquo;Done&rdquo; or click below when finished
                </p>
                <p className="text-xs text-mute">
                  All speaker output is muted to protect against echo loops.
                </p>
              </div>

              {liveTranscript && (
                <div className="p-3 rounded-xl bg-surf border border-acc/40 text-left max-w-lg mx-auto shadow-sm animate-fade-in">
                  <span className="text-[10px] uppercase font-bold text-acc tracking-wider block mb-1">
                    Heard Live:
                  </span>
                  <p className="text-sm font-semibold text-ink leading-relaxed font-tamil">
                    &ldquo;{liveTranscript}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={handleStopRecording}
                  className="bg-[#762934] hover:bg-[#5c1f28] text-white dark:bg-[#d8b36d] dark:text-[#2a1708] dark:hover:bg-[#e4c27f] font-bold text-sm px-6 h-12 rounded-xl shadow-lg transition-transform hover:scale-105"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Done & Extract Menu Dishes
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleCancelRecording}
                  className="border-line bg-surf-2 hover:bg-surf text-ink text-sm h-12 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: ANALYZING */}
          {step === "analyzing" && (
            <div className="py-12 text-center space-y-4 animate-fade-in">
              <div className="relative inline-flex items-center justify-center">
                <RefreshCw className="h-12 w-12 text-acc animate-spin" />
                <Sparkles className="h-5 w-5 text-amber-500 absolute" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-ink">
                  Deciphering spoken catering dishes...
                </h3>
                <p className="text-xs text-mute max-w-sm mx-auto">
                  Accurately extracting South Indian dishes, resolving authentic culinary Tamil translations, and matching catering categories...
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM RECOGNIZED DISHES */}
          {step === "review" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-acc" />
                    Recognized Dishes ({recognizedDishes.filter((d) => d.selected).length} selected)
                  </h3>
                  <p className="text-[11px] text-mute">
                    Review and edit names if desired before adding to Day {dayNumber} - {sessionName}.
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStartRecording}
                  className="h-8 text-xs border-line bg-surf-2 text-ink"
                >
                  <Mic className="h-3.5 w-3.5 mr-1 text-acc" />
                  Record More
                </Button>
              </div>

              {/* Dishes List */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {recognizedDishes.map((dish, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all ${
                      dish.selected
                        ? "border-acc/50 bg-acc/5 shadow-sm"
                        : "border-line bg-surf-2 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={dish.selected}
                        onChange={() => handleToggleDishSelected(idx)}
                        className="mt-1 h-4 w-4 rounded border-line text-acc focus:ring-acc"
                        id={`dish-check-${idx}`}
                      />

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-ink">Item #{idx + 1}</span>
                            {dish.isAlreadyInSession && (
                              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">
                                Already in Menu
                              </Badge>
                            )}
                            {dish.isExistingMatch ? (
                              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                                In Catalog
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-600 border-indigo-500/30">
                                New Custom Dish
                              </Badge>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteDish(idx)}
                            className="text-mute hover:text-danger p-1 rounded"
                            title="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Editable Name Inputs - Completely Unlocked */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-mute tracking-wider block mb-0.5">
                              English Name
                            </label>
                            <Input
                              value={dish.name_en}
                              onChange={(e) => handleUpdateDishNameEn(idx, e.target.value)}
                              inputMode="text"
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                              autoCapitalize="words"
                              className="h-8 text-xs bg-surf border-line"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-mute tracking-wider block mb-0.5">
                              Tamil Name (தமிழ்)
                            </label>
                            <Input
                              value={dish.name_ta}
                              onChange={(e) => handleUpdateDishNameTa(idx, e.target.value)}
                              inputMode="text"
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                              className="h-8 text-xs font-tamil bg-surf border-line"
                            />
                          </div>
                        </div>

                        {/* Category Selector */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[10px] uppercase font-bold text-mute tracking-wider">
                            Category:
                          </span>
                          <select
                            value={dish.category}
                            onChange={(e) => handleUpdateDishCategory(idx, e.target.value)}
                            className="h-7 text-xs rounded border border-line bg-surf px-2 text-ink flex-1 max-w-[220px]"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-line">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep("idle")}
                  className="w-full sm:w-auto text-xs border-line bg-surf-2 text-ink h-9"
                >
                  Start Over
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="w-full sm:w-auto text-xs border-line text-ink h-9"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCommitDishes}
                    disabled={recognizedDishes.filter((d) => d.selected && !d.isAlreadyInSession).length === 0}
                    className="w-full sm:w-auto bg-[#762934] hover:bg-[#5c1f28] text-white dark:bg-[#d8b36d] dark:text-[#2a1708] dark:hover:bg-[#e4c27f] font-bold text-xs h-9 px-4 rounded-xl shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add {recognizedDishes.filter((d) => d.selected && !d.isAlreadyInSession).length} Dishes to Menu
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
