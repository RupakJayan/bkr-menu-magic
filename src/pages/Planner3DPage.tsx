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
  Command,
  Volume2,
  VolumeX,
  Sparkles,
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
import { CommandPaletteDialog } from "@/components/planner3d/CommandPaletteDialog";
import { PhysicsCard } from "@/components/ui/PhysicsCard";
import {
  playTactileClick,
  playMagneticSnap,
  playChimeSuccess,
  toggleAudioMute,
  isMuted,
} from "@/utils/soundFeedback";
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

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showMagneticGuides, setShowMagneticGuides] = useState(true);
  const [isAudioMutedState, setIsAudioMutedState] = useState(() => isMuted());

  // Aggregate modal open flag to cleanly suppress 3D overlays and bottom inspectors when any dialog is active
  const isAnyModalOpen =
    isBriefingModalOpen ||
    isGoogleMapsModalOpen ||
    isVenueModalOpen ||
    isCustomStallModalOpen ||
    isCommandPaletteOpen;

  // Global Keyboard Shortcuts (Ctrl+K, Cmd+K, 2D/3D toggles, etc.)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        playTactileClick(600);
      } else if (!isInput && e.key === "2") {
        e.preventDefault();
        setViewMode("top_down");
        playChimeSuccess();
        toast.info("Switched to 2D CAD Blueprint Mode");
      } else if (!isInput && e.key === "3") {
        e.preventDefault();
        setViewMode("orbit");
        playChimeSuccess();
        toast.info("Switched to 3D Cinematic Reality Mode");
      } else if (!isInput && (e.key === "m" || e.key === "M")) {
        e.preventDefault();
        setIsGoogleMapsModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAddStallFromCommand = (type: StallType) => {
    const catalogItem = STALL_CATALOG[type] || STALL_CATALOG.dosa;
    const newStall: StallItem = {
      id: `stall_${Date.now()}`,
      type,
      name: catalogItem.name,
      name_ta: catalogItem.name_ta,
      category: catalogItem.category,
      position: [0, 0, Math.round((Math.random() - 0.5) * (selectedVenue.hallLength * 0.4))],
      rotation: 0,
      width: catalogItem.width,
      depth: catalogItem.depth,
      height: catalogItem.height,
      color: catalogItem.color,
      accentColor: catalogItem.accentColor,
      capacityPerHour: catalogItem.capacityPerHour,
      unitCost: catalogItem.unitCost,
      powerRequiredKw: catalogItem.powerRequiredKw,
      waterRequired: catalogItem.waterRequired,
      dishes: catalogItem.dishes,
      dishes_ta: catalogItem.dishes_ta,
      tag: catalogItem.tag,
    };
    setStalls((prev) => [...prev, newStall]);
    setSelectedStallId(newStall.id);
    playTactileClick(700);
    toast.success(`Added ${newStall.name} to 3D stage layout`);
  };

  const handleToggleTimeOfDay = (time: "morning" | "afternoon" | "sunset" | "night") => {
    setSelectedVenue((prev) => ({ ...prev, timeOfDay: time }));
    playChimeSuccess();
    toast.info(`Atmosphere switched to ${time.toUpperCase()}`);
  };

  const handleResetLayout = () => {
    setStalls(getRecommendedStalls(headCount, "classic", selectedVenue));
    setSelectedStallId(null);
    playTactileClick(400);
    toast.info("Venue layout reset to recommended arrangement");
  };

  const toggleSound = () => {
    const muted = toggleAudioMute();
    setIsAudioMutedState(muted);
    toast.info(muted ? "Sound Muted" : "Tactile Audio Feedback Enabled");
  };

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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isDeployMenuOpen, setIsDeployMenuOpen] = useState<boolean>(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState<boolean>(false);
  const [deployCategory, setDeployCategory] = useState<"cooking" | "dining" | "utilities" | "media">("cooking");

  const getFilteredStallsByCategory = (cat: "cooking" | "dining" | "utilities" | "media"): StallType[] => {
    switch (cat) {
      case "cooking":
        return (["dosa", "idli", "sweet_halwa", "continental_pasta", "chaat", "dessert_icecream"] as StallType[]).filter(
          (t) => STALL_CATALOG[t]
        );
      case "dining":
        return (["dining_table", "buffet_spread"] as StallType[]).filter((t) => STALL_CATALOG[t]);
      case "utilities":
        return (["handwash_station", "dustbin", "beverage_bar"] as StallType[]).filter((t) => STALL_CATALOG[t]);
      case "media":
        return (["bkr_video_wall", "tamboolam_beeda"] as StallType[]).filter((t) => STALL_CATALOG[t]);
      default:
        return Object.keys(STALL_CATALOG) as StallType[];
    }
  };

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
    <div
      className={`relative w-screen h-screen overflow-hidden font-sans flex flex-col select-none transition-colors duration-200 ${
        isDark ? "bg-[#090a0f] text-[#f1f4f9]" : "bg-[#f8fafc] text-[#0f172a]"
      }`}
    >
      {/* Precision CAD Vector Grid & Coordinate Tracking */}
      <VectorGridOverlay opacity={0.25} showCoordinates={true} />

      {/* 1. SINGLE STUDIO TOP NAV BAR (GOOGLE STUDIO EXECUTIVE GRADE - NO CONGESTION) */}
      <header className={`relative z-30 flex items-center justify-between px-4 py-2 border-b backdrop-blur-2xl transition-colors ${
        isDark
          ? "border-white/[0.08] bg-[#11131a]/95 text-white"
          : "border-slate-200 bg-white/95 text-slate-900 shadow-sm"
      }`}>
        
        {/* Left: Brand + Active Venue Pill */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark
                ? "bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10"
                : "bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
            }`}
            title="Back to Home"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-xs font-mono">
                BKR // 3D STAGE PLANNER
              </span>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                isDark
                  ? "bg-[#1f2433] text-[#f0c889] border-white/10"
                  : "bg-slate-100 text-[#b38238] border-slate-300"
              }`}>
                Studio CAD
              </span>
            </div>
            <button
              onClick={() => setIsVenueModalOpen(true)}
              className={`text-[10px] text-left hidden sm:flex items-center gap-1 font-mono transition-colors ${
                isDark ? "text-neutral-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>{selectedVenue.name}</span>
              <span className="text-neutral-500">•</span>
              <span>{selectedVenue.hallWidth}m × {selectedVenue.hallLength}m</span>
            </button>
          </div>
        </div>

        {/* Center: Unified Master View Switcher [ 📐 2D CAD Blueprint | 🌐 3D Reality | 👁️ Walkthrough ] */}
        <div className={`flex items-center p-0.5 rounded-xl border font-mono text-xs shadow-inner ${
          isDark
            ? "bg-[#090b10] border-white/10"
            : "bg-slate-100 border-slate-300"
        }`}>
          <button
            onClick={() => {
              setViewMode("top_down");
              playChimeSuccess();
              toast.info("2D Architectural CAD Blueprint Mode");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold ${
              viewMode === "top_down"
                ? isDark
                  ? "bg-[#f0c889] text-black font-bold shadow-sm"
                  : "bg-[#b38238] text-white font-bold shadow-sm"
                : isDark
                ? "text-neutral-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>2D CAD Blueprint</span>
          </button>

          <button
            onClick={() => {
              setViewMode("orbit");
              playChimeSuccess();
              toast.info("3D Reality Viewport Mode");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold ${
              viewMode === "orbit"
                ? isDark
                  ? "bg-[#f0c889] text-black font-bold shadow-sm"
                  : "bg-[#b38238] text-white font-bold shadow-sm"
                : isDark
                ? "text-neutral-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>3D Reality</span>
          </button>

          <button
            onClick={() => {
              setViewMode("walkthrough");
              playChimeSuccess();
              toast.info("First-Person Eye-Level Walkthrough Mode");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold ${
              viewMode === "walkthrough"
                ? isDark
                  ? "bg-[#f0c889] text-black font-bold shadow-sm"
                  : "bg-[#b38238] text-white font-bold shadow-sm"
                : isDark
                ? "text-neutral-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Walkthrough</span>
          </button>
        </div>

        {/* Right: Actions, Modals, Tools */}
        <div className="flex items-center gap-2 font-mono">
          {/* Voice & Text Venue Synthesizer (Compact Google search input) */}
          <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
            isDark
              ? "bg-[#161924] border-white/10"
              : "bg-slate-100 border-slate-300"
          }`}>
            <button
              onClick={toggleTopBarListening}
              className={`p-1 rounded-md transition-all ${
                isTopBarListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : isDark
                  ? "text-[#f0c889] hover:text-white"
                  : "text-[#b38238] hover:text-slate-900"
              }`}
              title="Voice Synthesize Venue"
            >
              <Mic className="h-3 w-3" />
            </button>
            <input
              type="text"
              value={venueQueryInput}
              onChange={(e) => setVenueQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSynthesizeTopBarVenue()}
              placeholder="Search or synthesize venue..."
              className={`w-44 bg-transparent text-xs placeholder-neutral-500 focus:outline-none ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            />
          </div>

          {/* Event Briefing Modal Trigger */}
          <button
            onClick={() => setIsBriefingModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isDark
                ? "bg-[#161924] border-white/10 text-white hover:border-[#f0c889]/60"
                : "bg-slate-100 border-slate-300 text-slate-900 hover:border-[#b38238]"
            }`}
            title="Open Event Briefing Intake Console"
          >
            <Mic className={`h-3.5 w-3.5 ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`} />
            <span className="hidden md:inline font-bold">Briefing [{headCount.toLocaleString("en-IN")}]</span>
          </button>

          {/* Google Maps Venue Search */}
          <button
            onClick={() => setIsGoogleMapsModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isDark
                ? "bg-[#161924] border-white/10 text-[#f0c889] hover:border-[#f0c889]"
                : "bg-slate-100 border-slate-300 text-[#b38238] hover:border-[#b38238]"
            }`}
            title="Search Google Maps Mahal Photos"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Maps</span>
          </button>

          {/* Command Palette */}
          <button
            onClick={() => {
              setIsCommandPaletteOpen(true);
              playTactileClick(600);
            }}
            className={`h-8 px-2 rounded-xl border text-xs flex items-center gap-1 transition-all ${
              isDark
                ? "bg-[#161924] border-white/10 text-neutral-300 hover:text-white"
                : "bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900"
            }`}
            title="Command Palette (Ctrl+K)"
          >
            <Command className={`h-3.5 w-3.5 ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`} />
            <kbd className="text-[9px] px-1 py-0.5 rounded bg-black/40 border border-white/10 text-neutral-400">⌘K</kbd>
          </button>

          {/* Export PNG */}
          <Button
            size="sm"
            onClick={handleExportSnapshot}
            className={`h-8 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 ${
              isDark
                ? "bg-[#f0c889] hover:bg-[#d4a359] text-black"
                : "bg-[#b38238] hover:bg-[#946824] text-white"
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          <ThemeToggle />
        </div>
      </header>

      {/* 2. MAIN 3D WORKSPACE VIEWPORT */}
      <div className="relative flex-1 flex overflow-hidden">
        
        {/* Left Drawer: Precision CAD Inspector & Smart Counter Advisor (Slide-over overlay drawer) */}
        <aside
          className={`absolute left-0 top-0 bottom-0 z-30 transition-all duration-300 ease-in-out border-r flex flex-col shadow-2xl backdrop-blur-2xl ${
            isDark
              ? "border-white/[0.08] bg-[#11131a]/95 text-white"
              : "border-slate-200 bg-white/95 text-slate-900 shadow-xl"
          } ${
            isSidebarOpen ? "w-80 sm:w-96 translate-x-0" : "-translate-x-full pointer-events-none"
          }`}
        >
          {/* Tab Selector between Inspector and Advisor */}
          <div
            className={`flex items-center justify-between p-2 border-b font-mono text-xs ${
              isDark ? "border-white/[0.08] bg-[#161922]" : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSidebarTab("inspector")}
                className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                  sidebarTab === "inspector"
                    ? isDark
                      ? "bg-[#f0c889] text-black shadow-sm"
                      : "bg-[#b38238] text-white shadow-sm"
                    : isDark
                    ? "text-neutral-400 hover:text-white"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                CAD Inspector
              </button>
              <button
                onClick={() => setSidebarTab("advisor")}
                className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                  sidebarTab === "advisor"
                    ? isDark
                      ? "bg-[#f0c889] text-black shadow-sm"
                      : "bg-[#b38238] text-white shadow-sm"
                    : isDark
                    ? "text-neutral-400 hover:text-white"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Queue Advisor
              </button>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={`p-1 rounded-lg text-sm transition-colors ${
                isDark ? "text-neutral-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
              }`}
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
                }}
                headCount={headCount}
                onUpdateHeadCount={setHeadCount}
                onOpenGoogleMapsSearch={() => setIsGoogleMapsModalOpen(true)}
                stalls={stalls}
                onSelectStall={(id) => setSelectedStallId(id)}
                onAddStall={handleAddStall}
                isDark={isDark}
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
                isDark={isDark}
              />
            )}
          </div>
        </aside>

        {/* Toggle open sidebar button when closed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`absolute left-4 top-4 z-20 px-3 py-1.5 rounded-xl border shadow-xl hover:scale-105 transition-all flex items-center gap-2 font-mono text-xs ${
              isDark
                ? "bg-[#11131a]/90 border-white/10 text-white hover:border-[#f0c889]"
                : "bg-white/95 border-slate-300 text-slate-900 hover:border-[#b38238]"
            }`}
            title="Open Studio CAD Inspector & Venue Specs"
          >
            <Sliders className={`h-3.5 w-3.5 ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`} />
            <span className="font-bold">CAD Inspector</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                isDark
                  ? "bg-[#222736] text-[#f0c889] border border-white/10"
                  : "bg-slate-100 text-[#b38238] border border-slate-200"
              }`}
            >
              {stalls.length}
            </span>
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
            showMagneticGuides={showMagneticGuides}
            cinematicAutoRotate={isPitchMode}
            isDark={isDark}
            isModalOpen={isAnyModalOpen}
            canvasRef={canvasRef}
          />

          {/* Non-Occluding Active Stall Telemetry HUD (Pinned at top, completely clear of 3D objects) */}
          {selectedStall && !isAnyModalOpen && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-20 flex items-center gap-2 font-mono text-[11px] animate-fadeIn">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#090b12]/90 border border-[#e2c99a]/50 text-white shadow-2xl backdrop-blur-xl flex items-center gap-2.5">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: selectedStall.accentColor }}
                />
                <span className="font-bold text-[#e2c99a] uppercase">
                  {selectedStall.name}
                </span>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-300">
                  {selectedStall.width}m × {selectedStall.depth}m × {selectedStall.height}m
                </span>
                <span className="text-neutral-500">|</span>
                <span className="text-sky-300 font-semibold">
                  POS: [{selectedStall.position[0].toFixed(1)}, {selectedStall.position[2].toFixed(1)}]m
                </span>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-400">
                  {selectedStall.capacityPerHour} Pax/Hr
                </span>
                <span className="text-neutral-500">|</span>
                <span className="text-amber-300/80 text-[10px]">
                  Drag stall or click floor to relocate
                </span>
              </div>
            </div>
          )}

          {/* Floating Contextual Viewport HUD */}
          <div className="absolute top-4 right-4 pointer-events-none flex items-center gap-2 font-mono text-[10px]">
            <div className="bg-black/75 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 text-white/90 shadow-xl flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${viewMode === "top_down" ? "bg-sky-400" : "bg-[#e2c99a] animate-pulse"}`} />
              <span className="font-bold tracking-wider uppercase">
                {viewMode === "top_down" ? "2D CAD BLUEPRINT SCHEMATIC" : "3D CINEMATIC REALITY VIEWPORT"}
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400">
                {showMagneticGuides ? "MAGNETIC SNAP: ON" : "SNAP: OFF"}
              </span>
            </div>
          </div>

          {/* Selected Stall Floating Inspector Card with 3D Gyro Physics Tilt */}
          {selectedStall && !isAnyModalOpen && (
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 w-min(92vw,480px)">
              <PhysicsCard maxTilt={7} specular={true}>
                <div className={`p-4 rounded-2xl shadow-2xl backdrop-blur-2xl space-y-3 font-mono border ${
                  isDark
                    ? "bg-[#12141c]/95 border-[#e2c99a]/50 text-white"
                    : "bg-white/95 border-slate-300 text-slate-900 shadow-2xl"
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: selectedStall.accentColor }}
                        />
                        <h4 className={`font-bold text-sm font-display ${isDark ? "text-white" : "text-slate-900"}`}>
                          {selectedStall.name}
                        </h4>
                      </div>
                      <p className={`text-xs font-medium font-mono ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`}>
                        {selectedStall.name_ta}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRotateSelected}
                        className={`h-8 px-2 text-xs rounded-lg flex items-center gap-1 ${
                          isDark
                            ? "border-white/15 bg-white/5 text-white hover:text-[#f0c889] hover:bg-white/10"
                            : "border-slate-300 bg-slate-100 text-slate-800 hover:text-[#b38238] hover:bg-slate-200"
                        }`}
                        title="Rotate 45°"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                        Rotate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicateStall(selectedStall.id)}
                        className={`h-8 px-2 text-xs rounded-lg flex items-center gap-1 font-semibold ${
                          isDark
                            ? "border-[#f0c889]/40 bg-[#f0c889]/10 text-[#f0c889] hover:bg-[#f0c889]/20"
                            : "border-[#b38238]/40 bg-[#b38238]/10 text-[#b38238] hover:bg-[#b38238]/20"
                        }`}
                        title="Duplicate to opposite wing"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Duplicate
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveStall(selectedStall.id)}
                        className={`h-8 px-2 text-xs rounded-lg ${
                          isDark
                            ? "text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
                            : "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        }`}
                        title="Delete Stall"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <button
                        onClick={() => setSelectedStallId(null)}
                        className={`text-sm px-1.5 ${isDark ? "text-neutral-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Specs & Power details */}
                  <div className={`grid grid-cols-3 gap-2 text-[11px] pt-1 border-t font-mono ${
                    isDark ? "border-white/[0.08] text-neutral-300" : "border-slate-200 text-slate-700"
                  }`}>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span>{selectedStall.powerRequiredKw} kW</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplet className="h-3.5 w-3.5 text-sky-500" />
                      <span>{selectedStall.waterRequired ? "Water Line" : "Dry Station"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Utensils className={`h-3.5 w-3.5 ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`} />
                      <span>{selectedStall.capacityPerHour} pax/hr</span>
                    </div>
                  </div>

              {/* Table Illusion & Dustbin Placement for Dining Tables */}
              {selectedStall.type === "dining_table" && (
                <div className={`space-y-2 pt-2 border-t ${isDark ? "border-white/[0.08]" : "border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold font-display ${isDark ? "text-white" : "text-slate-900"}`}>
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
                            ? isDark
                              ? "bg-[#222530] border-[#f0c889] text-[#f0c889] font-bold"
                              : "bg-amber-100 border-[#b38238] text-[#b38238] font-bold"
                            : isDark
                            ? "bg-[#0e1017] border-white/10 text-[#8e95a5] hover:text-white"
                            : "bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
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
                <div className={`space-y-2 pt-2 border-t ${isDark ? "border-white/[0.08]" : "border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-bold block font-display ${isDark ? "text-white" : "text-slate-900"}`}>
                        BKR Catering Media Wall
                      </span>
                      <span className={`text-[10px] block ${isDark ? "text-[#8e95a5]" : "text-slate-500"}`}>
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
              </PhysicsCard>
            </div>
          )}
          {/* 3. UNIFIED DYNAMIC EXPANDING STUDIO BAR (BOTTOM CENTER - ZERO CLUTTER) */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center select-none font-mono">
            {/* A. EXPANDING DEPLOY COUNTER TRAY */}
            {isDeployMenuOpen && (
              <div
                className={`mb-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl w-[92vw] max-w-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                  isDark
                    ? "bg-[#11131a]/95 border-white/10 text-white"
                    : "bg-white/98 border-slate-300 text-slate-900"
                }`}
              >
                {/* Header & Tabs */}
                <div className="flex items-center justify-between border-b pb-2.5">
                  <div className="flex items-center gap-2">
                    <Plus className={`h-4 w-4 ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`} />
                    <span className="font-bold text-xs uppercase tracking-wider">DEPLOY CATERING COUNTER</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsDeployMenuOpen(false);
                        setIsCustomStallModalOpen(true);
                      }}
                      className={`h-7 px-2.5 text-[11px] rounded-lg border font-mono font-semibold flex items-center gap-1 ${
                        isDark
                          ? "bg-[#1f2433] border-white/10 text-[#f0c889] hover:bg-white/10"
                          : "bg-slate-100 border-slate-300 text-[#b38238] hover:bg-slate-200"
                      }`}
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      <span>Photo-to-3D</span>
                    </Button>
                    <button
                      onClick={() => setIsDeployMenuOpen(false)}
                      className={`p-1 rounded-lg text-sm ${isDark ? "text-neutral-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Category Tabs */}
                <div
                  className={`flex items-center gap-1 p-1 rounded-xl border text-[11px] ${
                    isDark ? "bg-[#090b10] border-white/10" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  {[
                    { id: "cooking", label: "🍳 Live Cooking" },
                    { id: "dining", label: "🪑 Dining Tables" },
                    { id: "utilities", label: "🚰 Utilities" },
                    { id: "media", label: "📺 Media & Decor" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setDeployCategory(cat.id as any)}
                      className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center ${
                        deployCategory === cat.id
                          ? isDark
                            ? "bg-[#f0c889] text-black shadow-sm"
                            : "bg-[#b38238] text-white shadow-sm"
                          : isDark
                          ? "text-neutral-400 hover:text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Counter Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                  {getFilteredStallsByCategory(deployCategory).map((type) => {
                    const item = STALL_CATALOG[type];
                    if (!item) return null;
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          handleAddStall(type);
                          setIsDeployMenuOpen(false);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left group ${
                          isDark
                            ? "bg-[#161924] border-white/[0.08] hover:border-[#f0c889] hover:bg-white/5"
                            : "bg-slate-50 border-slate-200 hover:border-[#b38238] hover:bg-white shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-3 h-3 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                            style={{ backgroundColor: item.accentColor }}
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-xs truncate">{item.name}</div>
                            <div className={`text-[10px] truncate ${isDark ? "text-neutral-400" : "text-slate-500"}`}>
                              {item.name_ta} • {item.width}m × {item.depth}m
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 pl-2">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                              isDark
                                ? "bg-[#222736] text-[#f0c889] border-white/10"
                                : "bg-amber-50 text-[#b38238] border-amber-200"
                            }`}
                          >
                            +{item.capacityPerHour}/hr
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* B. EXPANDING STUDIO TOOLS PALETTE */}
            {isToolsMenuOpen && (
              <div
                className={`mb-3 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-2xl w-[92vw] max-w-lg space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                  isDark
                    ? "bg-[#11131a]/95 border-white/10 text-white"
                    : "bg-white/98 border-slate-300 text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className={`h-3.5 w-3.5 ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`} />
                    STUDIO CAD &amp; VIEWPORT TOOLS
                  </span>
                  <button
                    onClick={() => setIsToolsMenuOpen(false)}
                    className={`p-1 rounded-lg text-sm ${isDark ? "text-neutral-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  {/* Snap */}
                  <button
                    onClick={() => {
                      setShowMagneticGuides((prev) => !prev);
                      playTactileClick(540);
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      showMagneticGuides
                        ? isDark
                          ? "bg-[#222736] border-[#f0c889] text-[#f0c889] font-bold"
                          : "bg-amber-50 border-[#b38238] text-[#b38238] font-bold"
                        : isDark
                        ? "bg-[#161924] border-white/10 text-neutral-400 hover:text-white"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <CrosshairVector size={16} />
                    <span className="text-[11px]">Magnetic Snap</span>
                    <span className="text-[9px] opacity-75">{showMagneticGuides ? "ON" : "OFF"}</span>
                  </button>

                  {/* Aisles */}
                  <button
                    onClick={() => setShowCadAisles((prev) => !prev)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      showCadAisles
                        ? isDark
                          ? "bg-[#222736] border-[#f0c889] text-[#f0c889] font-bold"
                          : "bg-amber-50 border-[#b38238] text-[#b38238] font-bold"
                        : isDark
                        ? "bg-[#161924] border-white/10 text-neutral-400 hover:text-white"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Compass className="h-4 w-4" />
                    <span className="text-[11px]">CAD Aisles</span>
                    <span className="text-[9px] opacity-75">{showCadAisles ? "VISIBLE" : "HIDDEN"}</span>
                  </button>

                  {/* Crowd Flow */}
                  <button
                    onClick={() => setShowCrowdSimulation((prev) => !prev)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      showCrowdSimulation
                        ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-500 font-bold"
                        : isDark
                        ? "bg-[#161924] border-white/10 text-neutral-400 hover:text-white"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-[11px]">Crowd Flow</span>
                    <span className="text-[9px] opacity-75">{showCrowdSimulation ? "SIMULATING" : "PAUSED"}</span>
                  </button>

                  {/* Focus Lights */}
                  <button
                    onClick={() => setShowFocusLights((prev) => !prev)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      showFocusLights
                        ? isDark
                          ? "bg-[#222736] border-[#f0c889] text-[#f0c889] font-bold"
                          : "bg-amber-50 border-[#b38238] text-[#b38238] font-bold"
                        : isDark
                        ? "bg-[#161924] border-white/10 text-neutral-400 hover:text-white"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[11px]">Focus Lights</span>
                    <span className="text-[9px] opacity-75">{showFocusLights ? "ON" : "OFF"}</span>
                  </button>

                  {/* Floor Grid */}
                  <button
                    onClick={() => setShowGrid((g) => !g)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      showGrid
                        ? isDark
                          ? "bg-[#222736] border-[#f0c889] text-[#f0c889] font-bold"
                          : "bg-amber-50 border-[#b38238] text-[#b38238] font-bold"
                        : isDark
                        ? "bg-[#161924] border-white/10 text-neutral-400 hover:text-white"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                    <span className="text-[11px]">Floor Grid</span>
                    <span className="text-[9px] opacity-75">{showGrid ? "ON" : "OFF"}</span>
                  </button>

                  {/* Blueprint Opacity */}
                  <button
                    onClick={() => setBlueprintOpacity((prev) => (prev > 0 ? 0 : 0.45))}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      blueprintOpacity > 0
                        ? isDark
                          ? "bg-[#222736] border-[#f0c889] text-[#f0c889] font-bold"
                          : "bg-amber-50 border-[#b38238] text-[#b38238] font-bold"
                        : isDark
                        ? "bg-[#161924] border-white/10 text-neutral-400 hover:text-white"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-[11px]">Map Overlay</span>
                    <span className="text-[9px] opacity-75">
                      {blueprintOpacity > 0 ? `${Math.round(blueprintOpacity * 100)}%` : "OFF"}
                    </span>
                  </button>

                  {/* Audio Toggle */}
                  <button
                    onClick={toggleSound}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      !isAudioMutedState
                        ? isDark
                          ? "bg-[#222736] border-[#f0c889] text-[#f0c889] font-bold"
                          : "bg-amber-50 border-[#b38238] text-[#b38238] font-bold"
                        : isDark
                        ? "bg-[#161924] border-white/10 text-neutral-400 hover:text-white"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {isAudioMutedState ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    <span className="text-[11px]">Audio Cues</span>
                    <span className="text-[9px] opacity-75">{isAudioMutedState ? "MUTED" : "ACTIVE"}</span>
                  </button>

                  {/* Presentation Mode */}
                  <button
                    onClick={() => {
                      const nextState = !isPitchMode;
                      setIsPitchMode(nextState);
                      setIsToolsMenuOpen(false);
                      if (nextState) {
                        setIsSidebarOpen(false);
                        setShowCrowdSimulation(true);
                        toast.success("Studio Presentation Mode Activated");
                      }
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      isPitchMode
                        ? isDark
                          ? "bg-[#f0c889] text-black font-bold"
                          : "bg-[#b38238] text-white font-bold"
                        : isDark
                        ? "bg-[#161924] border-white/10 text-neutral-400 hover:text-white"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Maximize2 className="h-4 w-4" />
                    <span className="text-[11px]">Present</span>
                    <span className="text-[9px] opacity-75">{isPitchMode ? "EXIT" : "FULL"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* C. COMPACT FLOATING DYNAMIC ISLAND PILL */}
            <div
              className={`flex items-center gap-1.5 p-1.5 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-colors ${
                isDark
                  ? "bg-[#11131a]/95 border-white/10 text-white"
                  : "bg-white/95 border-slate-300 text-slate-900 shadow-xl"
              }`}
            >
              {/* Deploy Counter Pill Button */}
              <button
                onClick={() => {
                  setIsDeployMenuOpen((prev) => !prev);
                  setIsToolsMenuOpen(false);
                  playTactileClick(620);
                }}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
                  isDeployMenuOpen
                    ? isDark
                      ? "bg-[#f0c889] text-black border-[#f0c889]"
                      : "bg-[#b38238] text-white border-[#b38238]"
                    : isDark
                    ? "bg-[#161924] border-white/10 text-[#f0c889] hover:bg-white/5"
                    : "bg-amber-50/80 border-amber-200 text-[#b38238] hover:bg-amber-100/60"
                }`}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Deploy Counter</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isDeployMenuOpen
                      ? isDark
                        ? "bg-black/20 text-black"
                        : "bg-white/20 text-white"
                      : isDark
                      ? "bg-[#222736] text-[#f0c889]"
                      : "bg-white text-[#b38238] border border-amber-200"
                  }`}
                >
                  {stalls.length}
                </span>
              </button>

              {/* Photo-to-3D Stall */}
              <button
                onClick={() => setIsCustomStallModalOpen(true)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isDark
                    ? "bg-[#161924] border-white/10 text-neutral-300 hover:text-white hover:bg-white/5"
                    : "bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                }`}
                title="Upload photo to construct 3D counter"
              >
                <ImageIcon className={`h-3.5 w-3.5 ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`} />
                <span className="hidden sm:inline">Photo-to-3D</span>
              </button>

              {/* Google Maps Search */}
              <button
                onClick={() => setIsGoogleMapsModalOpen(true)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isDark
                    ? "bg-[#161924] border-white/10 text-[#f0c889] hover:bg-white/5"
                    : "bg-slate-100 border-slate-300 text-[#b38238] hover:bg-slate-200"
                }`}
                title="Search Google Maps Venues & Photos"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Google Maps</span>
              </button>

              {/* Studio Tools Toggle */}
              <button
                onClick={() => {
                  setIsToolsMenuOpen((prev) => !prev);
                  setIsDeployMenuOpen(false);
                  playTactileClick(560);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isToolsMenuOpen
                    ? isDark
                      ? "bg-[#f0c889] text-black border-[#f0c889] font-bold"
                      : "bg-[#b38238] text-white border-[#b38238] font-bold"
                    : isDark
                    ? "bg-[#161924] border-white/10 text-neutral-300 hover:text-white hover:bg-white/5"
                    : "bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                }`}
                title="Toggle Studio Viewport Tools"
              >
                <Compass className={`h-3.5 w-3.5 ${isToolsMenuOpen ? "" : isDark ? "text-[#f0c889]" : "text-[#b38238]"}`} />
                <span>Tools</span>
              </button>
            </div>
          </div>
        </main>
      </div>
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
        initialQuery={venueQueryInput}
        onSelectVenue={(v) => {
          setSelectedVenue(v);
          setStalls(getRecommendedStalls(headCount, "classic", v));
        }}
      />

      {/* Linear-Style Command Palette Spotlight Modal (Ctrl+K / Cmd+K) */}
      <CommandPaletteDialog
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onAddStall={handleAddStallFromCommand}
        onSetViewMode={(m) => {
          setViewMode(m);
          playChimeSuccess();
        }}
        onToggleTimeOfDay={handleToggleTimeOfDay}
        onOpenGoogleMaps={() => setIsGoogleMapsModalOpen(true)}
        onOpenInspector={() => {
          setIsSidebarOpen(true);
          setSidebarTab("inspector");
        }}
        onToggleCrowdSimulation={() => setShowCrowdSimulation((p) => !p)}
        onToggleCadAisles={() => setShowCadAisles((p) => !p)}
        onExportSnapshot={handleExportSnapshot}
        onResetLayout={handleResetLayout}
      />
    </div>
  );
};

export default Planner3DPage;
