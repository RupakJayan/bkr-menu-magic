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
  FileText,
  Sparkles,
  Camera,
  Layers,
  ChefHat,
  Coffee,
  Flame,
  Info,
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
import { assetUrl } from "@/utils/assetUrl";

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
  customStallPhotos?: Record<string, string>;
  menuDishesSummary?: string[];
}

interface StudioEventBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: StudioBriefingData;
  onRenderStage: (data: StudioBriefingData) => void;
}

// Authentic Tamil Wedding Catering Stalls with Real Photographic References
export interface StallVisualTemplate {
  id: string;
  type: string;
  title: string;
  tamilTitle: string;
  photoUrl: string;
  description: string;
  equipment: string;
  typicalCapacity: string;
  matchedDishes: string[];
}

const DEFAULT_STALL_TEMPLATES: StallVisualTemplate[] = [
  {
    id: "dosa_live",
    type: "dosa",
    title: "Live Ghee Roast Dosa Counter",
    tamilTitle: "நேரடி நெய் ரோஸ்ட் தோசை அரங்கம்",
    photoUrl: assetUrl("/home-south-indian-food.jpg"),
    description: "Twin 40-inch cast iron griddles with isothermal PID heat. Golden paper roast dosas served piping hot with 3 chutneys & piping hot sambar.",
    equipment: "Dual 40\" Seasoned Cast-Iron Tawa, Brass Batter Urns, Ghee Sprinkler",
    typicalCapacity: "1,200 Dosas / hour",
    matchedDishes: ["Crisp Ghee Roast", "Podi Dosa", "Masala Dosa", "Onion Uthappam", "Eggplant Gothsu"],
  },
  {
    id: "idli_steamer",
    type: "idli",
    title: "Steaming Brass Idli & Medu Vada Bar",
    tamilTitle: "சூடான இட்லி & மெது வடை பந்தல்",
    photoUrl: assetUrl("/home-south-indian-food.jpg"),
    description: "Multi-tiered traditional brass steamer. Fluffy jasmine-soft idlis with gun-powder podi, hot shallot sambar & crispy medu vadas.",
    equipment: "3-Tier Heavy Brass Idli Steamer, Granite Chutney Grind Bowls",
    typicalCapacity: "1,800 Idlis / hour",
    matchedDishes: ["Kanchipuram Idli", "Mini Ghee Podi Idli", "Crisp Medu Vada", "Coconut Chutney", "Kothamalli Chutney"],
  },
  {
    id: "traditional_leaf",
    type: "traditional_service",
    title: "Traditional Banana Leaf Seating Spread",
    tamilTitle: "பாரம்பரிய தலைவாழை இலை விருந்து பந்தி",
    photoUrl: assetUrl("/home-south-indian-feast.jpg"),
    description: "Authentic seated banquet rows with pristine banana leaves, bronze serving buckets, salt, pickle, sweet, rice, sambar, rasam & payasam.",
    equipment: "Solid Teak Service Tables, Bronze Sambar Buckets, Brass Rice Ladles",
    typicalCapacity: "500 Guests / batch (35 min turnover)",
    matchedDishes: ["Paruppu Ghee", "Murungakkai Sambar", "Mysore Rasam", "Vazhaipoo Vadai", "Kootu & Poriyal"],
  },
  {
    id: "filter_coffee",
    type: "beverage_bar",
    title: "Kumbakonam Degree Filter Coffee Bar",
    tamilTitle: "கும்பகோணம் டிகிரி பில்டர் காபி அரங்கம்",
    photoUrl: assetUrl("/home-catering-table.jpg"),
    description: "Heavy brass decoction filters with foaming rich cow's milk. Poured with 2-foot meter tea/coffee flair into authentic dabarah tumblers.",
    equipment: "Chicory Brass Decoction Towers, Copper Milk Urn, Brass Dabarah Sets",
    typicalCapacity: "800 Cups / hour",
    matchedDishes: ["Degree Filter Coffee", "Sukku Malli Tea", "Masala Milk", "Elaneer Sarbath"],
  },
  {
    id: "royal_sweets",
    type: "dessert",
    title: "Royal Swarna Uruli Sweet & Payasam Stall",
    tamilTitle: "சுவர்ண உருளி இனிப்பு & பாயாசம் அரங்கம்",
    photoUrl: assetUrl("/bkr-catering-reference.png"),
    description: "Magnificent brass urulis decorated with fresh temple jasmine flowers and marigold garlands, serving warm ghee badam halwa & chilled tender coconut payasam.",
    equipment: "Panchaloha Antique Urulis, Jasmine Garlands, Silver Payasam Ladles",
    typicalCapacity: "2,500 Servings / event",
    matchedDishes: ["Elaneer Payasam", "Tirunelveli Halwa", "Kasi Halwa", "Rasmalai", "Gulab Jamun"],
  },
  {
    id: "evening_chaat",
    type: "chaat",
    title: "Artisan Live Chaat & Crisp Snack Kiosk",
    tamilTitle: "லைவ் சாட் & மொறுமொறு ஸ்நாக்ஸ் கியோஸ்க்",
    photoUrl: assetUrl("/home-south-indian-snacks.jpg"),
    description: "Live interactive chaat counter with stuffed pani puris, spicy dahi bhalla, piping hot samosas, and crunchy hot onion pakodas.",
    equipment: "Stainless Steel Cold Well, Immersion Fryer, Chutney Fountains",
    typicalCapacity: "650 Plates / hour",
    matchedDishes: ["Pani Puri", "Dahi Puri", "Samosa Chaat", "Onion Pakoda", "Spring Rolls"],
  },
];

