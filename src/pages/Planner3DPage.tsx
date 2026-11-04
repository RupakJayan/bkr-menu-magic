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
  Sparkles,
  Zap,
  Droplet,
  Utensils,
  Maximize2,
  ChevronRight,
  Eye,
  Users,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ThreeCanvas } from "@/components/planner3d/ThreeCanvas";
import { SmartCounterAdvisor } from "@/components/planner3d/SmartCounterAdvisor";
import { MandapamSelectorModal } from "@/components/planner3d/MandapamSelectorModal";
import { CustomStallCreatorModal } from "@/components/planner3d/CustomStallCreatorModal";
import { LusionParticles } from "@/components/effects/LusionParticles";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Planner3DPage: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Venue state
  const [selectedVenue, setSelectedVenue] = useState<MandapamVenue>(PRESET_VENUES[0]);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isCustomStallModalOpen, setIsCustomStallModalOpen] = useState(false);

  // Planning state
  const [headCount, setHeadCount] = useState<number>(350);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>("classic");
  const [stalls, setStalls] = useState<StallItem[]>(() =>
    getRecommendedStalls(350, "classic", PRESET_VENUES[0])
  );
  const [selectedStallId, setSelectedStallId] = useState<string | null>(null);

  // View & visualization controls
  const [viewMode, setViewMode] = useState<CameraViewMode>("orbit");
  const [blueprintOpacity, setBlueprintOpacity] = useState<number>(0.35);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showCrowdSimulation, setShowCrowdSimulation] = useState<boolean>(false);
  const [showCadAisles, setShowCadAisles] = useState<boolean>(false);
  const [isPitchMode, setIsPitchMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Capacity analysis recalculation
  const analysis = useMemo(
    () => calculateCapacityAnalysis(headCount, stalls, budgetTier),
    [headCount, stalls, budgetTier]
  );

  const selectedStall = useMemo(
    () => stalls.find((s) => s.id === selectedStallId) || null,
    [stalls, selectedStallId]
  );

  // Apply recommended optimal layout
  const handleApplyOptimalLayout = () => {
    const freshStalls = getRecommendedStalls(headCount, budgetTier, selectedVenue);
    setStalls(freshStalls);
    setSelectedStallId(null);
    toast.success("Optimal 3D Layout Applied", {
      description: `Configured ${freshStalls.length} counters balanced for ${headCount} guests.`,
    });
  };

  // Add stall from catalog
  const handleAddStall = (type: StallType) => {
    const catalogItem = STALL_CATALOG[type];
    const newId = `${type}-${Date.now().toString().slice(-4)}`;
    // Place in an open spot near the center or offset
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

  // Duplicate specific stall (e.g. duplicate Dosa counter)
  const handleDuplicateStall = (stallId: string) => {
    const target = stalls.find((s) => s.id === stallId);
    if (!target) return;
    const newId = `${target.type}-${Date.now().toString().slice(-4)}`;
    const cloned: StallItem = {
      ...target,
      id: newId,
      name: `${target.name} (Counter #${stalls.filter((s) => s.type === target.type).length + 1})`,
      position: [-target.position[0], 0, target.position[2]], // Mirror to opposite wing
      wing: target.position[0] < 0 ? "South" : "North",
    };
    setStalls((prev) => [...prev, cloned]);
    setSelectedStallId(newId);
    toast.success(`Duplicated ${target.name}`, {
      description: `Placed opposite wing for optimal crowd flow.`,
    });
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
      link.download = `cater-o-phobic-3d-plan-${selectedVenue.id}-${headCount}pax.png`;
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
    <div className="relative w-screen h-screen overflow-hidden bg-[#050508] text-ink font-body flex flex-col">
      {/* Background Lusion Particles */}
      <LusionParticles particleCount={30} speed={0.4} />

      {/* 1. TOP HUD HEADER */}
      <header className="relative z-30 flex items-center justify-between px-4 py-2.5 border-b border-line bg-[#0c0d16]/85 backdrop-blur-xl">
        {/* Brand & Return */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 rounded-lg bg-white/5 border border-line text-mute hover:text-ink hover:bg-white/10 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-sm bg-gradient-to-r from-[#00f5d4] via-[#38bdf8] to-[#d8b36d] bg-clip-text text-transparent">
                CATER-O-PHOBIC
              </span>
              <Badge className="bg-[#00f5d4]/10 text-[#00f5d4] border-[#00f5d4]/30 text-[10px] font-mono font-semibold px-1.5 py-0">
                3D LABS
              </Badge>
            </div>
            <p className="text-[10px] text-mute hidden sm:block">
              Next-Gen Buffet & Mandapam Stalls Visualizer
            </p>
          </div>
        </div>

        {/* Center Venue Selector */}
        <button
          onClick={() => setIsVenueModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surf-2 border border-line hover:border-[#00f5d4]/50 transition-all text-xs"
        >
          <MapPin className="h-3.5 w-3.5 text-[#00f5d4]" />
          <div className="text-left">
            <span className="font-bold text-ink block">{selectedVenue.name}</span>
            <span className="text-[10px] text-mute block">
              {selectedVenue.hallWidth}m × {selectedVenue.hallLength}m • Click to switch or upload
              map
            </span>
          </div>
        </button>

        {/* Camera Views & Controls */}
        <div className="flex items-center gap-2">
          {/* Camera View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-surf border border-line">
            <button
              onClick={() => setViewMode("orbit")}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                viewMode === "orbit"
                  ? "bg-[#00f5d4] text-black font-bold shadow-sm"
                  : "text-mute hover:text-ink"
              }`}
            >
              3D Orbit
            </button>
            <button
              onClick={() => setViewMode("top_down")}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                viewMode === "top_down"
                  ? "bg-[#00f5d4] text-black font-bold shadow-sm"
                  : "text-mute hover:text-ink"
              }`}
            >
              2D Plan
            </button>
            <button
              onClick={() => setViewMode("walkthrough")}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                viewMode === "walkthrough"
                  ? "bg-[#00f5d4] text-black font-bold shadow-sm"
                  : "text-mute hover:text-ink"
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
                ? "bg-[#00f5d4]/20 border-[#00f5d4] text-[#00f5d4]"
                : "bg-surf border-line text-mute hover:text-ink"
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
                ? "bg-surf-2 border-[#00f5d4]/40 text-[#00f5d4]"
                : "bg-surf border-line text-mute hover:text-ink"
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
                ? "bg-[#f59e0b]/20 border-[#f59e0b] text-[#f59e0b]"
                : "bg-surf border-line text-mute hover:text-ink"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span className="hidden xl:inline text-[11px] font-semibold">CAD Aisles</span>
          </button>

          {/* Interactive Crowd Flow Simulation Toggle */}
          <button
            onClick={() => {
              setShowCrowdSimulation((prev) => !prev);
              toast.info(!showCrowdSimulation ? "Simulating 7:30 PM Peak Dinner Flow" : "Crowd simulation paused");
            }}
            title="Simulate Peak Muhurtham Crowd Movement"
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showCrowdSimulation
                ? "bg-[#00f5d4]/20 border-[#00f5d4] text-[#00f5d4] shadow-md shadow-[#00f5d4]/20 animate-pulse"
                : "bg-surf border-line text-mute hover:text-ink"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">{showCrowdSimulation ? "Crowd Active" : "Simulate Crowd"}</span>
          </button>

          {/* Client Pitch Presentation Mode Toggle */}
          <Button
            size="sm"
            onClick={() => {
              const nextState = !isPitchMode;
              setIsPitchMode(nextState);
              if (nextState) {
                setIsSidebarOpen(false);
                setShowCrowdSimulation(true);
                toast.success("Client Pitch Mode Activated", {
                  description: "Cinematic drone orbit & clutter-free presentation view.",
                });
              } else {
                setIsSidebarOpen(true);
              }
            }}
            className={`h-8 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-all ${
              isPitchMode
                ? "bg-gradient-to-r from-[#d8b36d] to-[#f59e0b] text-black"
                : "bg-surf-2 border border-line text-ink hover:text-[#00f5d4]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isPitchMode ? "Exit Pitch" : "Client Pitch Mode"}</span>
          </Button>

          {/* Export Snapshot */}
          <Button
            size="sm"
            onClick={handleExportSnapshot}
            className="h-8 text-xs bg-gradient-to-r from-[#00f5d4] to-[#0284c7] hover:opacity-90 text-black font-bold rounded-xl shadow-lg flex items-center gap-1.5"
          >
            <Camera className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export 3D Snapshot</span>
          </Button>

          <ThemeToggle />
        </div>
      </header>

      {/* 2. MAIN 3D WORKSPACE VIEWPORT */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Drawer: Smart Counter Advisor & Capacity Analyzer */}
        <aside
          className={`relative z-20 transition-all duration-300 ease-in-out border-r border-line bg-[#0c0d16]/90 backdrop-blur-2xl flex flex-col ${
            isSidebarOpen ? "w-80 sm:w-96" : "w-0 overflow-hidden border-none"
          }`}
        >
          <div className="flex items-center justify-between p-3 border-b border-line">
            <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#00f5d4]" />
              Smart Capacity & Duplication
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-mute hover:text-ink p-1 rounded-lg"
            >
              ×
            </button>
          </div>

          <SmartCounterAdvisor
            headCount={headCount}
            onHeadCountChange={setHeadCount}
            budgetTier={budgetTier}
            onBudgetTierChange={setBudgetTier}
            analysis={analysis}
            stalls={stalls}
            onAddStall={handleAddStall}
            onDuplicateStall={handleDuplicateStall}
            onRemoveStall={handleRemoveStall}
            onApplyOptimalLayout={handleApplyOptimalLayout}
            onOpenCustomStallModal={() => setIsCustomStallModalOpen(true)}
          />
        </aside>

        {/* Toggle open sidebar button when closed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-3 top-3 z-30 p-2.5 rounded-xl bg-[#0c0d16] border border-[#00f5d4]/40 text-[#00f5d4] shadow-xl hover:scale-105 transition-transform"
            title="Open Capacity Advisor"
          >
            <Sparkles className="h-5 w-5" />
          </button>
        )}

        {/* Center: Interactive 3D Canvas */}
        <main className="relative flex-1 h-full w-full">
          <ThreeCanvas
            venue={selectedVenue}
            stalls={stalls}
            selectedStallId={selectedStallId}
            onSelectStall={(stall) => setSelectedStallId(stall ? stall.id : null)}
            onMoveStall={handleMoveStall}
            viewMode={viewMode}
            blueprintOpacity={blueprintOpacity}
            showGrid={showGrid}
            showCrowdSimulation={showCrowdSimulation}
            showCadAisles={showCadAisles}
            cinematicAutoRotate={isPitchMode}
            isDark={isDark}
            canvasRef={canvasRef}
          />

          {/* Floating Instructions HUD */}
          <div className="absolute top-4 right-4 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-[11px] text-white/80 space-y-0.5">
            <p>• Left Click + Drag to rotate 3D view</p>
            <p>• Scroll to zoom in / out</p>
            <p>• Click any stall to select, rotate or duplicate</p>
            <p>• Click floor to relocate selected stall</p>
          </div>

          {/* Selected Stall Floating Inspector Card */}
          {selectedStall && (
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 bg-[#0c0d16]/95 border border-[#00f5d4]/50 p-4 rounded-2xl shadow-2xl backdrop-blur-2xl w-min(90vw,480px) space-y-3 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedStall.accentColor }}
                    />
                    <h4 className="font-bold text-sm text-ink">{selectedStall.name}</h4>
                  </div>
                  <p className="text-xs text-[#d8b36d] font-tamil font-medium">
                    {selectedStall.name_ta}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRotateSelected}
                    className="h-8 px-2 text-xs border-line text-ink hover:text-[#00f5d4] hover:bg-white/10 rounded-lg flex items-center gap-1"
                    title="Rotate 45°"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    Rotate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDuplicateStall(selectedStall.id)}
                    className="h-8 px-2 text-xs border-[#00f5d4]/40 text-[#00f5d4] hover:bg-[#00f5d4]/10 rounded-lg flex items-center gap-1 font-semibold"
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
                    className="text-mute hover:text-ink text-sm px-1.5"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Specs & Power details */}
              <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-line">
                <div className="flex items-center gap-1 text-mute">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>{selectedStall.powerRequiredKw} kW</span>
                </div>
                <div className="flex items-center gap-1 text-mute">
                  <Droplet className="h-3.5 w-3.5 text-sky-400" />
                  <span>{selectedStall.waterRequired ? "Water Line Req" : "Dry Station"}</span>
                </div>
                <div className="flex items-center gap-1 text-mute font-mono">
                  <Utensils className="h-3.5 w-3.5 text-[#00f5d4]" />
                  <span>{selectedStall.capacityPerHour} pax/hr</span>
                </div>
              </div>

              {/* Sample Dishes */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-mute block">
                  Dishes Served at Counter
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedStall.dishes.slice(0, 4).map((d, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-surf-2 border border-line text-ink"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. BOTTOM FLOATING STALL CATALOG DRAWER */}
      <footer className="relative z-30 px-4 py-2.5 border-t border-line bg-[#0c0d16]/90 backdrop-blur-2xl">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-thin pb-1">
          <Button
            size="sm"
            onClick={() => setIsCustomStallModalOpen(true)}
            className="h-8 text-xs bg-gradient-to-r from-[#8b5cf6] to-[#00f5d4] hover:opacity-90 text-black font-bold rounded-xl shadow-lg flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Photo-to-3D Stall
          </Button>

          <span className="text-xs font-bold uppercase tracking-wider text-mute shrink-0 flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-[#00f5d4]" />
            Add Stalls:
          </span>

          {(Object.keys(STALL_CATALOG) as StallType[]).map((type) => {
            const item = STALL_CATALOG[type];
            return (
              <button
                key={type}
                onClick={() => handleAddStall(type)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surf border border-line hover:border-[#00f5d4] hover:bg-white/5 transition-all text-xs shrink-0 group"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full group-hover:scale-125 transition-transform"
                  style={{ backgroundColor: item.accentColor }}
                />
                <span className="font-semibold text-ink">{item.name}</span>
                <span className="text-[10px] text-mute font-mono">({item.capacityPerHour}/hr)</span>
              </button>
            );
          })}
        </div>
      </footer>

      {/* Mandapam Venue & Custom Blueprint Modal */}
      <MandapamSelectorModal
        open={isVenueModalOpen}
        onOpenChange={setIsVenueModalOpen}
        selectedVenue={selectedVenue}
        onSelectVenue={(v) => {
          setSelectedVenue(v);
          setStalls(getRecommendedStalls(headCount, budgetTier, v));
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
    </div>
  );
};

export default Planner3DPage;
