import React, { useState } from "react";
import {
  Sliders,
  RotateCw,
  Copy,
  Trash2,
  Maximize2,
  Compass,
  MapPin,
  Check,
  Grid,
  Sparkles,
  Zap,
  Droplet,
  Users,
  Building,
  Layers,
  Search,
  Plus,
  ArrowRight,
  ShieldCheck,
  Eye,
  SlidersHorizontal,
  Camera,
  Upload,
} from "lucide-react";
import { StallItem, MandapamVenue, StallType } from "@/types/planner3d";
import { STALL_CATALOG } from "@/services/planner3dService";
import { Button } from "@/components/ui/button";
import { DimensionCaliperVector, CrosshairVector, DatumVector } from "@/components/ui/VectorIcons";
import { playTactileClick } from "@/utils/soundFeedback";
import { assetUrl } from "@/utils/assetUrl";
import { toast } from "sonner";

interface PrecisionDimensionsInspectorProps {
  selectedStall: StallItem | null;
  onUpdateStall: (updated: StallItem) => void;
  onDeselectStall: () => void;
  onDuplicateStall: (id: string) => void;
  onDeleteStall: (id: string) => void;
  venue: MandapamVenue;
  onUpdateVenue: (updated: MandapamVenue) => void;
  headCount: number;
  onUpdateHeadCount: (count: number) => void;
  onOpenGoogleMapsSearch: () => void;
  stalls?: StallItem[];
  onSelectStall?: (id: string) => void;
  onAddStall?: (type: StallType) => void;
  isDark?: boolean;
}