export const StudioEventBriefingModal: React.FC<StudioEventBriefingModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onRenderStage,
}) => {
  if (!isOpen) return null;

  // Form states
  const [data, setData] = useState<StudioBriefingData>(() => {
    const v = initialData.venue;
    if (!v.blueprintUrl) {
      return { ...initialData, venue: { ...v, blueprintUrl: generateVenueBlueprintCanvas(v) } };
    }
    return initialData;
  });

  const [activeTab, setActiveTab] = useState<"speech" | "menu_upload" | "stall_photos" | "image" | "custom">("speech");
  const [typedPrompt, setTypedPrompt] = useState<string>("");

  // Live Web Audio API States
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(24).fill(8));
  const [decibelReading, setDecibelReading] = useState<number>(-42);
  const [lastSpokenTime, setLastSpokenTime] = useState<number>(0);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Menu Upload / Extraction States
  const [menuInputText, setMenuInputText] = useState<string>("");
  const [uploadedMenuImageUrl, setUploadedMenuImageUrl] = useState<string>("");
  const [extractedDishes, setExtractedDishes] = useState<string[]>([]);
  const [generatedStallTemplates, setGeneratedStallTemplates] = useState<StallVisualTemplate[]>(DEFAULT_STALL_TEMPLATES);
  const menuFileInputRef = useRef<HTMLInputElement | null>(null);

  // Venue Floorplan Image Upload States
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [customVenueName, setCustomVenueName] = useState<string>("Custom Architectural Venue");
  const [customWidth, setCustomWidth] = useState<number>(45);
  const [customLength, setCustomLength] = useState<number>(30);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Custom Stall Photo Upload
  const [selectedStallForPhoto, setSelectedStallForPhoto] = useState<string | null>(null);
  const [stallPhotoOverrides, setStallPhotoOverrides] = useState<Record<string, string>>({});
  const stallPhotoInputRef = useRef<HTMLInputElement | null>(null);

  // Compilation / rendering transition state
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilingStep, setCompilingStep] = useState(0);

  const COMPILING_STAGES = [
    "Synthesizing 3D Architectural Blueprint...",
    "Erecting Structural Space-Frame Trusses...",
    "Mounting Live Counters & Real Stall Photos...",
    "Calibrating Theatrical Stage Lighting...",
    "Finalizing CAD Viewport...",
  ];

  // Auto-silence stop helper (stops recording after 2.5s of silence)
  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch {}
        stopAudioAnalysis();
        setIsListening(false);
        toast.success("Voice brief captured and parsed!", {
          description: "All parameters and venue dimensions have been synchronized.",
        });
      }
    }, 2500);
  };

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
        setLastSpokenTime(Date.now());
        resetSilenceTimer();
        parseSpokenBrief(currentTranscript);
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e.error);
        stopAudioAnalysis();
        setIsListening(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      };

      recognition.onend = () => {
        stopAudioAnalysis();
        setIsListening(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      stopAudioAnalysis();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [isListening]);

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
      console.warn("Microphone stream fallback", err);
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

  const startListening = () => {
    setSpeechTranscript("");
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        startAudioAnalysis();
        toast.info("Listening... Speak your venue or catering brief.", {
          description: "Will automatically stop when you pause, or tap 'Stop Recording' anytime.",
        });
      } catch (err) {
        console.warn("Speech start failed", err);
      }
    } else {
      setIsListening(true);
      startAudioAnalysis();
      toast.info("Microphone visualizer active. You can speak or type your brief.");
    }
  };

  const stopListening = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    stopAudioAnalysis();
    setIsListening(false);
    toast.success("Recording stopped. Synthesized 3D parameters.");
  };

  // Natural Language & Speech Keyword Parser
  const parseSpokenBrief = (text: string) => {
    const lower = text.toLowerCase();

    // 1. Venue Matching
    const synthesizedVenue = synthesizeVenueFromQuery(text);
    if (synthesizedVenue) {
      setData((prev) => ({
        ...prev,
        venue: synthesizedVenue,
      }));
    }

    // 2. Guest Count
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

    // 3. Live Stalls
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

    const idliMatch = lower.match(/(\d+|two|three)\s*(idli|idly)/);
    if (idliMatch) {
      const qty = parseInt(idliMatch[1], 10) || (idliMatch[1] === "two" ? 2 : 1);
      setData((prev) => ({
        ...prev,
        counterCounts: { ...prev.counterCounts, idli: qty },
      }));
    }

    if (lower.includes("chaat") || lower.includes("pani puri")) {
      setData((prev) => ({
        ...prev,
        counterCounts: { ...prev.counterCounts, chaat: 2 },
      }));
    }

    // 4. Atmosphere
    if (lower.includes("sunset") || lower.includes("golden hour") || lower.includes("evening")) {
      setData((prev) => ({ ...prev, timeOfDay: "sunset" }));
    } else if (lower.includes("night") || lower.includes("serial light") || lower.includes("starlight")) {
      setData((prev) => ({ ...prev, timeOfDay: "night" }));
    } else if (lower.includes("morning") || lower.includes("muhurtham")) {
      setData((prev) => ({ ...prev, timeOfDay: "morning" }));
    }

    // 5. Amenities
    if (lower.includes("video wall") || lower.includes("led wall") || lower.includes("screen")) {
      setData((prev) => ({ ...prev, showVideoWall: true }));
    }
    if (lower.includes("focus light") || lower.includes("spotlight")) {
      setData((prev) => ({ ...prev, showFocusLights: true }));
    }
    if (lower.includes("dustbin") || lower.includes("waste bin")) {
      setData((prev) => ({ ...prev, showEcoDustbins: true }));
    }
  };

  const handleApplyTypedPrompt = () => {
    if (!typedPrompt.trim()) return;
    parseSpokenBrief(typedPrompt);
    toast.success("Venue & Parameters Synthesized", {
      description: `3D Model configured for ${data.venue.name}`,
    });
  };

  // Menu Analysis & AI Stall Generation Engine
  const analyzeMenuAndGenerateStalls = (text: string) => {
    if (!text.trim()) return;

    // Split text into dishes
    const items = text
      .split(/[\n,;•·\-–—]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2);

    setExtractedDishes(items);

    // AI Categorizer for Stalls
    let dosaCount = 1;
    let idliCount = 1;
    let chaatCount = 0;
    let coffeeCount = 1;
    let dessertCount = 1;

    const lower = text.toLowerCase();
    if (lower.includes("dosa") || lower.includes("dosai") || lower.includes("uthappam")) {
      dosaCount = items.filter((d) => d.toLowerCase().includes("dosa") || d.toLowerCase().includes("uthappam")).length > 1 ? 3 : 2;
    }
    if (lower.includes("idli") || lower.includes("vada") || lower.includes("vadai") || lower.includes("poori")) {
      idliCount = 2;
    }
    if (lower.includes("chaat") || lower.includes("pani puri") || lower.includes("cutlet") || lower.includes("samosa")) {
      chaatCount = 2;
    }
    if (lower.includes("coffee") || lower.includes("tea") || lower.includes("juice") || lower.includes("sarbath")) {
      coffeeCount = 2;
    }
    if (lower.includes("halwa") || lower.includes("payasam") || lower.includes("sweet") || lower.includes("jamun") || lower.includes("kesari")) {
      dessertCount = 2;
    }

    setData((prev) => ({
      ...prev,
      counterCounts: {
        ...prev.counterCounts,
        dosa: dosaCount,
        idli: idliCount,
        chaat: chaatCount,
        dessert: dessertCount,
      },
      menuDishesSummary: items,
    }));

    toast.success(`AI Menu Scan Complete: Found ${items.length} Dishes`, {
      description: `Configured ${dosaCount}x Live Dosa, ${idliCount}x Idli Bar, ${chaatCount}x Chaat, and ${dessertCount}x Royal Sweets.`,
    });
  };

  const handleMenuImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedMenuImageUrl(dataUrl);

      // AI OCR Mock parsing for Tamil & English Catering Menus
      const mockMenuDishes = [
        "Special Ghee Podi Roast Dosa",
        "Kanchipuram Idli & Medu Vada",
        "Kumbakonam Degree Filter Coffee",
        "Traditional Elaneer Payasam",
        "Tirunelveli Ghee Halwa",
        "Mini Samosa Chaat & Pani Puri",
        "South Indian Traditional Feast Meals",
        "Paruppu Ghee & Murungakkai Sambar",
        "Vazhaipoo Vadai & Potato Chips",
      ];
      setMenuInputText(mockMenuDishes.join("\n"));
      analyzeMenuAndGenerateStalls(mockMenuDishes.join("\n"));
    };
    reader.readAsDataURL(file);
  };

  // Stall Custom Photo Upload
  const handleUploadStallPhoto = (stallId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setStallPhotoOverrides((prev) => ({ ...prev, [stallId]: url }));
      setData((prev) => ({
        ...prev,
        customStallPhotos: { ...(prev.customStallPhotos || {}), [stallId]: url },
      }));
      toast.success("Stall Photograph Updated", {
        description: "This real-world image will be texture-mapped on the 3D model facade & canopy.",
      });
    };
    reader.readAsDataURL(file);
  };

  // Floorplan Image Upload Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImageUrl(dataUrl);

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
    }, 240);
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
                BKR // SPATIAL EVENT &amp; STAGING INTAKE
              </h2>
              <p className="text-[10px] font-mono text-neutral-400">
                Acoustic speech parsing, menu-to-stall synthesizer &amp; photographic 3D modeling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#222530] text-[#e2c99a] border border-white/10 hidden sm:inline">
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
          
          {/* NAVIGATION TABS */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-white/[0.08] pb-3 no-scrollbar">
            <button
              onClick={() => setActiveTab("speech")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all font-mono ${
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
              onClick={() => setActiveTab("menu_upload")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all font-mono ${
                activeTab === "menu_upload"
                  ? "bg-[#222530] text-[#e2c99a] border border-[#e2c99a]/40 shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>📄 Upload Menu → AI 3D Stalls</span>
              {extractedDishes.length > 0 && (
                <span className="text-[9px] px-1.5 py-0.2 bg-[#e2c99a] text-black font-bold rounded-full ml-1">
                  {extractedDishes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("stall_photos")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all font-mono ${
                activeTab === "stall_photos"
                  ? "bg-[#222530] text-[#e2c99a] border border-[#e2c99a]/40 shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>📸 Stall Photos &amp; Looks</span>
            </button>

            <button
              onClick={() => setActiveTab("image")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all font-mono ${
                activeTab === "image"
                  ? "bg-[#222530] text-[#e2c99a] border border-[#e2c99a]/40 shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Venue Blueprint</span>
            </button>

            <button
              onClick={() => setActiveTab("custom")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all font-mono ${
                activeTab === "custom"
                  ? "bg-[#222530] text-[#e2c99a] border border-[#e2c99a]/40 shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Parameters</span>
            </button>
          </div>

          {/* TAB 1: SPEECH INTAKE WITH AUTO-STOP & MANUAL STOP BUTTON */}
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
                      {isListening ? "RECORDING ACTIVE (Auto-stops on silence)" : "MICROPHONE STANDBY"}
                    </span>
                    <span>•</span>
                    <span>GAIN: {decibelReading} dB</span>
                  </div>
                </div>

                {/* Tactile Record / Stop Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {!isListening ? (
                    <button
                      onClick={startListening}
                      className="px-6 py-3.5 rounded-full bg-[#222530] text-[#e2c99a] hover:bg-[#2a2e3b] border border-[#e2c99a]/50 shadow-[0_0_25px_rgba(226,201,154,0.2)] flex items-center gap-2.5 font-mono font-bold text-xs active:scale-95 transition-all"
                    >
                      <Mic className="h-5 w-5 text-[#e2c99a]" />
                      <span>Tap to Speak Event Brief</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopListening}
                      className="px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_30px_rgba(225,29,72,0.5)] flex items-center gap-2.5 font-mono font-bold text-xs animate-pulse active:scale-95 transition-all cursor-pointer"
                    >
                      <MicOff className="h-5 w-5" />
                      <span>🔴 Stop Recording &amp; Synthesize 3D</span>
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white font-mono">
                    {isListening ? "Listening... Speak your venue, guest headcount, or live counters." : "Acoustic Speech Synthesis"}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-md font-mono">
                    Auto-stops automatically after 2.5 seconds of silence, or tap the red button above when finished speaking.
                  </p>
                </div>

                {/* Real-Time Live Transcript Display */}
                {(isListening || speechTranscript) && (
                  <div className="w-full p-4 rounded-xl bg-[#0e1015] border border-white/[0.08] text-left">
                    <span className="text-[10px] font-mono text-[#e2c99a] uppercase block mb-1">
                      Captured Voice Transcript:
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
                <div className="w-full pt-1">
                  <span className="text-[10px] font-mono text-neutral-400 block text-left mb-1.5 uppercase">
                    Sample Venues &amp; Briefs (1-Click Load):
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

          {/* TAB 2: UPLOAD CATERING MENU → AI 3D STALLS */}
          {activeTab === "menu_upload" && (
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#161820] space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#e2c99a]" />
                    <span>Upload Catering Menu &amp; Synthesize 3D Stalls</span>
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    Upload a photograph of your menu or enter dishes. AI will automatically construct matching live stalls with authentic photographs.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const sample = "Live Ghee Roast Dosa, Podi Idli, Medu Vada, Traditional Sambar & Chutney, Kumbakonam Degree Coffee, Royal Elaneer Payasam, Tirunelveli Halwa, Samosa Chaat";
                    setMenuInputText(sample);
                    analyzeMenuAndGenerateStalls(sample);
                  }}
                  className="text-[10px] font-mono border-white/10 text-[#e2c99a] hover:bg-white/5"
                >
                  Load Sample BKR Menu
                </Button>
              </div>

              {/* Upload Dropzone for Menu Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => menuFileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-white/15 hover:border-[#e2c99a]/60 rounded-xl p-5 text-center bg-[#0e1015]/70 transition-all flex flex-col items-center justify-center"
                >
                  <input
                    ref={menuFileInputRef}
                    type="file"
                    accept="image/*,.pdf,.txt"
                    onChange={handleMenuImageUpload}
                    className="hidden"
                  />
                  <Upload className="h-6 w-6 text-[#e2c99a] mb-2" />
                  <span className="text-xs font-mono font-bold text-white block">
                    Upload Menu Photo / Document
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 block mt-1">
                    Takes photo of menu card, printed list, or handwritten notes
                  </span>
                  {uploadedMenuImageUrl && (
                    <span className="text-[10px] text-emerald-400 font-mono mt-2 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Menu photo ingested
                    </span>
                  )}
                </div>

                {/* Paste / Type Menu Text */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase">
                    Or Type / Paste Menu Items:
                  </label>
                  <textarea
                    rows={4}
                    value={menuInputText}
                    onChange={(e) => setMenuInputText(e.target.value)}
                    placeholder="Enter dishes: e.g. Masala Dosa, Ghee Podi Idli, Filter Coffee, Elaneer Payasam, Chaat, Full Meals..."
                    className="w-full p-3 rounded-xl bg-[#0e1015] border border-white/10 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-[#e2c99a] resize-none"
                  />
                  <Button
                    size="sm"
                    onClick={() => analyzeMenuAndGenerateStalls(menuInputText)}
                    className="w-full bg-[#e2c99a] text-black hover:bg-[#c5a059] font-mono font-bold text-xs h-8"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Scan Menu &amp; Generate 3D Stalls
                  </Button>
                </div>
              </div>

              {/* Generated Stalls with Real Photographs */}
              <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#e2c99a] font-bold">
                    3D Catering Stalls Generated from Menu:
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Real photographs will be texture-mapped to 3D models
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {generatedStallTemplates.map((stall) => (
                    <div
                      key={stall.id}
                      className="rounded-xl border border-white/10 bg-[#0e1015] overflow-hidden flex flex-col group hover:border-[#e2c99a]/50 transition-all"
                    >
                      {/* Real Stall Photograph */}
                      <div className="relative h-28 w-full bg-black overflow-hidden">
                        <img
                          src={stallPhotoOverrides[stall.id] || stall.photoUrl}
                          alt={stall.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute bottom-2 left-2 text-[10px] font-mono font-bold text-[#e2c99a] px-1.5 py-0.5 rounded bg-black/70 border border-white/10">
                          {stall.tamilTitle}
                        </span>
                      </div>

                      {/* Stall Metadata */}
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h4 className="text-xs font-bold font-mono text-white">
                            {stall.title}
                          </h4>
                          <p className="text-[10px] text-neutral-400 font-mono mt-1 line-clamp-2">
                            {stall.description}
                          </p>
                        </div>

                        {/* Matched Dishes */}
                        <div className="flex flex-wrap gap-1">
                          {stall.matchedDishes.slice(0, 3).map((d, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-neutral-300 border border-white/[0.05]"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STALL PHOTOGRAPHS & REAL-WORLD APPEARANCE */}
          {activeTab === "stall_photos" && (
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#161820] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                    <Camera className="h-4 w-4 text-[#e2c99a]" />
                    <span>Real-World Stall Photographs &amp; Textures</span>
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    Inspect what each catering stall looks like in real life, or upload your own photographs to skin the 3D models.
                  </p>
                </div>
              </div>

              {/* Hidden file input for custom stall photo */}
              <input
                ref={stallPhotoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && selectedStallForPhoto) {
                    handleUploadStallPhoto(selectedStallForPhoto, file);
                  }
                }}
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEFAULT_STALL_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="p-3.5 rounded-xl border border-white/10 bg-[#0e1015] flex gap-3.5 items-start group"
                  >
                    <div className="relative w-28 h-24 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10">
                      <img
                        src={stallPhotoOverrides[tmpl.id] || tmpl.photoUrl}
                        alt={tmpl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={() => {
                          setSelectedStallForPhoto(tmpl.id);
                          stallPhotoInputRef.current?.click();
                        }}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[9px] font-mono text-white transition-opacity"
                        title="Upload Custom Stall Photo"
                      >
                        <Upload className="h-4 w-4 text-[#e2c99a] mb-1" />
                        <span>Change Photo</span>
                      </button>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold font-mono text-white truncate">
                          {tmpl.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-[#e2c99a] block">
                        {tmpl.tamilTitle}
                      </span>
                      <p className="text-[10px] text-neutral-400 font-mono leading-tight">
                        <strong className="text-neutral-300">Equip:</strong> {tmpl.equipment}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-mono leading-tight">
                        <strong className="text-neutral-300">Pax Velocity:</strong> {tmpl.typicalCapacity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VENUE FLOORPLAN / BLUEPRINT IMAGE TO 3D */}
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
                          Est. Width (m):
                        </label>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0e1015] border border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-1">
                          Est. Length (m):
                        </label>
                        <input
                          type="number"
                          value={customLength}
                          onChange={(e) => setCustomLength(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0e1015] border border-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MANUAL PARAMETERS */}
          {activeTab === "custom" && (
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#161820] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase font-mono mb-2">
                Configure Physical Event Parameters
              </h3>

              {/* Venue Selection */}
              <div>
                <label className="text-[10px] font-mono text-neutral-400 block mb-1.5 uppercase">
                  Select Architectural Mandapam Hall:
                </label>
                <select
                  value={data.venue.id}
                  onChange={(e) => {
                    const found = PRESET_VENUES.find((v) => v.id === e.target.value);
                    if (found) {
                      setData((prev) => ({
                        ...prev,
                        venue: { ...found, blueprintUrl: generateVenueBlueprintCanvas(found) },
                      }));
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0e1015] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#e2c99a]"
                >
                  {PRESET_VENUES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.hallWidth}m × {v.hallLength}m • {v.capacity.toLocaleString()} Pax Max)
                    </option>
                  ))}
                </select>
              </div>

              {/* Headcount Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400 uppercase text-[10px]">Headcount / விருந்தினர்:</span>
                  <span className="text-[#e2c99a] font-bold">
                    {data.headCount.toLocaleString("en-IN")} Pax
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={100000}
                  step={100}
                  value={data.headCount}
                  onChange={(e) => setData((prev) => ({ ...prev, headCount: Number(e.target.value) }))}
                  className="w-full accent-[#e2c99a]"
                />
              </div>

              {/* Counter Quantities Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { key: "dosa", label: "Live Dosa", count: data.counterCounts.dosa },
                  { key: "idli", label: "Idli Bar", count: data.counterCounts.idli },
                  { key: "chaat", label: "Live Chaat", count: data.counterCounts.chaat },
                  { key: "dessert", label: "Royal Sweets", count: data.counterCounts.dessert },
                ].map(({ key, label, count }) => (
                  <div key={key} className="p-3 rounded-xl bg-[#0e1015] border border-white/10 text-center space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                      {label}
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          setData((prev) => ({
                            ...prev,
                            counterCounts: {
                              ...prev.counterCounts,
                              [key]: Math.max(0, (prev.counterCounts as any)[key] - 1),
                            },
                          }))
                        }
                        className="w-6 h-6 rounded bg-[#222530] text-white flex items-center justify-center text-xs font-mono"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold text-white w-6">{count}</span>
                      <button
                        onClick={() =>
                          setData((prev) => ({
                            ...prev,
                            counterCounts: {
                              ...prev.counterCounts,
                              [key]: (prev.counterCounts as any)[key] + 1,
                            },
                          }))
                        }
                        className="w-6 h-6 rounded bg-[#222530] text-white flex items-center justify-center text-xs font-mono"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE BRIEF SUMMARY CAROUSEL */}
          <div className="p-4 rounded-xl border border-white/10 bg-[#0e1015] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#e2c99a]" />
              <span className="text-neutral-400">Target Venue:</span>
              <strong className="text-white">{data.venue.name}</strong>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#222530] text-[#e2c99a] border border-white/10">
                {data.venue.hallWidth}m × {data.venue.hallLength}m
              </span>
            </div>

            <div className="flex items-center gap-4 text-neutral-400 text-[11px]">
              <span>
                Pax: <strong className="text-white">{data.headCount.toLocaleString("en-IN")}</strong>
              </span>
              <span>
                Dosa: <strong className="text-white">{data.counterCounts.dosa}x</strong>
              </span>
              <span>
                Lighting: <strong className="text-white">{data.timeOfDay}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer / Render Action */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-[#161820]">
          <span className="text-[10px] font-mono text-neutral-400 hidden sm:block">
            Hardware-Accelerated 3D WebGL Canvas • Three.js R162
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>

            <Button
              onClick={handleStartRender}
              disabled={isCompiling}
              className="px-6 py-2.5 rounded-xl bg-[#e2c99a] text-black hover:bg-[#c5a059] font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(226,201,154,0.3)] active:scale-95"
            >
              {isCompiling ? (
                <span className="flex items-center gap-2">
                  <Activity className="h-4 w-4 animate-spin" />
                  <span>{COMPILING_STAGES[compilingStep] || "Rendering 3D Stage..."}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span>Render 3D Event Staging</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
