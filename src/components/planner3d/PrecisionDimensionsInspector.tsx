import React from "react";
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
} from "lucide-react";
import { StallItem, MandapamVenue } from "@/types/planner3d";
import { Button } from "@/components/ui/button";
import { DimensionCaliperVector, CrosshairVector, DatumVector } from "@/components/ui/VectorIcons";

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
}) => {
  return (
    <div className="flex flex-col h-full bg-[#111318]/95 backdrop-blur-2xl text-[#f4efe6] font-mono text-xs select-none">
      
      {/* Header */}
      <div className="p-3 border-b border-white/[0.08] bg-[#161820] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DimensionCaliperVector size={16} className="text-[#e2c99a]" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            {selectedStall ? "STALL PRECISION CAD INSPECTOR" : "VENUE ARCHITECTURAL SPECS"}
          </span>
        </div>

        {selectedStall && (
          <button
            onClick={onDeselectStall}
            className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
          >
            Deselect
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 scrollbar-thin">
        {selectedStall ? (
          /* =========================================================================
             A. STALL TEXT & NUMERIC DIMENSION EDITOR
             ========================================================================= */
          <div className="space-y-4">
            {/* Stall Identification */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 block uppercase">
                Stall Name / Tag:
              </label>
              <input
                type="text"
                value={selectedStall.name}
                onChange={(e) => onUpdateStall({ ...selectedStall, name: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c0e14] border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#e2c99a]"
              />
            </div>

            {/* Wing / Concourse Assignment */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Wing Location:
                </label>
                <select
                  value={selectedStall.wing || "North"}
                  onChange={(e) =>
                    onUpdateStall({ ...selectedStall, wing: e.target.value as any })
                  }
                  className="w-full px-2 py-1.5 rounded-lg bg-[#0c0e14] border border-white/10 text-white text-xs focus:outline-none focus:border-[#e2c99a]"
                >
                  <option value="North">North Wing</option>
                  <option value="South">South Wing</option>
                  <option value="East">East Flank</option>
                  <option value="West">West Flank</option>
                  <option value="Central">Central Aisle</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Category:
                </label>
                <input
                  type="text"
                  value={selectedStall.category}
                  disabled
                  className="w-full px-2 py-1.5 rounded-lg bg-[#0c0e14]/60 border border-white/5 text-neutral-400 text-xs"
                />
              </div>
            </div>

            {/* DIRECT NUMERIC SIZE INPUTS (Width, Depth, Height) */}
            <div className="p-3 rounded-xl bg-[#0c0e14] border border-white/[0.08] space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-[10px] font-bold text-[#e2c99a] uppercase flex items-center gap-1">
                  <DimensionCaliperVector size={13} />
                  Counter Size in Meters:
                </span>
                <span className="text-[9px] text-neutral-400">
                  Area: {(selectedStall.width * selectedStall.depth).toFixed(2)} m²
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] text-neutral-400 block mb-1">
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
                    className="w-full px-2 py-1 rounded-md bg-[#161822] border border-white/10 text-white font-bold text-center focus:outline-none focus:border-[#e2c99a]"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-neutral-400 block mb-1">
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
                    className="w-full px-2 py-1 rounded-md bg-[#161822] border border-white/10 text-white font-bold text-center focus:outline-none focus:border-[#e2c99a]"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-neutral-400 block mb-1">
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
                    className="w-full px-2 py-1 rounded-md bg-[#161822] border border-white/10 text-white font-bold text-center focus:outline-none focus:border-[#e2c99a]"
                  />
                </div>
              </div>
            </div>

            {/* DIRECT NUMERIC POSITION & ROTATION INPUTS */}
            <div className="p-3 rounded-xl bg-[#0c0e14] border border-white/[0.08] space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-[10px] font-bold text-[#e2c99a] uppercase flex items-center gap-1">
                  <CrosshairVector size={13} />
                  3D Ground Coordinates &amp; Angle:
                </span>
                <span className="text-[9px] text-neutral-400">
                  Snap: 0.5m
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] text-neutral-400 block mb-1">
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
                    className="w-full px-2 py-1 rounded-md bg-[#161822] border border-white/10 text-white font-bold text-center focus:outline-none focus:border-[#e2c99a]"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-neutral-400 block mb-1">
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
                    className="w-full px-2 py-1 rounded-md bg-[#161822] border border-white/10 text-white font-bold text-center focus:outline-none focus:border-[#e2c99a]"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-neutral-400 block mb-1">
                    Rotation (°):
                  </label>
                  <input
                    type="number"
                    step="15"
                    value={Math.round((selectedStall.rotation * 180) / Math.PI)}
                    onChange={(e) =>
                      onUpdateStall({
                        ...selectedStall,
                        rotation: ((parseFloat(e.target.value) || 0) * Math.PI) / 180,
                      })
                    }
                    className="w-full px-2 py-1 rounded-md bg-[#161822] border border-white/10 text-white font-bold text-center focus:outline-none focus:border-[#e2c99a]"
                  />
                </div>
              </div>

              {/* Quick Rotation Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[0, 90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    onClick={() =>
                      onUpdateStall({
                        ...selectedStall,
                        rotation: (deg * Math.PI) / 180,
                      })
                    }
                    className={`py-1 rounded text-[10px] border transition-all ${
                      Math.round((selectedStall.rotation * 180) / Math.PI) % 360 === deg
                        ? "bg-[#e2c99a] text-black font-bold border-[#e2c99a]"
                        : "bg-[#161822] border-white/10 text-neutral-300 hover:text-white"
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity & Electrical Specs */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#0c0e14] border border-white/[0.08]">
                <label className="text-[9px] text-neutral-400 block mb-1">
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
                  className="w-full px-2 py-1 rounded-md bg-[#161822] border border-white/10 text-white font-bold text-center"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#0c0e14] border border-white/[0.08]">
                <label className="text-[9px] text-neutral-400 block mb-1">
                  Power Required (kW):
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
                  className="w-full px-2 py-1 rounded-md bg-[#161822] border border-white/10 text-white font-bold text-center"
                />
              </div>
            </div>

            {/* Quick Actions (Duplicate / Snap / Delete) */}
            <div className="space-y-1.5 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  onClick={() => onDuplicateStall(selectedStall.id)}
                  className="w-full h-8 text-[11px] bg-[#222530] text-[#e2c99a] border border-white/10 hover:border-[#e2c99a] flex items-center justify-center gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Duplicate</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => onDeleteStall(selectedStall.id)}
                  className="w-full h-8 text-[11px] bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </Button>
              </div>

              <button
                onClick={() =>
                  onUpdateStall({
                    ...selectedStall,
                    position: [
                      Math.round(selectedStall.position[0] * 2) / 2,
                      selectedStall.position[1],
                      Math.round(selectedStall.position[2] * 2) / 2,
                    ],
                  })
                }
                className="w-full py-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white text-[10px] flex items-center justify-center gap-1"
              >
                <Grid className="h-3 w-3 text-[#e2c99a]" />
                Snap Position to Exact 0.5m CAD Grid
              </button>
            </div>
          </div>
        ) : (
          /* =========================================================================
             B. VENUE ARCHITECTURAL DIMENSIONS & EDITORS (WHEN NO STALL SELECTED)
             ========================================================================= */
          <div className="space-y-4">
            {/* Active Venue Name & Search Trigger */}
            <div className="p-3 rounded-xl bg-[#0c0e14] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 uppercase">
                  Active Venue Architectural Model:
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#222530] text-[#e2c99a] border border-white/10">
                  {venue.terrainType.toUpperCase()}
                </span>
              </div>
              <h4 className="font-bold text-white text-xs">{venue.name}</h4>
              <p className="text-[10px] text-neutral-400">{venue.location}</p>

              <Button
                size="sm"
                onClick={onOpenGoogleMapsSearch}
                className="w-full h-8 text-[11px] bg-[#e2c99a] text-black font-bold hover:bg-[#c5a059] flex items-center justify-center gap-1.5 mt-2"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Search Google Maps Mahal Photos</span>
              </Button>
            </div>

            {/* DIRECT NUMERIC VENUE DIMENSION INPUTS (WIDTH, LENGTH, HEIGHT) */}
            <div className="p-3 rounded-xl bg-[#0c0e14] border border-white/[0.08] space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
                <span className="text-[10px] font-bold text-[#e2c99a] uppercase flex items-center gap-1">
                  <DimensionCaliperVector size={13} />
                  Venue Dimensions (Meters):
                </span>
                <span className="text-[9px] text-neutral-400">
                  Area: {Math.round(venue.hallWidth * venue.hallLength)} m²
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] text-neutral-400 block mb-1">
                    Width (m):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="15"
                    max="150"
                    value={venue.hallWidth}
                    onChange={(e) =>
                      onUpdateVenue({
                        ...venue,
                        hallWidth: Math.max(15, parseFloat(e.target.value) || 20),
                      })
                    }
                    className="w-full px-2 py-1 rounded-md bg-[#161822] border border-white/10 text-white font-bold text-center focus:outline-none focus:border-[#e2c99a]"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-neutral-400 block mb-1">
                    Length (m):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="15"
                    max="150"
                    value={venue.hallLength}
                    onChange={(e) =>
                      onUpdateVenue({
                        ...venue,
                        hallLength: Math.max(15, parseFloat(e.target.value) || 20),
                      })
                    }
                    className="w-full px-2 py-1 rounded-md bg-[#161822] border border-white/10 text-white font-bold text-center focus:outline-none focus:border-[#e2c99a]"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-neutral-400 block mb-1">
                    Height (m):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="4"
                    max="25"
                    value={venue.hallHeight}
                    onChange={(e) =>
                      onUpdateVenue({
                        ...venue,
                        hallHeight: Math.max(4, parseFloat(e.target.value) || 6),
                      })
                    }
                    className="w-full px-2 py-1 rounded-md bg-[#161822] border border-white/10 text-white font-bold text-center focus:outline-none focus:border-[#e2c99a]"
                  />
                </div>
              </div>
            </div>

            {/* Target Headcount Editor */}
            <div className="p-3 rounded-xl bg-[#0c0e14] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 uppercase flex items-center gap-1">
                  <Users className="h-3 w-3 text-[#e2c99a]" />
                  Planned Guest Headcount:
                </span>
                <span className="text-xs font-bold text-[#e2c99a]">
                  {headCount.toLocaleString("en-IN")} Pax
                </span>
              </div>

              <input
                type="number"
                step="100"
                min="50"
                max="100000"
                value={headCount}
                onChange={(e) => onUpdateHeadCount(parseInt(e.target.value, 10) || 500)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#161822] border border-white/10 text-white font-bold text-center"
              />

              <div className="grid grid-cols-5 gap-1 pt-1">
                {[500, 1500, 3500, 10000, 100000].map((num) => (
                  <button
                    key={num}
                    onClick={() => onUpdateHeadCount(num)}
                    className={`py-1 rounded text-[9px] border transition-all ${
                      headCount === num
                        ? "bg-[#e2c99a] text-black font-bold border-[#e2c99a]"
                        : "bg-[#161822] border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {num >= 100000 ? "1 Lakh" : num >= 1000 ? `${num / 1000}K` : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Terrain Type Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 block uppercase">
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
                    onClick={() => onUpdateVenue({ ...venue, terrainType: t.id as any })}
                    className={`p-2 rounded-lg border text-left transition-all text-[10px] ${
                      venue.terrainType === t.id
                        ? "bg-[#222530] border-[#e2c99a] text-[#e2c99a] font-bold"
                        : "bg-[#0c0e14] border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time of Day & Lighting */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 block uppercase">
                Lighting Atmosphere:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "morning", label: "Muhurtham" },
                  { id: "sunset", label: "Sunset Gold" },
                  { id: "night", label: "Starlight Gala" },
                ].map((time) => (
                  <button
                    key={time.id}
                    onClick={() => onUpdateVenue({ ...venue, timeOfDay: time.id as any })}
                    className={`p-1.5 rounded-lg border text-center transition-all text-[10px] ${
                      venue.timeOfDay === time.id
                        ? "bg-[#e2c99a] text-black font-bold border-[#e2c99a]"
                        : "bg-[#0c0e14] border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
