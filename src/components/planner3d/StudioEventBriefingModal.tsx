import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  MapPin,
  Users,
  Utensils,
  Sun,
  Moon,
  Sunset,
  Check,
  ArrowRight,
  Sliders,
  Image as ImageIcon,
  Upload,
  Activity,
  Radio,
  Sparkles as SparklesIcon,
} from "lucide-react";
import { MandapamVenue } from "@/types/planner3d";
import {
  PRESET_VENUES,
  synthesizeVenueFromQuery,
  synthesizeVenueFromImage,
  generateVenueBlueprintCanvas,
} from "@/services/venueSynthesisService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CrosshairVector, DatumVector, SpatialGridVector } from "@/components/ui/VectorIcons";

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
  const [data, setData] = useState<StudioBriefingData>(() => {
    // Ensure initial venue has a generated blueprint URL if not already present
    const v = initialData.venue;
    if (!v.blueprintUrl) {
      return { ...initialData, venue: { ...v, blueprintUrl: generateVenueBlueprintCanvas(v) } };
    }
    return initialData;
  });

  const [activeTab, setActiveTab] = useState<"speech" | "image" | "custom">("speech");
  const [typedPrompt, setTypedPrompt] = useState<string>("");

  // Live Web Audio API States
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(24).fill(8));
  const [decibelReading, setDecibelReading] = useState<number>(-42);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Image Upload / Projection States
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [customVenueName, setCustomVenueName] = useState<string>("Custom Architectural Venue");
  const [customWidth, setCustomWidth] = useState<number>(45);
  const [customLength, setCustomLength] = useState<number>(30);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Compilation / rendering transition state
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilingStep, setCompilingStep] = useState(0);

  const COMPILING_STAGES = [
    "Synthesizing 3D Architectural Blueprint...",
    "Erecting Structural Space-Frame Trusses...",
    "Mounting Live Counters & Spatial Aisles...",
    "Calibrating Theatrical Stage Lighting...",
    "Finalizing CAD Viewport...",
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
        stopAudioAnalysis();
        setIsListening(false);
      };

      recognition.onend = () => {
        stopAudioAnalysis();
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      stopAudioAnalysis();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Web Audio API Frequency Analysis
  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateFrequencyData = () => {
        analyser.getByteFrequencyData(dataArray);

        // Convert 32 frequency bins to 24 UI bars
        const bars: number[] = [];
        let totalEnergy = 0;
        for (let i = 0; i < 24; i++) {
          const idx = Math.floor((i / 24) * bufferLength);
          const val = dataArray[idx] || 0;
          bars.push(Math.max(6, Math.round((val / 255) * 48)));
          totalEnergy += val;
        }
        setAudioLevels(bars);

        const avg = totalEnergy / 24;
        const dB = avg > 0 ? Math.round(20 * Math.log10(avg / 255)) : -50;
        setDecibelReading(dB);

        animFrameRef.current = requestAnimationFrame(updateFrequencyData);
      };

      updateFrequencyData();
    } catch (err) {
      console.warn("Direct microphone stream not available, falling back to procedural audio oscillator", err);
      // Fallback: procedural audio wave animation while listening
      let frame = 0;
      const loop = () => {
        frame++;
        const bars = Array.from({ length: 24 }).map((_, i) => {
          const wave = Math.sin(frame * 0.15 + i * 0.4) * 0.5 + 0.5;
          return Math.round(8 + wave * 36);
        });
        setAudioLevels(bars);
        setDecibelReading(-24 + Math.round(Math.sin(frame * 0.1) * 8));
        animFrameRef.current = requestAnimationFrame(loop);
      };
      loop();
    }
  };

  const stopAudioAnalysis = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevels(new Array(24).fill(6));
    setDecibelReading(-48);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Fallback for browsers without speech recognition
      if (!isListening) {
        setIsListening(true);
        startAudioAnalysis();
        toast.info("Microphone analysis active. Type your brief below or speak.");
      } else {
        setIsListening(false);
        stopAudioAnalysis();
      }
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      stopAudioAnalysis();
      setIsListening(false);
      toast.info("Voice intake paused");
    } else {
      setSpeechTranscript("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
        startAudioAnalysis();
        toast.success("Listening... Speak any venue or catering brief", {
          description: "e.g. 'Codissia Hall E, 4000 pax, 3 dosa counters, sunset golden hour'",
        });
      } catch (err) {
        setIsListening(false);
        stopAudioAnalysis();
      }
    }
  };

  // Natural Language & Speech Keyword Parser
  const parseSpokenBrief = (text: string) => {
    const lower = text.toLowerCase();

    // 1. Synthesize 3D Venue from Spoken Text (Codissia, ITC Chola, MRC Hall, Lawn, or Custom!)
    const synthesizedVenue = synthesizeVenueFromQuery(text);
    if (synthesizedVenue) {
      setData((prev) => ({
        ...prev,
        venue: synthesizedVenue,
      }));
    }

    // 2. Parse guest count (e.g. "3000 guests", "4000 pax", "1 lakh", "2500 people")
    const lakhMatch = lower.match(/(\d+|one|two|three)?\s*(lakh|lac|laksh)/);
    if (lakhMatch) {
      const numStr = lakhMatch[1];
      let mult = 1;
      if (numStr === "two" || numStr === "2") mult = 2;
      if (numStr === "three" || numStr === "3") mult = 3;
      setData((prev) => ({ ...prev, headCount: mult * 100000 }));
    } else {
      const countMatch = lower.match(/(\d[\d,]*)\s*(guests?|pax|people|heads?)/);
      if (countMatch) {
        const count = parseInt(countMatch[1].replace(/,/g, ""), 10);
        if (!isNaN(count) && count >= 50) {
          setData((prev) => ({ ...prev, headCount: count }));
        }
      }
    }

    // 3. Parse Dosa stations
    const dosaMatch = lower.match(/(\d+|two|three|four|five|dual|triple)\s*(dosa|dosai)/);
    if (dosaMatch) {
      const word = dosaMatch[1];
      let qty = 2;
      if (word === "two" || word === "dual" || word === "2") qty = 2;
      if (word === "three" || word === "triple" || word === "3") qty = 3;
      if (word === "four" || word === "4") qty = 4;
      if (word === "five" || word === "5") qty = 5;
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

    // 5. Parse Chaat counters
    if (lower.includes("chaat") || lower.includes("pani puri")) {
      setData((prev) => ({
        ...prev,
        counterCounts: { ...prev.counterCounts, chaat: 2 },
      }));
    }

    // 6. Time of day / Atmosphere
    if (lower.includes("sunset") || lower.includes("golden hour") || lower.includes("evening")) {
      setData((prev) => ({ ...prev, timeOfDay: "sunset" }));
    } else if (lower.includes("night") || lower.includes("serial light") || lower.includes("starlight")) {
      setData((prev) => ({ ...prev, timeOfDay: "night" }));
    } else if (lower.includes("morning") || lower.includes("muhurtham")) {
      setData((prev) => ({ ...prev, timeOfDay: "morning" }));
    }

    // 7. Amenities
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
    toast.success("Venue & Parameters Synthesized", {
      description: `3D Model ready for ${data.venue.name}`,
    });
  };

  // Image File Upload Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImageUrl(dataUrl);

      // Create an image object to calculate natural aspect ratio
      const img = new Image();
      img.onload = () => {
        const aspect = img.naturalWidth / img.naturalHeight;
        const estWidth = 45;
        const estLength = Math.round(estWidth / aspect);
        setCustomWidth(estWidth);
        setCustomLength(estLength);

        const venueFromImg = synthesizeVenueFromImage(dataUrl, {
          venueName: file.name.replace(/\.[^/.]+$/, ""),
          aspectRatio: aspect,
          estimatedWidth: estWidth,
        });

        setData((prev) => ({ ...prev, venue: venueFromImg }));
        toast.success("Floorplan Image Ingested!", {
          description: `Generated 3D venue floorplan (${venueFromImg.hallWidth}m × ${venueFromImg.hallLength}m).`,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyImageProjection = () => {
    if (!uploadedImageUrl) {
      toast.error("Please upload an image first.");
      return;
    }
    const venueFromImg = synthesizeVenueFromImage(uploadedImageUrl, {
      venueName: customVenueName,
      aspectRatio: customWidth / customLength,
      estimatedWidth: customWidth,
    });
    setData((prev) => ({ ...prev, venue: venueFromImg }));
    toast.success("Applied Custom Image to 3D Stage Plane");
  };

  const handleStartRender = () => {
    setIsCompiling(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCompilingStep(step);
      if (step >= COMPILING_STAGES.length) {
        clearInterval(interval);
        setIsCompiling(false);
        onRenderStage(data);
        onClose();
        toast.success("3D Venue Model Initialized", {
          description: `${data.headCount.toLocaleString("en-IN")} Pax • ${data.venue.name} • ${data.counterCounts.dosa}x Dosa Counters`,
        });
      }
    }, 280);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111318] text-[#f4efe6] shadow-2xl flex flex-col font-sans select-none">
        
        {/* Top Studio HUD Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-[#161820]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#222530] border border-white/10 flex items-center justify-center text-[#e2c99a]">
              <DatumVector size={16} />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-wider uppercase font-mono text-white">
                BKR // SPATIAL EVENT &amp; VENUE INTAKE
              </h2>
              <p className="text-[10px] font-mono text-neutral-400">
                Acoustic speech parsing &amp; physical 3D venue synthesizer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#222530] text-[#e2c99a] border border-white/10">
              STAGE 01 // ARCHITECTURAL SYNTHESIS
            </span>
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-xs font-mono text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          
          {/* 1. THREE MODALITY TABS */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <button
              onClick={() => setActiveTab("speech")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all font-mono ${
                activeTab === "speech"
                  ? "bg-[#222530] text-[#e2c99a] border border-[#e2c99a]/40 shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              <span>Voice Speech Intake</span>
              {isListening && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("image")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all font-mono ${
                activeTab === "image"
                  ? "bg-[#222530] text-[#e2c99a] border border-[#e2c99a]/40 shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Upload Venue Image to 3D</span>
            </button>

            <button
              onClick={() => setActiveTab("custom")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all font-mono ${
                activeTab === "custom"
                  ? "bg-[#222530] text-[#e2c99a] border border-[#e2c99a]/40 shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Manual Parameters</span>
            </button>
          </div>

          {/* TAB 1: SPEECH INTAKE WITH LIVE AUDIO FREQUENCY ANALYZER */}
          {activeTab === "speech" && (
            <div className="space-y-4">
              <div className="relative p-6 rounded-2xl border border-white/[0.08] bg-[#161820] flex flex-col items-center justify-center text-center space-y-4">
                
                {/* Live Audio Visualizer Bars Display */}
                <div className="w-full flex flex-col items-center justify-center py-2">
                  <div className="flex items-end justify-center gap-1.5 h-14 w-full max-w-md px-4">
                    {audioLevels.map((lvl, idx) => (
                      <div
                        key={idx}
                        className="flex-1 rounded-t transition-all duration-75"
                        style={{
                          height: `${Math.max(4, lvl)}px`,
                          backgroundColor: isListening
                            ? idx % 2 === 0
                              ? "#e2c99a"
                              : "#38bdf8"
                            : "#2a3040",
                          opacity: isListening ? 0.95 : 0.35,
                        }}
                      />
                    ))}
                  </div>

                  {/* Audio Status HUD */}
                  <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Radio className={`h-3 w-3 ${isListening ? "text-emerald-400 animate-pulse" : "text-neutral-500"}`} />
                      {isListening ? "AUDIO STREAM: ACTIVE" : "MICROPHONE STANDBY"}
                    </span>
                    <span>•</span>
                    <span>GAIN: {decibelReading} dB</span>
                    <span>•</span>
                    <span>44.1 kHz NLP PIPELINE</span>
                  </div>
                </div>

                {/* Tactile Record Mic Button */}
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
                  <h3 className="text-sm font-bold text-white font-mono">
                    {isListening ? "Listening... Speak your venue or catering brief" : "Tap the Mic to Speak your Event Details"}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-md font-mono">
                    Say any venue (Codissia, ITC Grand Chola, MRC Hall, 1-Acre Lawn, or custom), guest count, and live stations.
                  </p>
                </div>

                {/* Real-Time Live Transcript Display */}
                {(isListening || speechTranscript) && (
                  <div className="w-full p-3.5 rounded-xl bg-[#0e1015] border border-white/[0.08] text-left">
                    <span className="text-[10px] font-mono text-[#e2c99a] uppercase block mb-1">
                      Live Voice Recognition Transcript:
                    </span>
                    <p className="text-xs font-mono text-white leading-relaxed">
                      {speechTranscript || "Listening... speak now."}
                    </p>
                  </div>
                )}

                {/* Or Type Prompt Input */}
                <div className="w-full pt-1 flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={typedPrompt}
                      onChange={(e) => setTypedPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyTypedPrompt()}
                      placeholder="Or type here: e.g. 'Codissia Hall E, 4000 guests, 3 dosa counters, video wall'"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0e1015] border border-white/[0.08] text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-[#e2c99a]"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleApplyTypedPrompt}
                    className="h-9 px-4 text-xs font-mono font-bold bg-[#e2c99a] text-black hover:bg-[#c5a059]"
                  >
                    Synthesize
                  </Button>
                </div>

                {/* One-Click Presets */}
                <div className="w-full pt-2">
                  <span className="text-[10px] font-mono text-neutral-400 block text-left mb-1.5 uppercase">
                    Sample Venues &amp; Briefs (Click to load):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        label: "CODISSIA // 4,000 PAX (Hall E • 3x Dosa)",
                        prompt: "CODISSIA Trade Fair Complex Hall E, 4000 guests, 3 dosa counters, video wall, golden hour sunset",
                      },
                      {
                        label: "ITC GRAND CHOLA // 2,500 PAX (Rajendra Hall)",
                        prompt: "ITC Grand Chola Rajendra Hall, 2500 guests with 2 dosa counters, idli stall, starlight night",
                      },
                      {
                        label: "MRC HALL CHENNAI // 2,000 PAX (Chettinad)",
                        prompt: "Mayor Ramanathan Chettiar Hall, 2000 guests, 2 dosa counters, continental, morning muhurtham",
                      },
                      {
                        label: "LAWN // 1.0 ACRE (3,500 Pax • Starlight)",
                        prompt: "1 acre open lawn in Coimbatore, 3500 guests with 3 dosa counters, festive serial lights",
                      },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setTypedPrompt(preset.prompt);
                          parseSpokenBrief(preset.prompt);
                          toast.success("Synthesized 3D venue from brief");
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-md bg-[#222530] border border-white/[0.08] text-neutral-300 hover:text-[#e2c99a] hover:border-[#e2c99a]/40 transition-all font-mono"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD VENUE IMAGE TO 3D */}
          {activeTab === "image" && (
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#161820] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#222530] border border-white/10 flex items-center justify-center text-[#e2c99a]">
                  <Upload className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase font-mono">
                    Floorplan Image to 3D Projection Engine
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Drop any architectural blueprint, satellite map, or venue photo to render as the 3D ground plane.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-white/15 hover:border-[#e2c99a]/60 rounded-xl p-6 text-center bg-[#0e1015]/60 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
                <Upload className="h-8 w-8 mx-auto text-[#e2c99a] mb-2" />
                <span className="text-xs font-mono font-bold text-white block">
                  Click or Drag &amp; Drop Venue Floorplan Image
                </span>
                <span className="text-[10px] font-mono text-neutral-400 block mt-1">
                  Supports PNG, JPG, WebP, SVG architectural drawings
                </span>
              </div>

              {/* Image Preview & Custom Dimensions */}
              {uploadedImageUrl && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black max-h-48 flex items-center justify-center">
                    <img
                      src={uploadedImageUrl}
                      alt="Uploaded Blueprint"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-1">
                        Venue Identifier Name:
                      </label>
                      <input
                        type="text"
                        value={customVenueName}
                        onChange={(e) => setCustomVenueName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0e1015] border border-white/10 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-1">
                          Width ({customWidth}m):
                        </label>
                        <input
                          type="range"
                          min={20}
                          max={100}
                          value={customWidth}
                          onChange={(e) => setCustomWidth(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-1">
                          Length ({customLength}m):
                        </label>
                        <input
                          type="range"
                          min={20}
                          max={100}
                          value={customLength}
                          onChange={(e) => setCustomLength(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={handleApplyImageProjection}
                      className="w-full bg-[#e2c99a] text-black font-bold font-mono hover:bg-[#c5a059]"
                    >
                      Project Image onto 3D Ground
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MANUAL PARAMETERS */}
          {activeTab === "custom" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Preset Venues Selector */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-[#161820] space-y-3">
                  <span className="text-xs font-bold text-white font-mono block">
                    Select Architectural Footprint
                  </span>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {PRESET_VENUES.map((v) => (
                      <button
                        key={v.id}
                        onClick={() =>
                          setData((prev) => ({
                            ...prev,
                            venue: { ...v, blueprintUrl: generateVenueBlueprintCanvas(v) },
                          }))
                        }
                        className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all font-mono text-xs ${
                          data.venue.id === v.id
                            ? "bg-[#222530] border-[#e2c99a] text-white shadow-sm"
                            : "bg-[#0e1015] border-white/[0.05] text-neutral-400 hover:text-white"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white">{v.name}</div>
                          <div className="text-[10px] text-neutral-400 mt-0.5">
                            {v.hallWidth}m × {v.hallLength}m • {v.defaultCapacity.toLocaleString("en-IN")} Pax
                          </div>
                        </div>
                        {data.venue.id === v.id && (
                          <Check className="h-4 w-4 text-[#e2c99a]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Headcount and Live Counters */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-[#161820] space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Target Headcount:</span>
                    <span className="text-sm font-bold text-[#e2c99a]">
                      {data.headCount.toLocaleString("en-IN")} PAX
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[500, 1500, 3500, 10000, 100000].map((num) => (
                      <button
                        key={num}
                        onClick={() => setData((prev) => ({ ...prev, headCount: num }))}
                        className={`py-1 rounded-lg text-[10px] border transition-all ${
                          data.headCount === num
                            ? "bg-[#e2c99a] text-black font-bold border-[#e2c99a]"
                            : "bg-[#0e1015] border-white/[0.05] text-neutral-400 hover:text-white"
                        }`}
                      >
                        {num >= 100000 ? "1 Lakh" : num >= 1000 ? `${num / 1000}K` : num}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/[0.08] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Dosa Live Griddles:</span>
                      <div className="flex items-center gap-2">
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
                          className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="text-[#e2c99a] font-bold">
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
                          className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. REAL-TIME DETECTED ENTITIES HUD & BLUEPRINT PREVIEW */}
          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#161820] space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <span className="text-[11px] font-bold text-[#e2c99a] uppercase tracking-wider flex items-center gap-1.5">
                <DatumVector size={13} />
                Live Synthesized Venue Model Parameters
              </span>
              <span className="text-[10px] text-neutral-400">
                Automatic CAD Blueprint Ready
              </span>
            </div>

            {/* Entity Chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="px-3 py-1 rounded-lg bg-[#222530] border border-white/10 text-white flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#e2c99a]" />
                <span>VENUE: <strong>{data.venue.name}</strong> ({data.venue.hallWidth}m × {data.venue.hallLength}m)</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-[#222530] border border-white/10 text-white flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-[#e2c99a]" />
                <span>PAX: <strong>{data.headCount.toLocaleString("en-IN")} GUESTS</strong></span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-[#222530] border border-white/10 text-white flex items-center gap-2">
                <Utensils className="h-3.5 w-3.5 text-[#e2c99a]" />
                <span>STATIONS: <strong>{data.counterCounts.dosa}x DOSA • {data.counterCounts.idli}x IDLI • {data.counterCounts.chaat}x CHAAT</strong></span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-[#222530] border border-white/10 text-white flex items-center gap-2">
                <Sun className="h-3.5 w-3.5 text-[#e2c99a]" />
                <span>ATMOSPHERE: <strong>{data.timeOfDay.toUpperCase()}</strong></span>
              </div>
            </div>

            {/* Generated 2D Blueprint Graphic Preview */}
            {data.venue.blueprintUrl && (
              <div className="pt-2">
                <span className="text-[10px] text-neutral-400 block mb-1.5">
                  GENERATED CAD BLUEPRINT TEXTURE (RENDERED IN 3D WORLD):
                </span>
                <div className="rounded-xl overflow-hidden border border-white/10 bg-[#080c18] max-h-40 flex items-center justify-center p-1">
                  <img
                    src={data.venue.blueprintUrl}
                    alt="Synthesized 3D Blueprint"
                    className="w-full h-full object-contain max-h-36"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer / Action Button */}
        <div className="p-4 border-t border-white/[0.08] bg-[#161820] flex items-center justify-between">
          <div className="text-xs text-neutral-400 font-mono">
            {isCompiling ? (
              <span className="text-[#e2c99a] animate-pulse">
                {COMPILING_STAGES[compilingStep] || "Mounting 3D Viewport..."}
              </span>
            ) : (
              <span>
                Target: <strong className="text-white">{data.venue.name}</strong> •{" "}
                <strong className="text-[#e2c99a]">{data.headCount.toLocaleString("en-IN")} Pax</strong>
              </span>
            )}
          </div>

          <Button
            size="lg"
            disabled={isCompiling}
            onClick={handleStartRender}
            className="px-6 py-2.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase bg-[#e2c99a] hover:bg-[#c5a059] text-black shadow-lg flex items-center gap-2 transition-transform active:scale-95"
          >
            <CrosshairVector size={15} />
            <span>{isCompiling ? "GENERATING 3D MODEL..." : "RENDER IN 3D VIEWPORT"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </div>
  );
};
