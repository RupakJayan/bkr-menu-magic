import React, { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Layers,
  MapPin,
  Camera,
  Grid,
  RotateCw,
  Copy,
  Trash2,
  Plus,
  ArrowLeft,
  Share2,
  Zap,
  Droplet,
  Utensils,
  Maximize2,
  ChevronRight,
  Eye,
  Users,
  Lightbulb,
  ExternalLink,
  Mic,
  Sliders,
  Image as ImageIcon,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ThreeCanvas } from "@/components/planner3d/ThreeCanvas";
import { SmartCounterAdvisor } from "@/components/planner3d/SmartCounterAdvisor";
import { MandapamSelectorModal } from "@/components/planner3d/MandapamSelectorModal";
import { CustomStallCreatorModal } from "@/components/planner3d/CustomStallCreatorModal";
import {
  StudioEventBriefingModal,
  StudioBriefingData,
} from "@/components/planner3d/StudioEventBriefingModal";
import { GoogleMapsVenueSearchDialog } from "@/components/planner3d/GoogleMapsVenueSearchDialog";
import { PrecisionDimensionsInspector } from "@/components/planner3d/PrecisionDimensionsInspector";
import { VectorGridOverlay } from "@/components/effects/VectorGridOverlay";
import {
  CrosshairVector,
  DatumVector,
  SpatialGridVector,
  DimensionCaliperVector,
} from "@/components/ui/VectorIcons";
import {
  StallItem,
  StallType,
  BudgetTier,
  CameraViewMode,
  MandapamVenue,
} from "@/types/planner3d";
import {
  PRESET_VENUES,
  STALL_CATALOG,
  calculateCapacityAnalysis,
  getRecommendedStalls,
} from "@/services/planner3dService";
import {
  synthesizeVenueFromQuery,
  synthesizeVenueFromImage,
  generateVenueBlueprintCanvas,
} from "@/services/venueSynthesisService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Planner3DPage: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Venue state
  const [selectedVenue, setSelectedVenue] = useState<MandapamVenue>(() => {
    const v = PRESET_VENUES[0];
    return {
      ...v,
      blueprintUrl: v.blueprintUrl || generateVenueBlueprintCanvas(v),
    };
  });
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isCustomStallModalOpen, setIsCustomStallModalOpen] = useState(false);

  // Instant Top Bar Synthesizer States
  const [venueQueryInput, setVenueQueryInput] = useState("");
  const [isTopBarListening, setIsTopBarListening] = useState(false);

  const handleSynthesizeTopBarVenue = (overrideQuery?: string) => {
    const q = overrideQuery || venueQueryInput;
    if (!q.trim()) return;
    const synthesized = synthesizeVenueFromQuery(q);
    setSelectedVenue(synthesized);
    toast.success(`Synthesized 3D Venue: ${synthesized.name}`, {
      description: `3D Blueprint projected (${synthesized.hallWidth}m × ${synthesized.hallLength}m).`,
    });
    setVenueQueryInput("");
  };

  const handleSelectPresetVenue = (preset: MandapamVenue) => {
    const withBlueprint = {
      ...preset,
      blueprintUrl: preset.blueprintUrl || generateVenueBlueprintCanvas(preset),
    };
    setSelectedVenue(withBlueprint);
    toast.info(`Switched to ${preset.name}`);
  };

  const handleDirectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const aspect = img.naturalWidth / img.naturalHeight;
        const estWidth = 45;
        const venueFromImg = synthesizeVenueFromImage(dataUrl, {
          venueName: file.name.replace(/\.[^/.]+$/, ""),
          aspectRatio: aspect,
          estimatedWidth: estWidth,
        });
        setSelectedVenue(venueFromImg);
        toast.success("Venue Image Projected into 3D World!", {
          description: `Rendered blueprint plane (${venueFromImg.hallWidth}m × ${venueFromImg.hallLength}m).`,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const toggleTopBarListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Please type the venue name.");
      return;
    }
    if (isTopBarListening) {
      setIsTopBarListening(false);
      return;
    }
    try {
      const recog = new SpeechRecognition();
      recog.lang = "en-IN";
      recog.continuous = false;
      recog.onresult = (e: any) => {
        const spoken = e.results[0][0].transcript;
        setVenueQueryInput(spoken);
        handleSynthesizeTopBarVenue(spoken);
        setIsTopBarListening(false);
      };
      recog.onerror = () => setIsTopBarListening(false);
      recog.onend = () => setIsTopBarListening(false);
      recog.start();
      setIsTopBarListening(true);
      toast.info("Listening... Say any venue name");
    } catch {
      setIsTopBarListening(false);
    }
  };

  // STARTING STEP: Studio Event Briefing Modal (Opens on demand, does not block viewport)
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isGoogleMapsModalOpen, setIsGoogleMapsModalOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"inspector" | "advisor">("inspector");

  // Planning state (Default: 3,500 guests, 2 Dosa counters)
  const [headCount, setHeadCount] = useState<number>(3500);
  const [stalls, setStalls] = useState<StallItem[]>(() =>
    getRecommendedStalls(3500, "classic", PRESET_VENUES[0])
  );
  const [selectedStallId, setSelectedStallId] = useState<string | null>(null);

  const handleSelectStall = (stall: StallItem | null) => {
    setSelectedStallId(stall ? stall.id : null);
    if (stall) {
      setIsSidebarOpen(true);
      setSidebarTab("inspector");
    }
  };

  const handleUpdateStall = (updatedStall: StallItem) => {
    setStalls((prev) =>
      prev.map((s) => (s.id === updatedStall.id ? updatedStall : s))
    );
  };

  const handleDeleteStall = (id: string) => {
    setStalls((prev) => prev.filter((s) => s.id !== id));
    if (selectedStallId === id) setSelectedStallId(null);
    toast.info("Stall removed from scene");
  };

  // View & visualization controls
  const [viewMode, setViewMode] = useState<CameraViewMode>("orbit");
  const [blueprintOpacity, setBlueprintOpacity] = useState<number>(0.35);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showCrowdSimulation, setShowCrowdSimulation] = useState<boolean>(false);
  const [showCadAisles, setShowCadAisles] = useState<boolean>(false);
  const [showFocusLights, setShowFocusLights] = useState<boolean>(true);
  const [isPitchMode, setIsPitchMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Capacity analysis recalculation (Custom flow, no budget calculation needed)
  const analysis = useMemo(
    () => calculateCapacityAnalysis(headCount, stalls, "classic"),
    [headCount, stalls]
  );

  const selectedStall = useMemo(
    () => stalls.find((s) => s.id === selectedStallId) || null,
    [stalls, selectedStallId]
  );

  // Initial Briefing Data state
  const initialBriefingData = useMemo<StudioBriefingData>(() => ({
    eventTitle: "Grand Kalyanam & Reception",
    venue: selectedVenue,
    headCount: headCount,
    counterCounts: {
      dosa: stalls.filter((s) => s.type === "dosa").length || 2,
      idli: stalls.filter((s) => s.type === "idli_steamer").length || 1,
      chaat: stalls.filter((s) => s.type === "chaat").length || 1,
      continental: stalls.filter((s) => s.type === "continental").length || 1,
      dessert: 1,
      tamboolam: 1,
    },
    timeOfDay: (selectedVenue.timeOfDay as any) || "sunset",
    showFocusLights: true,
    showVideoWall: true,
    showEcoDustbins: true,
  }), [selectedVenue, headCount, stalls]);

  // Handle rendering stage from Studio Event Briefing (Speech or Custom Input)
  const handleRenderFromBriefing = (briefing: StudioBriefingData) => {
    setSelectedVenue(briefing.venue);
    setHeadCount(briefing.headCount);
    setShowFocusLights(briefing.showFocusLights);

    const w = briefing.venue.hallWidth;
    const l = briefing.venue.hallLength;
    const newStalls: StallItem[] = [];

    // 1. Entrance Welcome drinks
    newStalls.push({
      ...STALL_CATALOG.welcome_drinks,
      id: "welcome-1",
      position: [0, 0, briefing.venue.entrancePosition[2] - 3.5],
      rotation: 0,
      wing: "North",
    });

    // 2. Handwash stations (at entrance and dining wings)
    newStalls.push({
      ...STALL_CATALOG.handwash_station,
      id: "handwash-1",
      position: [w / 2 - 3.5, 0, briefing.venue.entrancePosition[2] - 2],
      rotation: -Math.PI / 2,
      wing: "South",
    });
    newStalls.push({
      ...STALL_CATALOG.handwash_station,
      id: "handwash-2",
      position: [-w / 2 + 3.5, 0, briefing.venue.entrancePosition[2] - 2],
      rotation: Math.PI / 2,
      wing: "North",
    });

    // 3. Live Dosa counters (duplicated per user instruction: 1x, 2x, 3x, 4x, etc.)
    const numDosa = Math.max(1, briefing.counterCounts.dosa);
    for (let i = 0; i < numDosa; i++) {
      const isNorth = i % 2 === 0;
      const xPos = isNorth ? -w / 2 + 3.5 : w / 2 - 3.5;
      const zOffset = -l / 4 + Math.floor(i / 2) * 5.5;
      newStalls.push({
        ...STALL_CATALOG.dosa,
        id: `dosa-${i + 1}`,
        name:
          numDosa > 1
            ? `Live Dosa Station #${i + 1} (${isNorth ? "North Wing" : "South Wing"})`
            : "Live Dosa Station",
        position: [xPos, 0, zOffset],
        rotation: isNorth ? Math.PI / 2 : -Math.PI / 2,
        wing: isNorth ? "North" : "South",
      });
    }

    // 4. Idli & Vada stations
    const numIdli = Math.max(1, briefing.counterCounts.idli);
    for (let i = 0; i < numIdli; i++) {
      const isNorth = i % 2 !== 0;
      const xPos = isNorth ? -w / 2 + 3.5 : w / 2 - 3.5;
      const zOffset = l / 6 + Math.floor(i / 2) * 4.5;
      newStalls.push({
        ...STALL_CATALOG.idli_steamer,
        id: `idli-${i + 1}`,
        name: numIdli > 1 ? `Steaming Idli Station #${i + 1}` : "Steaming Idli Station",
        position: [xPos, 0, zOffset],
        rotation: isNorth ? Math.PI / 2 : -Math.PI / 2,
        wing: isNorth ? "North" : "South",
      });
    }

    // 5. Chaat, Continental, Dessert
    if (briefing.counterCounts.chaat > 0) {
      newStalls.push({
        ...STALL_CATALOG.chaat,
        id: "chaat-1",
        position: [-w / 2 + 3.5, 0, 0],
        rotation: Math.PI / 2,
        wing: "North",
      });
    }
    if (briefing.counterCounts.continental > 0) {
      newStalls.push({
        ...STALL_CATALOG.continental,
        id: "continental-1",
        position: [w / 2 - 3.5, 0, 0],
        rotation: -Math.PI / 2,
        wing: "South",
      });
    }
    newStalls.push({
      ...STALL_CATALOG.sweet_halwa,
      id: "dessert-1",
      position: [w / 2 - 3.5, 0, l / 4],
      rotation: -Math.PI / 2,
      wing: "South",
    });

    // 6. Central Dining Rows
    const diningRows = Math.min(8, Math.max(3, Math.round(briefing.headCount / 400)));
    for (let r = 0; r < diningRows; r++) {
      const z = -l / 3.5 + r * 4.8;
      newStalls.push({
        ...STALL_CATALOG.dining_table,
        id: `dining-${r + 1}`,
        name: `Royal Dining Row #${r + 1}`,
        position: [r % 2 === 0 ? -2.2 : 2.2, 0, z],
        rotation: 0,
        wing: r % 2 === 0 ? "North" : "South",
      });
      // Add adjacent eco pedal dustbin
      if (briefing.showEcoDustbins) {
        newStalls.push({
          ...STALL_CATALOG.dustbin,
          id: `dustbin-${r + 1}`,
          position: [r % 2 === 0 ? -4.5 : 4.5, 0, z],
          rotation: 0,
          wing: r % 2 === 0 ? "North" : "South",
        });
      }
    }

    // 7. BKR Royal Curved LED Media Wall
    if (briefing.showVideoWall) {
      newStalls.push({
        ...STALL_CATALOG.bkr_video_wall,
        id: "video-wall-1",
        position: [0, 0, briefing.venue.stagePosition[2] + 4.5],
        rotation: Math.PI,
        wing: "North",
      });
    }

    // 8. Exit Tamboolam
    newStalls.push({
      ...STALL_CATALOG.tamboolam_counter,
      id: "tamboolam-1",
      position: [w / 2 - 4, 0, briefing.venue.entrancePosition[2] - 4],
      rotation: 0,
      wing: "South",
    });

    setStalls(newStalls);
    setSelectedStallId(null);
  };

  // Apply recommended optimal layout
  const handleApplyOptimalLayout = () => {
    const freshStalls = getRecommendedStalls(headCount, "classic", selectedVenue);
    setStalls(freshStalls);
    setSelectedStallId(null);
    toast.success("Optimal 3D Layout Balanced", {
      description: `Configured ${freshStalls.length} counters balanced for ${headCount.toLocaleString("en-IN")} guests.`,
    });
  };

  // Add stall from catalog
  const handleAddStall = (type: StallType) => {
    const catalogItem = STALL_CATALOG[type];
    const newId = `${type}-${Date.now().toString().slice(-4)}`;
    const offset = (stalls.length % 5) * 2 - 4;
    const newStall: StallItem = {
      ...catalogItem,
      id: newId,
      position: [offset, 0, offset > 0 ? 4 : -4],
      rotation: 0,
      wing: offset < 0 ? "North" : "South",
    };
    setStalls((prev) => [...prev, newStall]);
    setSelectedStallId(newId);
    toast.info(`Added ${catalogItem.name}`, {
      description: "Click on floor to position or drag to relocate.",
    });
  };

  // Add custom stall generated from photo
  const handleSaveCustomStall = (newStall: StallItem) => {
    const offset = (stalls.length % 4) * 3 - 4.5;
    const placedStall: StallItem = {
      ...newStall,
      position: [offset, 0, offset > 0 ? 5 : -5],
      wing: offset < 0 ? "North" : "South",
    };
    setStalls((prev) => [...prev, placedStall]);
    setSelectedStallId(placedStall.id);
  };

  // Duplicate specific stall
  const handleDuplicateStall = (stallId: string) => {
    const target = stalls.find((s) => s.id === stallId);
    if (!target) return;
    const newId = `${target.type}-${Date.now().toString().slice(-4)}`;
    const cloned: StallItem = {
      ...target,
      id: newId,
      name: `${target.name} (Counter #${stalls.filter((s) => s.type === target.type).length + 1})`,
      position: [-target.position[0], 0, target.position[2]],
      wing: target.position[0] < 0 ? "South" : "North",
    };
    setStalls((prev) => [...prev, cloned]);
    setSelectedStallId(newId);
    toast.success(`Duplicated ${target.name}`, {
      description: `Placed on opposite wing for balanced crowd throughput.`,
    });
  };

  // Place dustbin near dining table
  const handlePlaceDustbinNearTable = (tableId: string) => {
    const table = stalls.find((s) => s.id === tableId);
    if (!table) return;
    const newId = `dustbin-${Date.now().toString().slice(-4)}`;
    const newDustbin: StallItem = {
      ...STALL_CATALOG.dustbin,
      id: newId,
      position: [table.position[0] + 1.8, 0, table.position[2]],
      rotation: 0,
      wing: table.wing,
    };
    setStalls((prev) => [...prev, newDustbin]);
    setSelectedStallId(newId);
    toast.success("Placed Eco Dustbin beside table");
  };

  // Tablecloth illusion
  const handleSetTableTexture = (tableId: string, textureUrl: string) => {
    setStalls((prev) =>
      prev.map((s) => (s.id === tableId ? { ...s, customTableTextureUrl: textureUrl } : s))
    );
    toast.success("Applied Table Linen Illusion Pattern");
  };

  // Remove stall
  const handleRemoveStall = (stallId: string) => {
    setStalls((prev) => prev.filter((s) => s.id !== stallId));
    if (selectedStallId === stallId) setSelectedStallId(null);
    toast.info("Stall removed from 3D layout");
  };

  // Move stall
  const handleMoveStall = (id: string, newPos: [number, number, number]) => {
    setStalls((prev) =>
      prev.map((s) => (s.id === id ? { ...s, position: newPos } : s))
    );
  };

  // Rotate selected stall 45 degrees
  const handleRotateSelected = () => {
    if (!selectedStallId) return;
    setStalls((prev) =>
      prev.map((s) =>
        s.id === selectedStallId
          ? { ...s, rotation: (s.rotation + Math.PI / 4) % (Math.PI * 2) }
          : s
      )
    );
  };

  // Custom blueprint projection upload
  const handleCustomBlueprintUpload = (url: string) => {
    setSelectedVenue((prev) => ({
      ...prev,
      blueprintUrl: url,
    }));
    setBlueprintOpacity(0.5);
    setIsVenueModalOpen(false);
    toast.success("Google Maps / Blueprint Projected", {
      description: "Adjust opacity slider to align counters with the architectural drawing.",
    });
  };

  // Snapshot capture
  const handleExportSnapshot = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `bkr-3d-plan-${selectedVenue.id}-${headCount}pax.png`;
      link.href = dataUrl;
      link.click();
      toast.success("High-Res 3D Plan Exported!", {
        description: "Snapshot downloaded for client catering proposal.",
      });
    } catch {
      toast.error("Could not capture snapshot. Please try again.");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#090a0d] text-[#f4efe6] font-sans flex flex-col select-none">
      {/* Precision CAD Vector Grid & Coordinate Tracking */}
      <VectorGridOverlay opacity={0.25} showCoordinates={true} />

      {/* 1. STUDIO TOP HUD HEADER */}
      <header className="relative z-30 flex items-center justify-between px-4 py-2 border-b border-white/[0.08] bg-[#111318]/90 backdrop-blur-2xl">
        
        {/* Brand & Return */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-xs font-mono text-white">
                BKR // 3D STAGE PLANNER
              </span>
              <span className="bg-[#222530] text-[#e2c99a] border border-white/10 text-[9px] font-mono font-semibold px-2 py-0.5 rounded">
                VIEWPORT ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block font-mono">
              Orthographic Mandapam &amp; Live Counter Spatial Engine
            </p>
          </div>
        </div>

        {/* Center: Studio Event Briefing Trigger (Quick Edit) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBriefingModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161822] border border-white/[0.08] hover:border-[#e2c99a]/60 transition-all text-xs group"
            title="Re-open Voice Speech & Custom Intake Console"
          >
            <div className="w-5 h-5 rounded-md bg-[#222530] text-[#e2c99a] flex items-center justify-center border border-white/10">
              <Mic className="h-3 w-3" />
            </div>
            <div className="text-left">
              <span className="font-bold text-white block flex items-center gap-1 font-mono text-xs group-hover:text-[#e2c99a] transition-colors">
                Event Intake [Briefing]
              </span>
              <span className="text-[10px] text-neutral-400 block font-mono">
                {headCount.toLocaleString("en-IN")} Pax • {stalls.filter((s) => s.type === "dosa").length}x Dosa Counters
              </span>
            </div>
          </button>

          {/* Venue Selector */}
          <button
            onClick={() => setIsVenueModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161822] border border-white/[0.08] hover:border-[#e2c99a]/50 transition-all text-xs"
          >
            <MapPin className="h-3.5 w-3.5 text-[#e2c99a]" />
            <div className="text-left">
              <span className="font-bold text-white block font-mono text-xs">{selectedVenue.name}</span>
              <span className="text-[10px] text-neutral-400 block font-mono">
                {selectedVenue.hallWidth}m × {selectedVenue.hallLength}m
              </span>
            </div>
          </button>
        </div>

        {/* Camera Views & Studio Controls */}
        <div className="flex items-center gap-2">
          {/* Camera View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#161822] border border-white/[0.08] font-mono">
            <button
              onClick={() => setViewMode("orbit")}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                viewMode === "orbit"
                  ? "bg-[#e2c99a] text-black font-bold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              3D Orbit
            </button>
            <button
              onClick={() => setViewMode("top_down")}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                viewMode === "top_down"
                  ? "bg-[#e2c99a] text-black font-bold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              2D Plan
            </button>
            <button
              onClick={() => setViewMode("walkthrough")}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                viewMode === "walkthrough"
                  ? "bg-[#e2c99a] text-black font-bold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Walkthrough
            </button>
          </div>

          {/* Blueprint Opacity Toggle */}
          <button
            onClick={() => setBlueprintOpacity((prev) => (prev > 0 ? 0 : 0.45))}
            title="Toggle Blueprint Projection Overlay"
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              blueprintOpacity > 0
                ? "bg-[#222530] border-[#e2c99a] text-[#e2c99a]"
                : "bg-[#161822] border-white/[0.08] text-neutral-400 hover:text-white"
            }`}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden md:inline font-mono text-[11px]">
              {blueprintOpacity > 0 ? `${Math.round(blueprintOpacity * 100)}%` : "Map Off"}
            </span>
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid((g) => !g)}
            title="Toggle Floor Grid"
            className={`p-2 rounded-xl border transition-all ${
              showGrid
                ? "bg-[#222530] border-[#e2c99a]/50 text-[#e2c99a]"
                : "bg-[#161822] border-white/[0.08] text-neutral-400 hover:text-white"
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>

          {/* CAD Clearance Aisles Toggle */}
          <button
            onClick={() => setShowCadAisles((prev) => !prev)}
            title="Toggle CAD Aisle Widths & Safety Clearances"
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
              showCadAisles
                ? "bg-[#c5a059]/20 border-[#c5a059] text-[#e2c99a]"
                : "bg-[#161822] border-white/[0.08] text-neutral-400 hover:text-white"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span className="hidden xl:inline text-[11px] font-semibold font-mono">CAD Aisles</span>
          </button>

          {/* Live Stall Focus Lights Toggle */}
          <button
            onClick={() => {
              setShowFocusLights((f) => !f);
              toast.info(!showFocusLights ? "Focus Spotlights Activated" : "Focus Lights Off");
            }}
            title="Toggle Focus Lights on Live Stalls"
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
              showFocusLights
                ? "bg-[#e2c99a]/20 border-[#e2c99a] text-[#e2c99a]"
                : "bg-[#161822] border-white/[0.08] text-neutral-400 hover:text-white"
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            <span className="hidden xl:inline text-[11px] font-semibold font-mono">Focus Lights</span>
          </button>

          {/* Interactive Crowd Flow Simulation Toggle */}
          <button
            onClick={() => {
              setShowCrowdSimulation((prev) => !prev);
              toast.info(
                !showCrowdSimulation ? "Simulating Peak Guest Flow" : "Crowd simulation paused"
              );
            }}
            title="Simulate Peak Muhurtham Crowd Movement"
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all font-mono ${
              showCrowdSimulation
                ? "bg-[#e2c99a] text-black font-bold shadow-md"
                : "bg-[#161822] border-white/[0.08] text-neutral-400 hover:text-white"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">{showCrowdSimulation ? "Crowd Active" : "Simulate Flow"}</span>
          </button>

          {/* Presentation Mode Toggle */}
          <Button
            size="sm"
            onClick={() => {
              const nextState = !isPitchMode;
              setIsPitchMode(nextState);
              if (nextState) {
                setIsSidebarOpen(false);
                setShowCrowdSimulation(true);
                toast.success("Studio Presentation Mode Activated");
              } else {
                setIsSidebarOpen(true);
              }
            }}
            className={`h-8 text-xs font-mono font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all ${
              isPitchMode
                ? "bg-[#e2c99a] text-black"
                : "bg-[#161822] border border-white/[0.08] text-white hover:text-[#e2c99a]"
            }`}
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isPitchMode ? "Exit Presentation" : "Present 3D"}</span>
          </Button>

          {/* Export Snapshot */}
          <Button
            size="sm"
            onClick={handleExportSnapshot}
            className="h-8 text-xs bg-[#e2c99a] hover:bg-[#c5a059] text-black font-mono font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Camera className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export PNG</span>
          </Button>

          <ThemeToggle />
        </div>
      </header>

      {/* 1.5 INSTANT 3D VENUE SYNTHESIZER & IMAGE-TO-3D PROJECTION BAR */}
      <div className="relative z-20 px-4 py-2 bg-[#141722]/95 border-b border-white/[0.08] backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2 flex-1 min-w-[320px]">
          {/* Quick Voice Mic for Venue */}
          <button
            onClick={toggleTopBarListening}
            className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
              isTopBarListening
                ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                : "bg-[#222530] text-[#e2c99a] border-white/10 hover:border-[#e2c99a]"
            }`}
            title={isTopBarListening ? "Stop Listening" : "Speak Venue Name"}
          >
            <Mic className="h-4 w-4" />
          </button>

          {/* Text Input for Venue Synthesis */}
          <div className="relative flex-1">
            <input
              type="text"
              value={venueQueryInput}
              onChange={(e) => setVenueQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSynthesizeTopBarVenue()}
              placeholder="Synthesize 3D venue: e.g. 'Codissia Hall E', 'ITC Grand Chola', '1-Acre Lawn', 'Taj Coromandel 40x25m'..."
              className="w-full px-3.5 py-1.5 rounded-xl bg-[#090b12] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#e2c99a]"
            />
          </div>

          <Button
            size="sm"
            onClick={() => handleSynthesizeTopBarVenue()}
            className="h-8 px-3 text-xs bg-[#e2c99a] text-black font-bold hover:bg-[#c5a059]"
          >
            Synthesize 3D
          </Button>

          {/* Upload Image to 3D Button */}
          <label className="cursor-pointer h-8 px-3 rounded-xl bg-[#222530] border border-white/10 hover:border-[#e2c99a]/50 text-xs text-white hover:text-[#e2c99a] flex items-center gap-1.5 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleDirectImageUpload}
              className="hidden"
            />
            <ImageIcon className="h-3.5 w-3.5 text-[#e2c99a]" />
            <span className="hidden sm:inline">Upload Image to 3D</span>
          </label>

          {/* Google Maps Search Button */}
          <button
            onClick={() => setIsGoogleMapsModalOpen(true)}
            className="h-8 px-3 rounded-xl bg-[#222530] border border-[#e2c99a]/50 hover:border-[#e2c99a] text-xs text-[#e2c99a] flex items-center gap-1.5 transition-all shadow-sm font-bold shrink-0"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Google Maps Mahal Search</span>
          </button>
        </div>

        {/* Quick Venue Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
          <span className="text-neutral-500 uppercase mr-1 hidden lg:inline">Presets:</span>
          {PRESET_VENUES.slice(0, 5).map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPresetVenue(preset)}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedVenue.id === preset.id
                  ? "bg-[#e2c99a] text-black font-bold border-[#e2c99a]"
                  : "bg-[#222530] border-white/10 text-neutral-300 hover:text-white hover:border-[#e2c99a]/40"
              }`}
            >
              {preset.name.split(" (")[0]} ({preset.hallWidth}×{preset.hallLength}m)
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN 3D WORKSPACE VIEWPORT */}
      <div className="relative flex-1 flex overflow-hidden">
        
        {/* Left Drawer: Precision CAD Inspector & Smart Counter Advisor */}
        <aside
          className={`relative z-20 transition-all duration-300 ease-in-out border-r border-white/[0.08] bg-[#111318]/95 backdrop-blur-2xl flex flex-col ${
            isSidebarOpen ? "w-80 sm:w-96" : "w-0 overflow-hidden border-none"
          }`}
        >
          {/* Tab Selector between Inspector and Advisor */}
          <div className="flex items-center justify-between p-2 border-b border-white/[0.08] bg-[#161820] font-mono text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSidebarTab("inspector")}
                className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                  sidebarTab === "inspector"
                    ? "bg-[#e2c99a] text-black shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                CAD Inspector
              </button>
              <button
                onClick={() => setSidebarTab("advisor")}
                className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                  sidebarTab === "advisor"
                    ? "bg-[#e2c99a] text-black shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Queue Advisor
              </button>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg text-sm"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sidebarTab === "inspector" ? (
              <PrecisionDimensionsInspector
                selectedStall={selectedStall}
                onUpdateStall={handleUpdateStall}
                onDeselectStall={() => setSelectedStallId(null)}
                onDuplicateStall={handleDuplicateStall}
                onDeleteStall={handleDeleteStall}
                venue={selectedVenue}
                onUpdateVenue={(v) => {
                  setSelectedVenue(v);
                  setStalls(getRecommendedStalls(headCount, "classic", v));
                }}
                headCount={headCount}
                onUpdateHeadCount={setHeadCount}
                onOpenGoogleMapsSearch={() => setIsGoogleMapsModalOpen(true)}
              />
            ) : (
              <SmartCounterAdvisor
                headCount={headCount}
                onHeadCountChange={setHeadCount}
                analysis={analysis}
                stalls={stalls}
                onAddStall={handleAddStall}
                onDuplicateStall={handleDuplicateStall}
                onRemoveStall={handleRemoveStall}
                onApplyOptimalLayout={handleApplyOptimalLayout}
                onOpenCustomStallModal={() => setIsCustomStallModalOpen(true)}
                onOpenBriefingModal={() => setIsBriefingModalOpen(true)}
              />
            )}
          </div>
        </aside>

        {/* Toggle open sidebar button when closed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-3 top-3 z-30 p-2.5 rounded-xl bg-[#161822] border border-white/[0.1] text-[#e2c99a] shadow-xl hover:scale-105 transition-transform"
            title="Open Capacity Advisor"
          >
            <CrosshairVector size={18} />
          </button>
        )}

        {/* Center: Interactive 3D Canvas */}
        <main className="relative flex-1 h-full w-full">
          <ThreeCanvas
            venue={selectedVenue}
            stalls={stalls}
            selectedStallId={selectedStallId}
            onSelectStall={handleSelectStall}
            onMoveStall={handleMoveStall}
            viewMode={viewMode}
            blueprintOpacity={blueprintOpacity}
            showGrid={showGrid}
            showCrowdSimulation={showCrowdSimulation}
            showCadAisles={showCadAisles}
            showFocusLights={showFocusLights}
            cinematicAutoRotate={isPitchMode}
            isDark={isDark}
            canvasRef={canvasRef}
          />

          {/* Floating Instructions HUD */}
          <div className="absolute top-4 right-4 pointer-events-none bg-black/60 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10 text-[11px] text-white/80 space-y-0.5 font-mono">
            <p>• Left Click + Drag to rotate 3D view</p>
            <p>• Scroll to zoom in / out</p>
            <p>• Click any stall to select, rotate or duplicate</p>
            <p>• Click floor to relocate selected stall</p>
          </div>

          {/* Selected Stall Floating Inspector Card */}
          {selectedStall && (
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 bg-[#161822]/95 border border-[#e2c99a]/40 p-4 rounded-2xl shadow-2xl backdrop-blur-2xl w-min(90vw,480px) space-y-3 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedStall.accentColor }}
                    />
                    <h4 className="font-bold text-sm text-white font-display">
                      {selectedStall.name}
                    </h4>
                  </div>
                  <p className="text-xs text-[#e2c99a] font-medium font-mono">
                    {selectedStall.name_ta}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRotateSelected}
                    className="h-8 px-2 text-xs border-white/15 text-white hover:text-[#e2c99a] hover:bg-white/10 rounded-lg flex items-center gap-1"
                    title="Rotate 45°"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    Rotate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDuplicateStall(selectedStall.id)}
                    className="h-8 px-2 text-xs border-[#e2c99a]/40 text-[#e2c99a] hover:bg-[#e2c99a]/10 rounded-lg flex items-center gap-1 font-semibold"
                    title="Duplicate to opposite wing"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Duplicate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveStall(selectedStall.id)}
                    className="h-8 px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg"
                    title="Delete Stall"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <button
                    onClick={() => setSelectedStallId(null)}
                    className="text-[#8e95a5] hover:text-white text-sm px-1.5"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Specs & Power details */}
              <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-white/[0.08] font-mono">
                <div className="flex items-center gap-1 text-[#8e95a5]">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>{selectedStall.powerRequiredKw} kW</span>
                </div>
                <div className="flex items-center gap-1 text-[#8e95a5]">
                  <Droplet className="h-3.5 w-3.5 text-sky-400" />
                  <span>{selectedStall.waterRequired ? "Water Line" : "Dry Station"}</span>
                </div>
                <div className="flex items-center gap-1 text-[#8e95a5]">
                  <Utensils className="h-3.5 w-3.5 text-[#e2c99a]" />
                  <span>{selectedStall.capacityPerHour} pax/hr</span>
                </div>
              </div>

              {/* Table Illusion & Dustbin Placement for Dining Tables */}
              {selectedStall.type === "dining_table" && (
                <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white font-display">
                      Tablecloth & 3D Illusion Linen
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handlePlaceDustbinNearTable(selectedStall.id)}
                      className="h-6 text-[10px] bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold px-2 rounded-lg flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Place Dustbin Beside Table
                    </Button>
                  </div>

                  {/* Illusion Presets */}
                  <div className="grid grid-cols-3 gap-1.5 font-mono">
                    {[
                      {
                        label: "3D Illusion",
                        url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80",
                      },
                      {
                        label: "Gold Brocade",
                        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
                      },
                      {
                        label: "Velvet Damask",
                        url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80",
                      },
                    ].map((pattern) => (
                      <button
                        key={pattern.label}
                        onClick={() => handleSetTableTexture(selectedStall.id, pattern.url)}
                        className={`p-1 text-[10px] font-medium rounded border transition-all text-center ${
                          selectedStall.customTableTextureUrl === pattern.url
                            ? "bg-[#222530] border-[#e2c99a] text-[#e2c99a] font-bold"
                            : "bg-[#0e1017] border-white/10 text-[#8e95a5] hover:text-white"
                        }`}
                      >
                        {pattern.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* BKR Video Wall & Instagram Reel Display */}
              {selectedStall.type === "bkr_video_wall" && (
                <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block font-display">
                        BKR Catering Media Wall
                      </span>
                      <span className="text-[10px] text-[#8e95a5] block">
                        Continuous 30-sec Instagram Reel stream featuring signature wedding feasts & decor
                      </span>
                    </div>
                    <a
                      href="https://www.instagram.com/bkr_events_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-[#e2c99a] text-black font-bold flex items-center gap-1 shadow-md hover:bg-[#c5a059] shrink-0 font-mono"
                    >
                      <ExternalLink className="h-3 w-3" />
                      @bkr_events_
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 3. BOTTOM FLOATING STALL CATALOG DRAWER */}
      <footer className="relative z-30 px-4 py-2 border-t border-white/[0.08] bg-[#111318]/95 backdrop-blur-2xl">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-thin pb-1">
          <Button
            size="sm"
            onClick={() => setIsCustomStallModalOpen(true)}
            className="h-8 text-xs font-mono font-semibold bg-[#222530] border border-white/10 hover:border-[#e2c99a] text-[#e2c99a] rounded-lg shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Photo-to-3D Stall</span>
          </Button>

          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 shrink-0 flex items-center gap-1.5 font-mono">
            <Plus className="h-3.5 w-3.5 text-[#e2c99a]" />
            DEPLOY COUNTER:
          </span>

          {(Object.keys(STALL_CATALOG) as StallType[]).map((type) => {
            const item = STALL_CATALOG[type];
            return (
              <button
                key={type}
                onClick={() => handleAddStall(type)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161822] border border-white/[0.08] hover:border-[#e2c99a] hover:bg-white/5 transition-all text-xs shrink-0 group font-mono"
              >
                <div
                  className="w-2 h-2 rounded-full group-hover:scale-125 transition-transform"
                  style={{ backgroundColor: item.accentColor }}
                />
                <span className="font-semibold text-white">{item.name}</span>
                <span className="text-[10px] text-neutral-400">
                  [{item.capacityPerHour}/hr]
                </span>
              </button>
            );
          })}
        </div>
      </footer>

      {/* STARTING STEP: Studio Event Briefing Modal (Voice Speech & Custom Input) */}
      <StudioEventBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        initialData={initialBriefingData}
        onRenderStage={handleRenderFromBriefing}
      />

      {/* Mandapam Venue & Custom Blueprint Modal */}
      <MandapamSelectorModal
        open={isVenueModalOpen}
        onOpenChange={setIsVenueModalOpen}
        selectedVenue={selectedVenue}
        onSelectVenue={(v) => {
          setSelectedVenue(v);
          setStalls(getRecommendedStalls(headCount, "classic", v));
          setIsVenueModalOpen(false);
          toast.success(`Loaded ${v.name}`);
        }}
        blueprintOpacity={blueprintOpacity}
        onBlueprintOpacityChange={setBlueprintOpacity}
        onCustomBlueprintUpload={handleCustomBlueprintUpload}
      />

      {/* On-The-Spot 3D Stall Generator Modal */}
      <CustomStallCreatorModal
        open={isCustomStallModalOpen}
        onOpenChange={setIsCustomStallModalOpen}
        onSaveCustomStall={handleSaveCustomStall}
      />

      {/* Google Maps Venue Search Modal */}
      <GoogleMapsVenueSearchDialog
        isOpen={isGoogleMapsModalOpen}
        onClose={() => setIsGoogleMapsModalOpen(false)}
        onSelectVenue={(v) => {
          setSelectedVenue(v);
          setStalls(getRecommendedStalls(headCount, "classic", v));
        }}
      />
    </div>
  );
};

export default Planner3DPage;
