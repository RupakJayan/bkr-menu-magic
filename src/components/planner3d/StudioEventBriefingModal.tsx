import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  Layers,
  MapPin,
  Users,
  Utensils,
  Sun,
  Moon,
  Sunset,
  Lightbulb,
  Check,
  Compass,
  ArrowRight,
  Tv,
  Volume2,
  Sliders,
  Type,
  Maximize2,
  Trash2,
} from "lucide-react";
import { MandapamVenue, StallType } from "@/types/planner3d";
import { PRESET_VENUES } from "@/services/planner3dService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface StudioBriefingData {
  eventTitle: string;
  venue: MandapamVenue;
  headCount: number;
  counterCounts: {
    dosa: number;
    idli: number;
    chaat: number;
    continental: number;
    dessert: number;
    tamboolam: number;
  };
  timeOfDay: "morning" | "afternoon" | "sunset" | "night";
  showFocusLights: boolean;
  showVideoWall: boolean;
  showEcoDustbins: boolean;
}

interface StudioEventBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: StudioBriefingData;
  onRenderStage: (data: StudioBriefingData) => void;
}

export const StudioEventBriefingModal: React.FC<StudioEventBriefingModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onRenderStage,
}) => {
  if (!isOpen) return null;

  // Form states
  const [data, setData] = useState<StudioBriefingData>(initialData);
  const [activeTab, setActiveTab] = useState<"speech" | "custom">("speech");
  const [typedPrompt, setTypedPrompt] = useState<string>("");

  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Compilation / rendering loading state
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilingStep, setCompilingStep] = useState(0);

  const COMPILING_STAGES = [
    "Analyzing spatial footprint & terrain limits...",
    "Synthesizing 3D live counters & wing positions...",
    "Calibrating theatrical focus spotlights & shadows...",
    "Mounting BKR Royal curved LED media wall...",
    "Finalizing crowd walkthrough aisles & rendering 3D stage...",
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setSpeechTranscript(currentTranscript);
        parseSpokenBrief(currentTranscript);
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech Recognition is not supported in this browser. Please use the text input below.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info("Voice recording paused");
    } else {
      setSpeechTranscript("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success("Listening... Speak your event details", {
          description: "e.g. '1 acre open lawn, 3500 guests, 3 dosa counters, video wall, golden hour'",
        });
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Natural Language & Speech Keyword Parser
  const parseSpokenBrief = (text: string) => {
    const lower = text.toLowerCase();

    // 1. Parse guest count (e.g. "3000 guests", "4000 pax", "1 lakh", "2500 people")
    const lakhMatch = lower.match(/(1|one)\s*(lakh|lac)/);
    if (lakhMatch) {
      setData((prev) => ({ ...prev, headCount: 100000 }));
    } else {
      const countMatch = lower.match(/(\d[\d,]*)\s*(guests?|pax|people|heads?)/);
      if (countMatch) {
        const count = parseInt(countMatch[1].replace(/,/g, ""), 10);
        if (!isNaN(count) && count >= 50) {
          setData((prev) => ({ ...prev, headCount: count }));
        }
      }
    }

    // 2. Parse venue footprint (open lawn / acres vs hall)
    if (lower.includes("open lawn") || lower.includes("open ground") || lower.includes("lawn") || lower.includes("acre")) {
      const openVenue = PRESET_VENUES.find((v) => v.terrainType === "open_lawn") || PRESET_VENUES[3];
      setData((prev) => ({ ...prev, venue: openVenue }));
    } else if (lower.includes("ramanathan") || lower.includes("mayor")) {
      const v = PRESET_VENUES.find((v) => v.id === "mrc-hall") || PRESET_VENUES[0];
      setData((prev) => ({ ...prev, venue: v }));
    } else if (lower.includes("vari") || lower.includes("kalyana mandapam")) {
      const v = PRESET_VENUES.find((v) => v.id === "sri-vari") || PRESET_VENUES[1];
      setData((prev) => ({ ...prev, venue: v }));
    }

    // 3. Parse Dosa stations
    const dosaMatch = lower.match(/(\d+|two|three|four|dual|triple)\s*(dosa|dosai)/);
    if (dosaMatch) {
      const word = dosaMatch[1];
      let qty = 2;
      if (word === "two" || word === "dual" || word === "2") qty = 2;
      if (word === "three" || word === "triple" || word === "3") qty = 3;
      if (word === "four" || word === "4") qty = 4;
      setData((prev) => ({
        ...prev,
        counterCounts: { ...prev.counterCounts, dosa: qty },
      }));
    }

    // 4. Parse Idli counters
    const idliMatch = lower.match(/(\d+|two|three)\s*(idli|idly)/);
    if (idliMatch) {
      const qty = parseInt(idliMatch[1], 10) || (idliMatch[1] === "two" ? 2 : 1);
      setData((prev) => ({
        ...prev,
        counterCounts: { ...prev.counterCounts, idli: qty },
      }));
    }

    // 5. Time of day / Atmosphere
    if (lower.includes("sunset") || lower.includes("golden hour") || lower.includes("evening")) {
      setData((prev) => ({ ...prev, timeOfDay: "sunset" }));
    } else if (lower.includes("night") || lower.includes("serial light") || lower.includes("starlight")) {
      setData((prev) => ({ ...prev, timeOfDay: "night" }));
    } else if (lower.includes("morning") || lower.includes("muhurtham")) {
      setData((prev) => ({ ...prev, timeOfDay: "morning" }));
    }

    // 6. Amenities
    if (lower.includes("video wall") || lower.includes("led wall") || lower.includes("screen")) {
      setData((prev) => ({ ...prev, showVideoWall: true }));
    }
    if (lower.includes("focus light") || lower.includes("spotlight")) {
      setData((prev) => ({ ...prev, showFocusLights: true }));
    }
  };

  const handleApplyTypedPrompt = () => {
    if (!typedPrompt.trim()) return;
    parseSpokenBrief(typedPrompt);
    toast.success("Brief parsed and applied to scene settings");
  };

  const handleStartRender = () => {
    setIsCompiling(true);
    setCompilingStep(0);

    const stepInterval = setInterval(() => {
      setCompilingStep((prev) => {
        if (prev < COMPILING_STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsCompiling(false);
            onRenderStage(data);
            onClose();
            toast.success("3D Scene Rendered Successfully", {
              description: `${data.headCount.toLocaleString("en-IN")} Pax • ${data.venue.name} • ${data.counterCounts.dosa}x Dosa Counters`,
            });
          }, 350);
          return prev;
        }
      });
    }, 320);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111318] text-[#f4efe6] shadow-2xl flex flex-col font-body">
        
        {/* Top Studio HUD Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#161820]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#e2c99a] shadow-[0_0_10px_rgba(226,201,154,0.6)] animate-pulse" />
            <div>
              <h2 className="text-base font-extrabold tracking-wide uppercase font-display text-white">
                BKR 3D Studio • Event Staging Console
              </h2>
              <p className="text-xs text-[#8e95a5]">
                Configure event briefing via speech or custom parameters before rendering the 3D layout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#222530] text-[#e2c99a] border border-[#e2c99a]/30">
              STEP 1 • BRIEFING
            </span>
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-xs text-[#8e95a5] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Studio Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          
          {/* 1. SPEECH OR TYPE MODALITY SELECTOR */}
          <div className="flex items-center gap-3 border-b border-white/[0.08] pb-3">
            <button
              onClick={() => setActiveTab("speech")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "speech"
                  ? "bg-[#222530] text-[#e2c99a] border border-[#e2c99a]/40 shadow-sm"
                  : "text-[#8e95a5] hover:text-white hover:bg-white/5"
              }`}
            >
              <Mic className="h-4 w-4" />
              <span>Voice Speech Input</span>
              {isListening && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("custom")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "custom"
                  ? "bg-[#222530] text-[#e2c99a] border border-[#e2c99a]/40 shadow-sm"
                  : "text-[#8e95a5] hover:text-white hover:bg-white/5"
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span>Custom Specification Sliders</span>
            </button>
          </div>

          {/* TAB CONTENT: SPEECH OR PROMPT */}
          {activeTab === "speech" ? (
            <div className="space-y-4">
              {/* Interactive Speech Card */}
              <div className="relative p-6 rounded-2xl border border-white/[0.08] bg-[#161820] flex flex-col items-center justify-center text-center space-y-4">
                
                {/* Large Tactile Mic Button */}
                <button
                  onClick={toggleListening}
                  className={`relative p-5 rounded-full transition-all duration-300 shadow-xl flex items-center justify-center ${
                    isListening
                      ? "bg-rose-500 text-white shadow-rose-500/40 scale-105"
                      : "bg-[#222530] text-[#e2c99a] hover:bg-[#2a2e3b] border border-[#e2c99a]/40 shadow-[0_0_20px_rgba(226,201,154,0.15)]"
                  }`}
                  title={isListening ? "Stop Listening" : "Tap to Speak"}
                >
                  {isListening ? (
                    <MicOff className="h-7 w-7 animate-pulse" />
                  ) : (
                    <Mic className="h-7 w-7" />
                  )}
                  {isListening && (
                    <span className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping" />
                  )}
                </button>

                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    {isListening ? "Listening to your Event Brief..." : "Tap the Mic to Speak your Catering Brief"}
                  </h3>
                  <p className="text-xs text-[#8e95a5] mt-1 max-w-md">
                    Speak your guest count, venue type, dosa counter numbers, or time of day naturally.
                  </p>
                </div>

                {/* Real-Time Spoken Transcript Display */}
                {(isListening || speechTranscript) && (
                  <div className="w-full p-3.5 rounded-xl bg-[#0e1015] border border-white/[0.08] text-left">
                    <span className="text-[10px] font-mono text-[#e2c99a] uppercase block mb-1">
                      Live Voice Recognition:
                    </span>
                    <p className="text-xs font-mono text-white leading-relaxed">
                      {speechTranscript || "Listening... speak now."}
                    </p>
                  </div>
                )}

                {/* Or Type Prompt Alternative */}
                <div className="w-full pt-2 flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={typedPrompt}
                      onChange={(e) => setTypedPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyTypedPrompt()}
                      placeholder="Or type here: e.g. '1 acre open lawn, 4000 guests, 3 dosa counters, video wall'"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0e1015] border border-white/[0.08] text-xs text-white placeholder-[#8e95a5] focus:outline-none focus:border-[#e2c99a]"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleApplyTypedPrompt}
                    className="h-9 px-4 text-xs font-bold bg-[#e2c99a] text-black hover:bg-[#c5a059]"
                  >
                    Parse Brief
                  </Button>
                </div>

                {/* Sample One-Click Speech Presets */}
                <div className="w-full pt-2">
                  <span className="text-[10px] font-mono text-[#8e95a5] block text-left mb-2 uppercase">
                    Sample Inquiries (Click to autofill):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        label: "🌿 1-Acre Open Lawn Reception (3,500 Pax, 3x Dosa)",
                        prompt: "1 acre open lawn in Coimbatore, 3500 guests with 3 dosa counters, video wall, and golden hour sunset",
                      },
                      {
                        label: "🏛️ Royal Mandapam Kalyanam (1,500 Pax, Dual Dosa)",
                        prompt: "Mayor Ramanathan Chettiar Hall, 1500 guests with 2 dosa counters, idli stall, focus spotlights",
                      },
                      {
                        label: "🎪 Mega Ground Festival (20,000 Pax, 4x Dosa)",
                        prompt: "Mega ground, 20000 guests with 4 dosa counters, continental, night starlight",
                      },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setTypedPrompt(preset.prompt);
                          parseSpokenBrief(preset.prompt);
                          toast.success("Applied preset template");
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#222530] border border-white/[0.08] text-[#8e95a5] hover:text-[#e2c99a] hover:border-[#e2c99a]/30 transition-all font-mono"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* 2. STRUCTURED SPECIFICATIONS OVERVIEW */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#e2c99a]">
                Custom Venue & Counter Allocation
              </h3>
              <span className="text-[11px] font-mono text-[#8e95a5]">
                Customizable anytime in 3D viewport
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column: Venue & Footprint */}
              <div className="p-4 rounded-xl border border-white/[0.08] bg-[#161820] space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#e2c99a]" />
                  <span className="text-xs font-bold text-white">Venue Footprint & Terrain</span>
                </div>

                <div className="space-y-2">
                  {PRESET_VENUES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setData((prev) => ({ ...prev, venue: v }))}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        data.venue.id === v.id
                          ? "bg-[#222530] border-[#e2c99a] text-white shadow-sm"
                          : "bg-[#0e1015] border-white/[0.05] text-[#8e95a5] hover:text-white"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{v.name}</div>
                        <div className="text-[10px] text-[#8e95a5] font-mono mt-0.5">
                          {v.hallWidth}m × {v.hallLength}m • {v.capacity} pax cap
                        </div>
                      </div>
                      {data.venue.id === v.id && (
                        <Check className="h-4 w-4 text-[#e2c99a]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Guest Capacity & Counters */}
              <div className="p-4 rounded-xl border border-white/[0.08] bg-[#161820] space-y-4">
                
                {/* Guest Capacity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#e2c99a]" />
                      <span className="text-xs font-bold text-white">Guest Head Count</span>
                    </div>
                    <span className="text-sm font-extrabold text-[#e2c99a] font-mono">
                      {data.headCount.toLocaleString("en-IN")} Pax
                    </span>
                  </div>

                  {/* Headcount Quick Chips */}
                  <div className="grid grid-cols-5 gap-1">
                    {[500, 1500, 3500, 10000, 100000].map((num) => (
                      <button
                        key={num}
                        onClick={() => setData((prev) => ({ ...prev, headCount: num }))}
                        className={`py-1 rounded-lg text-[10px] font-mono border transition-all ${
                          data.headCount === num
                            ? "bg-[#e2c99a] text-black font-bold border-[#e2c99a]"
                            : "bg-[#0e1015] border-white/[0.05] text-[#8e95a5] hover:text-white"
                        }`}
                      >
                        {num >= 100000 ? "1 Lakh" : num >= 1000 ? `${num / 1000}K` : num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Counter Multipliers */}
                <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                  <span className="text-xs font-bold text-white block">
                    Live Counter Duplication Setup
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Dosa Counters */}
                    <div className="p-2.5 rounded-lg bg-[#0e1015] border border-white/[0.05] flex items-center justify-between">
                      <span className="text-[#8e95a5]">Dosa Griddles:</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <button
                          onClick={() =>
                            setData((prev) => ({
                              ...prev,
                              counterCounts: {
                                ...prev.counterCounts,
                                dosa: Math.max(1, prev.counterCounts.dosa - 1),
                              },
                            }))
                          }
                          className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold text-[#e2c99a]">
                          {data.counterCounts.dosa}x
                        </span>
                        <button
                          onClick={() =>
                            setData((prev) => ({
                              ...prev,
                              counterCounts: {
                                ...prev.counterCounts,
                                dosa: Math.min(6, prev.counterCounts.dosa + 1),
                              },
                            }))
                          }
                          className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Idli Counters */}
                    <div className="p-2.5 rounded-lg bg-[#0e1015] border border-white/[0.05] flex items-center justify-between">
                      <span className="text-[#8e95a5]">Idli / Vada:</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <button
                          onClick={() =>
                            setData((prev) => ({
                              ...prev,
                              counterCounts: {
                                ...prev.counterCounts,
                                idli: Math.max(1, prev.counterCounts.idli - 1),
                              },
                            }))
                          }
                          className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold text-[#e2c99a]">
                          {data.counterCounts.idli}x
                        </span>
                        <button
                          onClick={() =>
                            setData((prev) => ({
                              ...prev,
                              counterCounts: {
                                ...prev.counterCounts,
                                idli: Math.min(4, prev.counterCounts.idli + 1),
                              },
                            }))
                          }
                          className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lighting Atmosphere */}
                <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
                  <span className="text-xs font-bold text-white block">
                    Atmospheric Lighting & Time
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "morning", label: "Muhurtham", icon: Sun },
                      { id: "sunset", label: "Sunset Gold", icon: Sunset },
                      { id: "night", label: "Starlight Gala", icon: Moon },
                    ].map((time) => {
                      const Icon = time.icon;
                      return (
                        <button
                          key={time.id}
                          onClick={() =>
                            setData((prev) => ({
                              ...prev,
                              timeOfDay: time.id as any,
                            }))
                          }
                          className={`p-1.5 rounded-lg border text-center flex items-center justify-center gap-1 text-[11px] transition-all ${
                            data.timeOfDay === time.id
                              ? "bg-[#e2c99a] text-black font-bold border-[#e2c99a]"
                              : "bg-[#0e1015] border-white/[0.05] text-[#8e95a5] hover:text-white"
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                          <span>{time.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Bottom Action Footer with Compilation State */}
        <div className="p-5 border-t border-white/[0.08] bg-[#161820] flex items-center justify-between">
          <div className="text-xs text-[#8e95a5] font-mono">
            {isCompiling ? (
              <span className="text-[#e2c99a] flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#e2c99a] animate-ping" />
                {COMPILING_STAGES[compilingStep]}
              </span>
            ) : (
              <span>
                Target: <strong>{data.venue.name}</strong> •{" "}
                <strong>{data.headCount.toLocaleString("en-IN")} Guests</strong> •{" "}
                <strong>{data.counterCounts.dosa}x Dosa Counters</strong>
              </span>
            )}
          </div>

          <Button
            size="lg"
            disabled={isCompiling}
            onClick={handleStartRender}
            className="px-6 py-2.5 rounded-xl font-display font-extrabold text-sm tracking-wide bg-[#e2c99a] hover:bg-[#c5a059] text-black shadow-lg flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <span>⚡ INITIALIZE 3D STUDIO & RENDER</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </div>
  );
};
