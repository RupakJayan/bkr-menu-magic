import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Plus,
  Compass,
  Layers,
  Sun,
  Moon,
  Sunset,
  Camera,
  Download,
  MapPin,
  Sliders,
  Users,
  Grid,
  RotateCcw,
  Sparkles,
  Command,
} from "lucide-react";
import { StallType, CameraViewMode } from "@/types/planner3d";
import { playTactileClick, playChimeSuccess } from "@/utils/soundFeedback";

export interface CommandAction {
  id: string;
  title: string;
  subtitle?: string;
  category: "Stalls" | "View" | "Atmosphere" | "Tools" | "Actions";
  icon: React.ReactNode;
  shortcut?: string;
  run: () => void;
}

interface CommandPaletteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStall: (type: StallType) => void;
  onSetViewMode: (mode: CameraViewMode) => void;
  onToggleTimeOfDay: (time: "morning" | "afternoon" | "sunset" | "night") => void;
  onOpenGoogleMaps: () => void;
  onOpenInspector: () => void;
  onToggleCrowdSimulation: () => void;
  onToggleCadAisles: () => void;
  onExportSnapshot: () => void;
  onResetLayout: () => void;
}

export const CommandPaletteDialog: React.FC<CommandPaletteDialogProps> = ({
  isOpen,
  onClose,
  onAddStall,
  onSetViewMode,
  onToggleTimeOfDay,
  onOpenGoogleMaps,
  onOpenInspector,
  onToggleCrowdSimulation,
  onToggleCadAisles,
  onExportSnapshot,
  onResetLayout,
}) => {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: CommandAction[] = useMemo(
    () => [
      {
        id: "add-dosa",
        title: "Add Live Dosa Station",
        subtitle: "3-griddle live tawa counter (240 dosa/hr, 6.0 kW)",
        category: "Stalls",
        icon: <Plus className="h-4 w-4 text-[#e2c99a]" />,
        shortcut: "D",
        run: () => onAddStall("dosa"),
      },
      {
        id: "add-biryani",
        title: "Add Grand Buffet Spread",
        subtitle: "Full concourse buffet islands with warm chafing dishes",
        category: "Stalls",
        icon: <Plus className="h-4 w-4 text-[#e2c99a]" />,
        shortcut: "B",
        run: () => onAddStall("buffet_spread"),
      },
      {
        id: "add-coffee",
        title: "Add Beverage & Coffee Bar",
        subtitle: "Kumbakonam degree filter coffee brass dispensers",
        category: "Stalls",
        icon: <Plus className="h-4 w-4 text-[#e2c99a]" />,
        shortcut: "C",
        run: () => onAddStall("beverage_bar"),
      },
      {
        id: "add-sweet",
        title: "Add Sweet & Halwa Concourse",
        subtitle: "Tirunelveli halwa & hot jalebi live presentation",
        category: "Stalls",
        icon: <Plus className="h-4 w-4 text-[#e2c99a]" />,
        shortcut: "S",
        run: () => onAddStall("sweet_halwa"),
      },
      {
        id: "add-chaat",
        title: "Add Delhi Live Chaat Station",
        subtitle: "Pani poori, bhel & samosa chaat live preparation",
        category: "Stalls",
        icon: <Plus className="h-4 w-4 text-[#e2c99a]" />,
        shortcut: "T",
        run: () => onAddStall("chaat"),
      },
      {
        id: "view-2d",
        title: "Switch to 2D CAD Blueprint Mode",
        subtitle: "Orthographic top-down CAD schematic with dimension callouts",
        category: "View",
        icon: <Layers className="h-4 w-4 text-sky-400" />,
        shortcut: "2",
        run: () => onSetViewMode("top_down"),
      },
      {
        id: "view-3d",
        title: "Switch to 3D Cinematic Reality Mode",
        subtitle: "Hardware-accelerated perspective viewport with lighting",
        category: "View",
        icon: <Compass className="h-4 w-4 text-[#e2c99a]" />,
        shortcut: "3",
        run: () => onSetViewMode("orbit"),
      },
      {
        id: "view-walk",
        title: "Switch to Guest Eye-Level Walkthrough",
        subtitle: "1.7m eye-level perspective inside the entrance facing stage",
        category: "View",
        icon: <Users className="h-4 w-4 text-emerald-400" />,
        shortcut: "1",
        run: () => onSetViewMode("walkthrough"),
      },
      {
        id: "light-sunset",
        title: "Set Sunset / Golden Hour Lighting",
        subtitle: "Warm amber sun rays and directional long shadows",
        category: "Atmosphere",
        icon: <Sunset className="h-4 w-4 text-amber-400" />,
        run: () => onToggleTimeOfDay("sunset"),
      },
      {
        id: "light-night",
        title: "Set Festive Night Serial Lights",
        subtitle: "Moonlit sky with warm gold fairy serial lights",
        category: "Atmosphere",
        icon: <Moon className="h-4 w-4 text-indigo-400" />,
        run: () => onToggleTimeOfDay("night"),
      },
      {
        id: "light-morning",
        title: "Set Morning Muhurtham Daylight",
        subtitle: "Crisp natural high-noon sunlight for architectural clarity",
        category: "Atmosphere",
        icon: <Sun className="h-4 w-4 text-yellow-300" />,
        run: () => onToggleTimeOfDay("morning"),
      },
      {
        id: "maps-search",
        title: "Search Google Maps & Satellite Places",
        subtitle: "Geocode any Mahal or Mandapam and project real photos",
        category: "Tools",
        icon: <MapPin className="h-4 w-4 text-rose-400" />,
        shortcut: "M",
        run: onOpenGoogleMaps,
      },
      {
        id: "cad-inspector",
        title: "Open CAD Precision Dimensions Inspector",
        subtitle: "Numeric inputs for stall coordinates, dimensions & rotation",
        category: "Tools",
        icon: <Sliders className="h-4 w-4 text-[#e2c99a]" />,
        shortcut: "I",
        run: onOpenInspector,
      },
      {
        id: "crowd-sim",
        title: "Toggle 1 Lakh Pax Crowd Queue Simulation",
        subtitle: "Particle flow heatmap showing queue bottlenecks and clearance",
        category: "Tools",
        icon: <Users className="h-4 w-4 text-purple-400" />,
        run: onToggleCrowdSimulation,
      },
      {
        id: "cad-aisles",
        title: "Toggle Architectural CAD Aisle Lines",
        subtitle: "Fire safety egress and dimension leader overlays",
        category: "Tools",
        icon: <Grid className="h-4 w-4 text-cyan-400" />,
        run: onToggleCadAisles,
      },
      {
        id: "export-png",
        title: "Export 3D Floor Plan Snapshot (PNG)",
        subtitle: "Download high-resolution image of current stage plan",
        category: "Actions",
        icon: <Camera className="h-4 w-4 text-emerald-400" />,
        shortcut: "E",
        run: onExportSnapshot,
      },
      {
        id: "reset-layout",
        title: "Reset Venue Layout to Default",
        subtitle: "Clear custom positions and reload optimal stage arrangement",
        category: "Actions",
        icon: <RotateCcw className="h-4 w-4 text-neutral-400" />,
        run: onResetLayout,
      },
    ],
    [
      onAddStall,
      onSetViewMode,
      onToggleTimeOfDay,
      onOpenGoogleMaps,
      onOpenInspector,
      onToggleCrowdSimulation,
      onToggleCadAisles,
      onExportSnapshot,
      onResetLayout,
    ]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return actions;
    const q = search.toLowerCase();
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.subtitle && a.subtitle.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
    );
  }, [actions, search]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const executeAction = (action: CommandAction) => {
    playTactileClick(600);
    action.run();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        executeAction(filtered[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#0c0e14] text-[#f4efe6] shadow-2xl overflow-hidden font-mono select-none"
      >
        {/* Command Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-white/[0.08] bg-[#12141c] gap-3">
          <Command className="h-4 w-4 text-[#e2c99a]" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search action (e.g. Dosa, 2D CAD, Sunset, Maps)..."
            className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
          />
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
            ESC
          </span>
        </div>

        {/* Action List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              No matching commands found for "{search}"
            </div>
          ) : (
            filtered.map((action, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={action.id}
                  onClick={() => executeAction(action)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                    isSelected
                      ? "bg-[#222530] text-white border border-[#e2c99a]/40 shadow-sm"
                      : "text-neutral-300 hover:bg-[#161822] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#181a24] border border-white/10 flex items-center justify-center shrink-0">
                      {action.icon}
                    </div>
                    <div className="truncate">
                      <div className="font-bold flex items-center gap-2">
                        <span>{action.title}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/[0.06] text-neutral-400 border border-white/[0.06] uppercase">
                          {action.category}
                        </span>
                      </div>
                      {action.subtitle && (
                        <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                          {action.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {action.shortcut && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400 shrink-0 font-bold">
                      {action.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 border-t border-white/[0.08] bg-[#090b10] flex items-center justify-between text-[10px] text-neutral-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#e2c99a]">Linear-Style Command Engine</span>
        </div>
      </div>
    </div>
  );
};
