import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MandapamVenue,
  VenueTerrainType,
  TimeOfDay,
  WeatherAtmosphere,
} from "@/types/planner3d";
import { PRESET_VENUES } from "@/services/planner3dService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  MapPin,
  Upload,
  Eye,
  Check,
  Sun,
  Moon,
  Sunset,
  Sparkles,
  Maximize2,
  Compass,
  Image as ImageIcon,
} from "lucide-react";

interface MandapamSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVenue: MandapamVenue;
  onSelectVenue: (venue: MandapamVenue) => void;
  blueprintOpacity: number;
  onBlueprintOpacityChange: (opacity: number) => void;
  onCustomBlueprintUpload: (url: string) => void;
}

export const MandapamSelectorModal: React.FC<MandapamSelectorModalProps> = ({
  open,
  onOpenChange,
  selectedVenue,
  onSelectVenue,
  blueprintOpacity,
  onBlueprintOpacityChange,
  onCustomBlueprintUpload,
}) => {
  const [customUrl, setCustomUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"venues" | "dimensions" | "lighting" | "skybox">("venues");

  // Custom land dimension state
  const [customLength, setCustomLength] = useState(selectedVenue.hallLength);
  const [customWidth, setCustomWidth] = useState(selectedVenue.hallWidth);
  const [customHeight, setCustomHeight] = useState(selectedVenue.hallHeight);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCustomBlueprintUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkyboxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelectVenue({
            ...selectedVenue,
            panoramicSkyboxUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyDimensions = () => {
    const halfL = Math.round(customLength / 2);
    onSelectVenue({
      ...selectedVenue,
      hallLength: customLength,
      hallWidth: customWidth,
      hallHeight: customHeight,
      stagePosition: [0, 0, -(halfL - 4)],
      entrancePosition: [0, 0, halfL - 2],
    });
  };

  const handleSetAcreage = (acres: number) => {
    // 1 Acre ~ 43,560 sq ft ~ 4,046 sq meters ~ 64m x 64m
    const dimension = Math.round(Math.sqrt(acres * 4046));
    setCustomLength(dimension);
    setCustomWidth(dimension);
    setCustomHeight(12);
    onSelectVenue({
      ...selectedVenue,
      terrainType: acres >= 2.0 ? "mega_ground" : "open_lawn",
      acreage: acres,
      hallLength: dimension,
      hallWidth: dimension,
      hallHeight: 12,
      stagePosition: [0, 0, -Math.round(dimension / 2 - 6)],
      entrancePosition: [0, 0, Math.round(dimension / 2 - 4)],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-[#0c0d16] border border-line text-ink p-6 rounded-2xl shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-ink">
            <MapPin className="h-5 w-5 text-[#00f5d4]" />
            Venue, Terrain, 1-Acre Land & Environment Simulator
          </DialogTitle>
          <DialogDescription className="text-mute text-xs">
            Configure AC convention halls, open-air lawns, multi-acre mega grounds, time-of-day lighting,
            and panoramic 360° skyboxes.
          </DialogDescription>
        </DialogHeader>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-line pb-2">
          {[
            { id: "venues", label: "Preset Venues", icon: MapPin },
            { id: "dimensions", label: "Open Land & Dimensions", icon: Maximize2 },
            { id: "lighting", label: "Time & Weather", icon: Sun },
            { id: "skybox", label: "360° Panoramic Skybox", icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-[#00f5d4] text-black shadow-sm"
                    : "text-mute hover:text-ink bg-white/5"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-5 pt-2">
          {/* TAB 1: PRESET VENUES */}
          {activeTab === "venues" && (
            <div className="space-y-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-mute">
                Select Mandapam Hall or Open Grounds
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESET_VENUES.map((venue) => {
                  const isSelected = venue.id === selectedVenue.id;
                  return (
                    <button
                      key={venue.id}
                      onClick={() => {
                        onSelectVenue(venue);
                        setCustomLength(venue.hallLength);
                        setCustomWidth(venue.hallWidth);
                        setCustomHeight(venue.hallHeight);
                      }}
                      className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#00f5d4]/10 border-[#00f5d4] shadow-md shadow-[#00f5d4]/10"
                          : "bg-surf-2 border-line hover:border-line/80"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="font-bold text-sm text-ink">{venue.name}</span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#00f5d4] text-black flex items-center justify-center shrink-0">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-[#d8b36d] font-tamil font-medium mt-0.5">
                          {venue.name_ta}
                        </p>
                        <p className="text-[10px] text-mute mt-1.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {venue.location}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-line/60 flex items-center justify-between text-[11px] text-mute font-mono">
                        <span>
                          {venue.hallWidth}m × {venue.hallLength}m
                        </span>
                        <span className="text-[#00f5d4] font-semibold">
                          Cap: {venue.defaultCapacity.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Blueprint Projection Controls */}
              <div className="p-4 rounded-xl bg-white/5 border border-line space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-[#00f5d4]" />
                    Google Maps / CAD Blueprint Floor Projection Opacity
                  </Label>
                  <span className="text-xs font-mono font-bold text-[#00f5d4]">
                    {Math.round(blueprintOpacity * 100)}%
                  </span>
                </div>
                <Slider
                  value={[blueprintOpacity * 100]}
                  onValueChange={([val]) => onBlueprintOpacityChange(val / 100)}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>

              {/* Upload Blueprint File */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-line flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-semibold text-ink block">Project Custom Google Maps Layout</span>
                  <span className="text-mute text-[11px]">Upload aerial Google Maps capture or CAD drawing</span>
                </div>
                <Label
                  htmlFor="blueprint-file-tab1"
                  className="px-3 py-1.5 rounded-lg bg-[#00f5d4]/10 border border-[#00f5d4]/40 text-[#00f5d4] hover:bg-[#00f5d4]/20 cursor-pointer text-xs font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Map
                  <input
                    id="blueprint-file-tab1"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </Label>
              </div>
            </div>
          )}

          {/* TAB 2: OPEN LAND & CUSTOM DIMENSIONS */}
          {activeTab === "dimensions" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                💡 <strong>Open Land Simulation:</strong> Not restricted to hall walls! You can simulate
                1-Acre, 2.5-Acre open banquets or specify custom Length × Width × Height in meters.
              </div>

              {/* Quick Acre Presets */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-ink">Acreage Presets</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { acres: 0.5, label: "0.5 Acre (45m × 45m)" },
                    { acres: 1.0, label: "1.0 Acre (64m × 64m)" },
                    { acres: 2.5, label: "2.5 Acres (100m × 100m)" },
                    { acres: 5.0, label: "5.0 Acres (142m × 142m)" },
                  ].map((preset) => (
                    <button
                      key={preset.acres}
                      onClick={() => handleSetAcreage(preset.acres)}
                      className={`p-2 rounded-lg border text-xs font-semibold transition-all ${
                        selectedVenue.acreage === preset.acres
                          ? "bg-emerald-500 text-black border-emerald-400 font-bold"
                          : "bg-surf-2 border-line text-mute hover:text-ink"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Dimensions Form */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-mute">Length (Z-axis in meters)</Label>
                  <Input
                    type="number"
                    value={customLength}
                    onChange={(e) => setCustomLength(Number(e.target.value))}
                    className="bg-surf border-line text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-mute">Width (X-axis in meters)</Label>
                  <Input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    className="bg-surf border-line text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-mute">Ceiling / Pandal Height (m)</Label>
                  <Input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    className="bg-surf border-line text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleApplyDimensions}
                  className="bg-[#00f5d4] hover:bg-[#00d2b6] text-black font-bold text-xs h-9 px-4 rounded-xl"
                >
                  Apply Ground Dimensions
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: TIME OF DAY & WEATHER LIGHTING */}
          {activeTab === "lighting" && (
            <div className="space-y-4">
              <Label className="text-xs font-semibold text-ink uppercase tracking-wider">
                Time of Day Lighting Atmosphere
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "morning", label: "Morning Muhurtham", sub: "8:00 AM Radiant Sun", icon: Sun, color: "#fef08a" },
                  { id: "afternoon", label: "Afternoon Feast", sub: "12:30 PM High Noon", icon: Sun, color: "#ffffff" },
                  { id: "sunset", label: "Sunset Golden Hour", sub: "5:30 PM Warm Glow", icon: Sunset, color: "#f97316" },
                  { id: "night", label: "Night Starlight", sub: "8:00 PM Serial Lights", icon: Moon, color: "#60a5fa" },
                ].map((tod) => {
                  const Icon = tod.icon;
                  const isSelected = selectedVenue.timeOfDay === tod.id;
                  return (
                    <button
                      key={tod.id}
                      onClick={() =>
                        onSelectVenue({
                          ...selectedVenue,
                          timeOfDay: tod.id as TimeOfDay,
                          weather: tod.id === "night" ? "festive_serial_lights" : "clear",
                        })
                      }
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-[#00f5d4]/15 border-[#00f5d4] shadow-md shadow-[#00f5d4]/10"
                          : "bg-surf-2 border-line text-mute hover:text-ink"
                      }`}
                    >
                      <Icon className="h-5 w-5 mb-1" style={{ color: tod.color }} />
                      <span className="font-bold text-xs text-ink block">{tod.label}</span>
                      <span className="text-[10px] text-mute block">{tod.sub}</span>
                    </button>
                  );
                })}
              </div>

              {/* Weather & Festivity */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs font-semibold text-ink">Festival Serial Lights Overhead</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      onSelectVenue({
                        ...selectedVenue,
                        weather: "festive_serial_lights",
                      })
                    }
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                      selectedVenue.weather === "festive_serial_lights"
                        ? "bg-[#d8b36d]/20 border-[#d8b36d] text-[#d8b36d]"
                        : "bg-surf-2 border-line text-mute hover:text-ink"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    Festive Serial Fairy Light Garlands (ON)
                  </button>
                  <button
                    onClick={() =>
                      onSelectVenue({
                        ...selectedVenue,
                        weather: "clear",
                      })
                    }
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                      selectedVenue.weather === "clear"
                        ? "bg-[#00f5d4]/20 border-[#00f5d4] text-[#00f5d4]"
                        : "bg-surf-2 border-line text-mute hover:text-ink"
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    Standard Ambient Lighting
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 360° PANORAMIC SKYBOX */}
          {activeTab === "skybox" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300">
                📸 <strong>Custom 360° Skybox:</strong> Upload a panoramic photo or angle photos of the
                hall/ground. The visualizer maps it into a full spherical background so clients see the
                exact real-world surroundings.
              </div>

              {/* Upload file */}
              <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-line">
                <Label className="text-xs font-semibold text-ink">Upload 360° Panoramic Hall / Ground Image</Label>
                <Label
                  htmlFor="skybox-file-input"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-line hover:border-[#00f5d4] rounded-xl p-6 cursor-pointer transition-colors text-center"
                >
                  <ImageIcon className="h-8 w-8 text-[#00f5d4] mb-2" />
                  <span className="text-xs font-bold text-ink">Upload Panoramic Photo (360° / Equirectangular)</span>
                  <span className="text-[11px] text-mute mt-0.5">JPG or PNG (e.g. captured with mobile panoramic mode)</span>
                  <input
                    id="skybox-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleSkyboxUpload}
                    className="hidden"
                  />
                </Label>
              </div>

              {/* Preset Panoramic Backgrounds */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-mute">Preset Environment Skies</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Royal Chettinad Courtyard",
                      url: "https://images.unsplash.com/photo-1545232979-fbf6c615ad8e?auto=format&fit=crop&w=1600&q=80",
                    },
                    {
                      label: "1-Acre Open Lawn Twilight",
                      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80",
                    },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() =>
                        onSelectVenue({
                          ...selectedVenue,
                          panoramicSkyboxUrl: preset.url,
                        })
                      }
                      className="p-2.5 rounded-xl border border-line bg-surf-2 hover:border-[#00f5d4] text-xs font-semibold text-ink text-left"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-line">
          <span className="text-xs text-mute font-mono">
            {selectedVenue.hallWidth}m × {selectedVenue.hallLength}m (
            {selectedVenue.acreage ? `${selectedVenue.acreage} Acres` : `${selectedVenue.hallWidth * selectedVenue.hallLength} m²`})
          </span>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[#00f5d4] hover:bg-[#00d2b6] text-black font-bold text-xs h-9 px-5 rounded-xl shadow-lg"
          >
            Done Planning
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