export const PrecisionDimensionsInspector: React.FC<PrecisionDimensionsInspectorProps> = ({
  selectedStall,
  onUpdateStall,
  onDeselectStall,
  onDuplicateStall,
  onDeleteStall,
  venue,
  onUpdateVenue,
  headCount,
  onUpdateHeadCount,
  onOpenGoogleMapsSearch,
  stalls = [],
  onSelectStall,
  onAddStall,
  isDark = true,
}) => {
  // Navigation tabs within inspector: "venue" or "roster"
  const [activeTab, setActiveTab] = useState<"venue" | "roster">("venue");
  const [rosterSearch, setRosterSearch] = useState("");

  // Live calculated science metrics based on user headcount
  const recommendedCounters = Math.max(4, Math.ceil(headCount / 250));
  const peakFlowRate = Math.round(headCount / 1.75);
  const floorAreaM2 = Math.round(venue.hallWidth * venue.hallLength);
  const floorAreaSqFt = Math.round(floorAreaM2 * 10.764);
  const guestDensity = headCount > 0 ? (floorAreaM2 / headCount).toFixed(2) : "0";
  const isDensitySafe = parseFloat(guestDensity) >= 0.35;

  // Stalls summary metrics
  const totalPowerLoadKw = stalls.reduce((sum, s) => sum + (s.powerRequiredKw || 0), 0);
  const totalThroughput = stalls.reduce((sum, s) => sum + (s.capacityPerHour || 0), 0);

  // Filtered stalls for roster
  const filteredStalls = stalls.filter(
    (s) =>
      s.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      (s.wing && s.wing.toLowerCase().includes(rosterSearch.toLowerCase()))
  );

  return (
    <div
      className={`flex flex-col h-full font-mono text-xs select-none transition-colors duration-200 ${
        isDark ? "bg-[#11131a] text-[#f1f3f7]" : "bg-[#ffffff] text-[#1e293b]"
      }`}
    >
      {/* 1. Header Tabs: Venue Architecture vs Active Stalls Roster */}
      <div
        className={`p-2.5 border-b flex items-center justify-between transition-colors ${
          isDark
            ? "border-white/[0.08] bg-[#161922]"
            : "border-slate-200 bg-[#f8fafc]"
        }`}
      >
        {selectedStall ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <DimensionCaliperVector
                size={16}
                className={isDark ? "text-[#f0c889]" : "text-[#b38238]"}
              />
              <span
                className={`font-bold uppercase tracking-wider text-[11px] ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Counter Inspector
              </span>
            </div>
            <button
              onClick={() => {
                onDeselectStall();
                playTactileClick(480);
              }}
              className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10"
                  : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
              }`}
            >
              ← Back to Venue Specs
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 w-full">
            <button
              onClick={() => {
                setActiveTab("venue");
                playTactileClick(520);
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border ${
                activeTab === "venue"
                  ? isDark
                    ? "bg-[#222736] border-[#f0c889]/60 text-[#f0c889] shadow-sm"
                    : "bg-white border-[#b38238] text-[#b38238] shadow-sm"
                  : isDark
                  ? "border-transparent text-neutral-400 hover:text-white hover:bg-white/5"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Building size={13} />
              <span>Venue Specs</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("roster");
                playTactileClick(520);
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border ${
                activeTab === "roster"
                  ? isDark
                    ? "bg-[#222736] border-[#f0c889]/60 text-[#f0c889] shadow-sm"
                    : "bg-white border-[#b38238] text-[#b38238] shadow-sm"
                  : isDark
                  ? "border-transparent text-neutral-400 hover:text-white hover:bg-white/5"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Layers size={13} />
              <span>Stalls Roster ({stalls.length})</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 scrollbar-thin">
        {selectedStall ? (
          /* =========================================================================
             A. STALL CAD INSPECTOR (WHEN A STALL IS SELECTED)
             ========================================================================= */
          <div className="space-y-4">
            {/* Stall Identification & Custom Name */}
            <div className="space-y-1.5">
              <label
                className={`text-[10px] block uppercase font-semibold ${
                  isDark ? "text-neutral-400" : "text-slate-500"
                }`}
              >
                Stall Name / Tag (Editable):
              </label>
              <input
                type="text"
                value={selectedStall.name}
                onChange={(e) =>
                  onUpdateStall({ ...selectedStall, name: e.target.value })
                }
                className={`w-full px-3 py-1.5 rounded-lg border font-bold text-xs focus:outline-none transition-colors ${
                  isDark
                    ? "bg-[#0b0d13] border-white/10 text-white focus:border-[#f0c889]"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-[#b38238]"
                }`}
              />
            </div>

            {/* REAL-WORLD STALL PHOTOGRAPH & TEXTURE */}
            <div
              className={`p-3 rounded-xl border space-y-2 ${
                isDark ? "bg-[#0c0e15] border-white/[0.08]" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-1.5 border-white/[0.06]">
                <span className={`text-[10px] font-bold uppercase flex items-center gap-1.5 ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`}>
                  <Camera size={13} />
                  Real Stall Appearance:
                </span>
                <span className="text-[9px] text-neutral-400">
                  Texture Mapped in 3D
                </span>
              </div>

              {/* Stall Photograph Preview */}
              <div className="relative h-28 w-full rounded-lg overflow-hidden bg-black border border-white/10 group">
                <img
                  src={
                    selectedStall.customPhotoUrl ||
                    (selectedStall.type.includes("dosa")
                      ? assetUrl("/home-south-indian-food.jpg")
                      : selectedStall.type.includes("traditional") || selectedStall.type.includes("dining")
                      ? assetUrl("/home-south-indian-feast.jpg")
                      : selectedStall.type.includes("chaat")
                      ? assetUrl("/home-south-indian-snacks.jpg")
                      : selectedStall.type.includes("beverage")
                      ? assetUrl("/home-catering-table.jpg")
                      : selectedStall.type.includes("dessert") || selectedStall.type.includes("sweet")
                      ? assetUrl("/bkr-catering-reference.png")
                      : assetUrl("/home-catering-table.jpg"))
                  }
                  alt={selectedStall.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-mono text-white transition-opacity cursor-pointer">
                  <Upload size={16} className="text-[#f0c889] mb-1" />
                  <span>Upload Stall Photograph</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const url = ev.target?.result as string;
                        onUpdateStall({ ...selectedStall, customPhotoUrl: url });
                        toast.success("Updated Stall 3D Texture Photo");
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span>{selectedStall.tamilName || selectedStall.name}</span>
                <span className="text-[#f0c889]">
                  {selectedStall.customPhotoUrl ? "✓ Custom Image" : "✓ Authentic BKR Photo"}
                </span>
              </div>
            </div>

            {/* Wing / Concourse Assignment & Custom Accent Color */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  className={`text-[10px] block mb-1 ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Wing Assignment:
                </label>
                <select
                  value={selectedStall.wing || "North"}
                  onChange={(e) =>
                    onUpdateStall({
                      ...selectedStall,
                      wing: e.target.value as any,
                    })
                  }
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none ${
                    isDark
                      ? "bg-[#0b0d13] border-white/10 text-white focus:border-[#f0c889]"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-[#b38238]"
                  }`}
                >
                  <option value="North">North Wing</option>
                  <option value="South">South Wing</option>
                  <option value="East">East Flank</option>
                  <option value="West">West Flank</option>
                  <option value="Central">Central Courtyard</option>
                </select>
              </div>

              <div>
                <label
                  className={`text-[10px] block mb-1 ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Custom Stall Tint:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedStall.accentColor || "#ef4444"}
                    onChange={(e) =>
                      onUpdateStall({
                        ...selectedStall,
                        accentColor: e.target.value,
                        color: e.target.value,
                      })
                    }
                    className="w-8 h-8 rounded-lg border cursor-pointer p-0.5 bg-transparent"
                  />
                  <span
                    className={`text-[10px] uppercase font-mono ${
                      isDark ? "text-neutral-400" : "text-slate-600"
                    }`}
                  >
                    {selectedStall.accentColor}
                  </span>
                </div>
              </div>
            </div>

            {/* DIRECT NUMERIC SIZE INPUTS (Width, Depth, Height) */}
            <div
              className={`p-3 rounded-xl border space-y-2.5 ${
                isDark
                  ? "bg-[#0c0e15] border-white/[0.08]"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-1.5 ${
                  isDark ? "border-white/[0.06]" : "border-slate-200"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase flex items-center gap-1 ${
                    isDark ? "text-[#f0c889]" : "text-[#b38238]"
                  }`}
                >
                  <DimensionCaliperVector size={13} />
                  Counter Size in Meters:
                </span>
                <span
                  className={`text-[9px] ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Footprint: {(selectedStall.width * selectedStall.depth).toFixed(2)} m²
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label
                    className={`text-[9px] block mb-1 ${
                      isDark ? "text-neutral-400" : "text-slate-500"
                    }`}
                  >
                    Width (m):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.4"
                    max="15"
                    value={selectedStall.width}
                    onChange={(e) =>
                      onUpdateStall({
                        ...selectedStall,
                        width: Math.max(0.4, parseFloat(e.target.value) || 0.4),
                      })
                    }
                    className={`w-full px-2 py-1 rounded-md border font-bold text-center focus:outline-none ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                        : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-[9px] block mb-1 ${
                      isDark ? "text-neutral-400" : "text-slate-500"
                    }`}
                  >
                    Depth (m):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.4"
                    max="15"
                    value={selectedStall.depth}
                    onChange={(e) =>
                      onUpdateStall({
                        ...selectedStall,
                        depth: Math.max(0.4, parseFloat(e.target.value) || 0.4),
                      })
                    }
                    className={`w-full px-2 py-1 rounded-md border font-bold text-center focus:outline-none ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                        : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-[9px] block mb-1 ${
                      isDark ? "text-neutral-400" : "text-slate-500"
                    }`}
                  >
                    Height (m):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.4"
                    max="6"
                    value={selectedStall.height}
                    onChange={(e) =>
                      onUpdateStall({
                        ...selectedStall,
                        height: Math.max(0.4, parseFloat(e.target.value) || 0.4),
                      })
                    }
                    className={`w-full px-2 py-1 rounded-md border font-bold text-center focus:outline-none ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                        : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* DIRECT NUMERIC POSITION & ROTATION INPUTS */}
            <div
              className={`p-3 rounded-xl border space-y-2.5 ${
                isDark
                  ? "bg-[#0c0e15] border-white/[0.08]"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-1.5 ${
                  isDark ? "border-white/[0.06]" : "border-slate-200"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase flex items-center gap-1 ${
                    isDark ? "text-[#f0c889]" : "text-[#b38238]"
                  }`}
                >
                  <CrosshairVector size={13} />
                  3D Coordinates &amp; Angle:
                </span>
                <span
                  className={`text-[9px] ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Snap: 0.5m
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label
                    className={`text-[9px] block mb-1 ${
                      isDark ? "text-neutral-400" : "text-slate-500"
                    }`}
                  >
                    X (East/West):
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={parseFloat(selectedStall.position[0].toFixed(2))}
                    onChange={(e) =>
                      onUpdateStall({
                        ...selectedStall,
                        position: [
                          parseFloat(e.target.value) || 0,
                          selectedStall.position[1],
                          selectedStall.position[2],
                        ],
                      })
                    }
                    className={`w-full px-2 py-1 rounded-md border font-bold text-center focus:outline-none ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                        : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-[9px] block mb-1 ${
                      isDark ? "text-neutral-400" : "text-slate-500"
                    }`}
                  >
                    Z (North/South):
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={parseFloat(selectedStall.position[2].toFixed(2))}
                    onChange={(e) =>
                      onUpdateStall({
                        ...selectedStall,
                        position: [
                          selectedStall.position[0],
                          selectedStall.position[1],
                          parseFloat(e.target.value) || 0,
                        ],
                      })
                    }
                    className={`w-full px-2 py-1 rounded-md border font-bold text-center focus:outline-none ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                        : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-[9px] block mb-1 ${
                      isDark ? "text-neutral-400" : "text-slate-500"
                    }`}
                  >
                    Rotation (°):
                  </label>
                  <input
                    type="number"
                    step="15"
                    value={Math.round((selectedStall.rotation * 180) / Math.PI)}
                    onChange={(e) =>
                      onUpdateStall({
                        ...selectedStall,
                        rotation:
                          ((parseFloat(e.target.value) || 0) * Math.PI) / 180,
                      })
                    }
                    className={`w-full px-2 py-1 rounded-md border font-bold text-center focus:outline-none ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                        : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                    }`}
                  />
                </div>
              </div>

              {/* Quick Rotation Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[0, 90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => {
                      onUpdateStall({
                        ...selectedStall,
                        rotation: (deg * Math.PI) / 180,
                      });
                      playTactileClick(560);
                    }}
                    className={`py-1 rounded text-[10px] border transition-all ${
                      Math.round((selectedStall.rotation * 180) / Math.PI) % 360 === deg
                        ? isDark
                          ? "bg-[#f0c889] text-black font-bold border-[#f0c889]"
                          : "bg-[#b38238] text-white font-bold border-[#b38238]"
                        : isDark
                        ? "bg-[#161924] border-white/10 text-neutral-300 hover:text-white"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity & Electrical Specs */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`p-2.5 rounded-xl border ${
                  isDark
                    ? "bg-[#0c0e15] border-white/[0.08]"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <label
                  className={`text-[9px] block mb-1 ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Capacity (Pax / Hr):
                </label>
                <input
                  type="number"
                  step="25"
                  value={selectedStall.capacityPerHour}
                  onChange={(e) =>
                    onUpdateStall({
                      ...selectedStall,
                      capacityPerHour: parseInt(e.target.value, 10) || 50,
                    })
                  }
                  className={`w-full px-2 py-1 rounded-md border font-bold text-center ${
                    isDark
                      ? "bg-[#161924] border-white/10 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}
                />
              </div>

              <div
                className={`p-2.5 rounded-xl border ${
                  isDark
                    ? "bg-[#0c0e15] border-white/[0.08]"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <label
                  className={`text-[9px] block mb-1 ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Power Load (kW):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={selectedStall.powerRequiredKw}
                  onChange={(e) =>
                    onUpdateStall({
                      ...selectedStall,
                      powerRequiredKw: parseFloat(e.target.value) || 1.0,
                    })
                  }
                  className={`w-full px-2 py-1 rounded-md border font-bold text-center ${
                    isDark
                      ? "bg-[#161924] border-white/10 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            </div>

            {/* Quick Actions (Duplicate / Snap / Delete) */}
            <div className="space-y-1.5 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  onClick={() => onDuplicateStall(selectedStall.id)}
                  className={`w-full h-8 text-[11px] border flex items-center justify-center gap-1.5 transition-all ${
                    isDark
                      ? "bg-[#1f2433] text-[#f0c889] border-white/10 hover:border-[#f0c889]"
                      : "bg-slate-100 text-[#b38238] border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Duplicate</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => onDeleteStall(selectedStall.id)}
                  className="w-full h-8 text-[11px] bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </Button>
              </div>

              <button
                onClick={() => {
                  onUpdateStall({
                    ...selectedStall,
                    position: [
                      Math.round(selectedStall.position[0] * 2) / 2,
                      selectedStall.position[1],
                      Math.round(selectedStall.position[2] * 2) / 2,
                    ],
                  });
                  playTactileClick(600);
                }}
                className={`w-full py-1.5 rounded-lg border text-[10px] flex items-center justify-center gap-1 transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 text-neutral-300 hover:text-white"
                    : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Grid
                  className={`h-3 w-3 ${
                    isDark ? "text-[#f0c889]" : "text-[#b38238]"
                  }`}
                />
                Snap Position to Exact 0.5m CAD Grid
              </button>
            </div>
          </div>
        ) : activeTab === "venue" ? (
          /* =========================================================================
             B. VENUE ARCHITECTURAL SPECIFICATIONS TAB (COMPLETELY EDITABLE)
             ========================================================================= */
          <div className="space-y-4">
            {/* 1. VENUE NAME & ADDRESS (DIRECTLY EDITABLE TEXT INPUTS) */}
            <div
              className={`p-3 rounded-xl border space-y-2.5 ${
                isDark
                  ? "bg-[#0c0e15] border-white/[0.08]"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-1.5 border-white/[0.06]">
                <span
                  className={`text-[10px] uppercase font-bold flex items-center gap-1.5 ${
                    isDark ? "text-[#f0c889]" : "text-[#b38238]"
                  }`}
                >
                  <Building size={13} />
                  Venue Identity (Editable):
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-semibold ${
                    isDark
                      ? "bg-[#1f2433] text-[#f0c889] border-white/10"
                      : "bg-white text-[#b38238] border-slate-300"
                  }`}
                >
                  {venue.terrainType}
                </span>
              </div>

              <div className="space-y-1">
                <label
                  className={`text-[9px] block uppercase ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Venue Title / Mandapam Name:
                </label>
                <input
                  type="text"
                  value={venue.name}
                  onChange={(e) =>
                    onUpdateVenue({ ...venue, name: e.target.value })
                  }
                  className={`w-full px-2.5 py-1.5 rounded-lg border font-bold text-xs focus:outline-none ${
                    isDark
                      ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                      : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                  }`}
                  placeholder="e.g. Sri Krishna Kalyana Mandapam"
                />
              </div>

              <div className="space-y-1">
                <label
                  className={`text-[9px] block uppercase ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Location / City &amp; Route:
                </label>
                <input
                  type="text"
                  value={venue.location}
                  onChange={(e) =>
                    onUpdateVenue({ ...venue, location: e.target.value })
                  }
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none ${
                    isDark
                      ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                      : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                  }`}
                  placeholder="e.g. Pollachi Main Road, Coimbatore"
                />
              </div>

              <Button
                size="sm"
                onClick={onOpenGoogleMapsSearch}
                className={`w-full h-8 text-[11px] font-bold flex items-center justify-center gap-1.5 mt-1 transition-all ${
                  isDark
                    ? "bg-[#f0c889] text-black hover:bg-[#d4a359]"
                    : "bg-[#b38238] text-white hover:bg-[#946824]"
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Search Google Maps Mahal Photos</span>
              </Button>
            </div>

            {/* 2. PLANNED GUEST HEADCOUNT (ANY NUMBER EDITABLE, e.g. 2465) */}
            <div
              className={`p-3 rounded-xl border space-y-2.5 ${
                isDark
                  ? "bg-[#0c0e15] border-white/[0.08]"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-1.5 border-white/[0.06]">
                <span
                  className={`text-[10px] uppercase font-bold flex items-center gap-1.5 ${
                    isDark ? "text-[#f0c889]" : "text-[#b38238]"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  Planned Guest Headcount (Pax):
                </span>
                <span
                  className={`text-xs font-bold ${
                    isDark ? "text-[#f0c889]" : "text-[#b38238]"
                  }`}
                >
                  {headCount.toLocaleString("en-IN")} Pax
                </span>
              </div>

              {/* Direct Numeric Input - User can type ANY number freely */}
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  max="100000"
                  step="1"
                  value={headCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onUpdateHeadCount(isNaN(val) ? 500 : Math.max(1, val));
                  }}
                  className={`w-full px-3 py-2 rounded-lg border font-mono font-bold text-center text-sm focus:outline-none ${
                    isDark
                      ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                      : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                  }`}
                  placeholder="Enter exact guest count (e.g. 2465)"
                />
                <span
                  className={`absolute right-3 top-2.5 text-[10px] ${
                    isDark ? "text-neutral-500" : "text-slate-400"
                  }`}
                >
                  GUESTS
                </span>
              </div>

              {/* Continuous Range Slider for Instant Scrubbing */}
              <div className="space-y-1 pt-1">
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="25"
                  value={Math.min(headCount, 10000)}
                  onChange={(e) => onUpdateHeadCount(parseInt(e.target.value, 10))}
                  className="w-full accent-[#f0c889] h-1.5 bg-neutral-700 rounded-lg cursor-pointer"
                />
                <div
                  className={`flex justify-between text-[9px] ${
                    isDark ? "text-neutral-500" : "text-slate-400"
                  }`}
                >
                  <span>100 Pax</span>
                  <span>5,000 Pax</span>
                  <span>10,000+ Pax</span>
                </div>
              </div>

              {/* Quick Fill Preset Badges (Featuring 2465 as requested!) */}
              <div className="grid grid-cols-6 gap-1 pt-1">
                {[500, 1200, 2465, 3500, 7500, 10000].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      onUpdateHeadCount(num);
                      playTactileClick(540);
                    }}
                    className={`py-1 rounded text-[9px] border transition-all ${
                      headCount === num
                        ? isDark
                          ? "bg-[#f0c889] text-black font-bold border-[#f0c889]"
                          : "bg-[#b38238] text-white font-bold border-[#b38238]"
                        : isDark
                        ? "bg-[#161924] border-white/10 text-neutral-300 hover:text-white"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {num === 2465 ? "2465★" : num >= 1000 ? `${(num / 1000).toFixed(num % 1000 ? 1 : 0)}K` : num}
                  </button>
                ))}
              </div>

              {/* Live Capacity Physics & Throughput Calculations */}
              <div
                className={`p-2.5 rounded-lg border space-y-1.5 text-[10px] ${
                  isDark
                    ? "bg-[#161924]/80 border-white/[0.06]"
                    : "bg-slate-100 border-slate-200"
                }`}
              >
                <div className="flex justify-between">
                  <span className={isDark ? "text-neutral-400" : "text-slate-500"}>
                    Recommended Live Counters:
                  </span>
                  <span className="font-bold text-emerald-400">
                    {recommendedCounters} Stations
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? "text-neutral-400" : "text-slate-500"}>
                    Peak Buffet Rate:
                  </span>
                  <span className="font-bold text-sky-400">
                    ~{peakFlowRate} guests/hr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? "text-neutral-400" : "text-slate-500"}>
                    Guest Spatial Density:
                  </span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      isDensitySafe ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {guestDensity} m²/pax
                    {isDensitySafe ? (
                      <ShieldCheck size={11} />
                    ) : (
                      <span className="text-[9px]">(Congested)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. DIRECT NUMERIC VENUE DIMENSION INPUTS (WIDTH, LENGTH, HEIGHT) */}
            <div
              className={`p-3 rounded-xl border space-y-2.5 ${
                isDark
                  ? "bg-[#0c0e15] border-white/[0.08]"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-1.5 ${
                  isDark ? "border-white/[0.06]" : "border-slate-200"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase flex items-center gap-1 ${
                    isDark ? "text-[#f0c889]" : "text-[#b38238]"
                  }`}
                >
                  <DimensionCaliperVector size={13} />
                  Venue Dimensions (Meters):
                </span>
                <span
                  className={`text-[9px] ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  {floorAreaM2} m² ({floorAreaSqFt.toLocaleString("en-IN")} sq.ft)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label
                    className={`text-[9px] block mb-1 ${
                      isDark ? "text-neutral-400" : "text-slate-500"
                    }`}
                  >
                    Width (W):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="10"
                    max="150"
                    value={venue.hallWidth}
                    onChange={(e) =>
                      onUpdateVenue({
                        ...venue,
                        hallWidth: Math.max(10, parseFloat(e.target.value) || 20),
                      })
                    }
                    className={`w-full px-2 py-1 rounded-md border font-bold text-center focus:outline-none ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                        : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-[9px] block mb-1 ${
                      isDark ? "text-neutral-400" : "text-slate-500"
                    }`}
                  >
                    Length (L):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="10"
                    max="200"
                    value={venue.hallLength}
                    onChange={(e) =>
                      onUpdateVenue({
                        ...venue,
                        hallLength: Math.max(10, parseFloat(e.target.value) || 20),
                      })
                    }
                    className={`w-full px-2 py-1 rounded-md border font-bold text-center focus:outline-none ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                        : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`text-[9px] block mb-1 ${
                      isDark ? "text-neutral-400" : "text-slate-500"
                    }`}
                  >
                    Height (H):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="3.5"
                    max="25"
                    value={venue.hallHeight}
                    onChange={(e) =>
                      onUpdateVenue({
                        ...venue,
                        hallHeight: Math.max(3.5, parseFloat(e.target.value) || 6),
                      })
                    }
                    className={`w-full px-2 py-1 rounded-md border font-bold text-center focus:outline-none ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                        : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* 4. ARCHITECTURAL LANDMARKS (STAGE, ENTRANCE, HANDWASH COORDINATES) */}
            <div
              className={`p-3 rounded-xl border space-y-2.5 ${
                isDark
                  ? "bg-[#0c0e15] border-white/[0.08]"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-1.5 ${
                  isDark ? "border-white/[0.06]" : "border-slate-200"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase flex items-center gap-1 ${
                    isDark ? "text-[#f0c889]" : "text-[#b38238]"
                  }`}
                >
                  <CrosshairVector size={13} />
                  Landmark Positions (Meters):
                </span>
                <span
                  className={`text-[9px] ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Origin (0,0) Center
                </span>
              </div>

              {/* Stage Position */}
              <div className="grid grid-cols-3 gap-2 items-center">
                <span
                  className={`text-[10px] font-semibold ${
                    isDark ? "text-neutral-300" : "text-slate-700"
                  }`}
                >
                  Stage (Z):
                </span>
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-[9px] text-neutral-400">Z:</span>
                  <input
                    type="number"
                    step="0.5"
                    value={venue.stagePosition[2]}
                    onChange={(e) =>
                      onUpdateVenue({
                        ...venue,
                        stagePosition: [
                          venue.stagePosition[0],
                          venue.stagePosition[1],
                          parseFloat(e.target.value) || 0,
                        ],
                      })
                    }
                    className={`w-full px-2 py-1 rounded-md border font-bold text-center ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                  <span className="text-[9px] text-neutral-400">m</span>
                </div>
              </div>

              {/* Entrance Position */}
              <div className="grid grid-cols-3 gap-2 items-center">
                <span
                  className={`text-[10px] font-semibold ${
                    isDark ? "text-neutral-300" : "text-slate-700"
                  }`}
                >
                  Entrance (Z):
                </span>
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-[9px] text-neutral-400">Z:</span>
                  <input
                    type="number"
                    step="0.5"
                    value={venue.entrancePosition[2]}
                    onChange={(e) =>
                      onUpdateVenue({
                        ...venue,
                        entrancePosition: [
                          venue.entrancePosition[0],
                          venue.entrancePosition[1],
                          parseFloat(e.target.value) || 0,
                        ],
                      })
                    }
                    className={`w-full px-2 py-1 rounded-md border font-bold text-center ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                  <span className="text-[9px] text-neutral-400">m</span>
                </div>
              </div>

              {/* Handwash Position */}
              <div className="grid grid-cols-3 gap-2 items-center">
                <span
                  className={`text-[10px] font-semibold ${
                    isDark ? "text-neutral-300" : "text-slate-700"
                  }`}
                >
                  Handwash:
                </span>
                <div className="col-span-2 flex items-center gap-1.5">
                  <span className="text-[9px] text-neutral-400">X:</span>
                  <input
                    type="number"
                    step="0.5"
                    value={venue.handwashPosition?.[0] || -10}
                    onChange={(e) =>
                      onUpdateVenue({
                        ...venue,
                        handwashPosition: [
                          parseFloat(e.target.value) || 0,
                          0,
                          venue.handwashPosition?.[2] || 14,
                        ],
                      })
                    }
                    className={`w-16 px-1.5 py-1 rounded-md border font-bold text-center ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                  <span className="text-[9px] text-neutral-400">Z:</span>
                  <input
                    type="number"
                    step="0.5"
                    value={venue.handwashPosition?.[2] || 14}
                    onChange={(e) =>
                      onUpdateVenue({
                        ...venue,
                        handwashPosition: [
                          venue.handwashPosition?.[0] || -10,
                          0,
                          parseFloat(e.target.value) || 0,
                        ],
                      })
                    }
                    className={`w-16 px-1.5 py-1 rounded-md border font-bold text-center ${
                      isDark
                        ? "bg-[#161924] border-white/10 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* 5. VENUE SPATIAL FOOTPRINT TYPE */}
            <div className="space-y-1.5">
              <label
                className={`text-[10px] block uppercase font-semibold ${
                  isDark ? "text-neutral-400" : "text-slate-500"
                }`}
              >
                Venue Spatial Footprint Type:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "hall", label: "AC Kalyana Mandapam" },
                  { id: "open_lawn", label: "Open Banquet Lawn" },
                  { id: "outdoor_pandal", label: "Coconut Pandal" },
                  { id: "mega_ground", label: "Mega Ground (1 Lakh)" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onUpdateVenue({
                        ...venue,
                        terrainType: t.id as any,
                      });
                      playTactileClick(500);
                    }}
                    className={`p-2 rounded-lg border text-left transition-all text-[10px] ${
                      venue.terrainType === t.id
                        ? isDark
                          ? "bg-[#222736] border-[#f0c889] text-[#f0c889] font-bold"
                          : "bg-slate-100 border-[#b38238] text-[#b38238] font-bold"
                        : isDark
                        ? "bg-[#0b0d13] border-white/10 text-neutral-400 hover:text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. LIGHTING ATMOSPHERE */}
            <div className="space-y-1.5">
              <label
                className={`text-[10px] block uppercase font-semibold ${
                  isDark ? "text-neutral-400" : "text-slate-500"
                }`}
              >
                Lighting Atmosphere:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "morning", label: "Muhurtham (Day)" },
                  { id: "sunset", label: "Golden Hour" },
                  { id: "night", label: "Starlight Gala" },
                ].map((time) => (
                  <button
                    key={time.id}
                    onClick={() => {
                      onUpdateVenue({
                        ...venue,
                        timeOfDay: time.id as any,
                      });
                      playTactileClick(560);
                    }}
                    className={`p-2 rounded-lg border text-center transition-all text-[10px] font-semibold ${
                      venue.timeOfDay === time.id
                        ? isDark
                          ? "bg-[#f0c889] text-black font-bold border-[#f0c889]"
                          : "bg-[#b38238] text-white font-bold border-[#b38238]"
                        : isDark
                        ? "bg-[#0b0d13] border-white/10 text-neutral-400 hover:text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             C. ACTIVE STALLS MASTER ROSTER TAB (INSPECT & EDIT ALL COUNTERS)
             ========================================================================= */
          <div className="space-y-3">
            {/* Quick summary header */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark
                  ? "bg-[#0c0e15] border-white/[0.08]"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <span
                  className={`text-[10px] block uppercase ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Active Deployed Counters:
                </span>
                <span
                  className={`text-sm font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {stalls.length} Counters
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-[10px] block uppercase ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Total Power Load:
                </span>
                <span className="text-xs font-bold text-amber-400">
                  {totalPowerLoadKw.toFixed(1)} kW
                </span>
              </div>
            </div>

            {/* Search within stalls */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-2.5 text-neutral-400"
              />
              <input
                type="text"
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                placeholder="Filter active stalls by name or wing..."
                className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                  isDark
                    ? "bg-[#161924] border-white/10 text-white focus:border-[#f0c889]"
                    : "bg-white border-slate-300 text-slate-900 focus:border-[#b38238]"
                }`}
              />
            </div>

            {/* List of stalls */}
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredStalls.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectStall && onSelectStall(s.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                    isDark
                      ? "bg-[#141722] border-white/[0.08] hover:border-[#f0c889]/50"
                      : "bg-white border-slate-200 hover:border-[#b38238] shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: s.accentColor }}
                      />
                      <span
                        className={`font-bold text-xs ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {s.name}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded border uppercase ${
                        isDark
                          ? "bg-[#1f2433] text-[#f0c889] border-white/10"
                          : "bg-slate-100 text-[#b38238] border-slate-300"
                      }`}
                    >
                      {s.wing || "North"}
                    </span>
                  </div>

                  <div
                    className={`flex items-center justify-between mt-2 pt-1.5 border-t text-[10px] ${
                      isDark
                        ? "border-white/[0.06] text-neutral-400"
                        : "border-slate-100 text-slate-500"
                    }`}
                  >
                    <span>
                      Pos: ({s.position[0].toFixed(1)}, {s.position[2].toFixed(1)})m
                    </span>
                    <span>
                      {s.width}×{s.depth}m
                    </span>
                    <span className="font-semibold text-emerald-400">
                      {s.capacityPerHour}/hr
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add catalog stall shortcut */}
            {onAddStall && (
              <div className="pt-2">
                <span
                  className={`text-[10px] block uppercase font-semibold mb-1.5 ${
                    isDark ? "text-neutral-400" : "text-slate-500"
                  }`}
                >
                  Deploy Quick Add:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    size="sm"
                    onClick={() => onAddStall("dosa")}
                    className={`h-7 text-[10px] border flex items-center gap-1 ${
                      isDark
                        ? "bg-[#1f2433] text-white border-white/10 hover:border-[#f0c889]"
                        : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <Plus size={11} />
                    <span>+ Dosa Station</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onAddStall("buffet_spread")}
                    className={`h-7 text-[10px] border flex items-center gap-1 ${
                      isDark
                        ? "bg-[#1f2433] text-white border-white/10 hover:border-[#f0c889]"
                        : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <Plus size={11} />
                    <span>+ Royal Buffet</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
