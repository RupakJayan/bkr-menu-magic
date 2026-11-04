import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MandapamVenue } from "@/types/planner3d";
import { PRESET_VENUES } from "@/services/planner3dService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MapPin, Upload, Eye, Check } from "lucide-react";

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

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      onCustomBlueprintUpload(customUrl.trim());
      setCustomUrl("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0c0d16] border border-line text-ink p-6 rounded-2xl shadow-2xl backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-ink">
            <MapPin className="h-5 w-5 text-[#00f5d4]" />
            Select Mandapam Venue & Blueprint Projection
          </DialogTitle>
          <DialogDescription className="text-mute text-xs">
            Choose a wedding mandapam hall or project your own Google Maps aerial layout / CAD floor
            plan directly onto the 3D visualizer floor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-3">
          {/* 1. Preset Mandapam Halls */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-mute">
              Popular Mandapams & Convention Halls
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESET_VENUES.map((venue) => {
                const isSelected = venue.id === selectedVenue.id;
                return (
                  <button
                    key={venue.id}
                    onClick={() => onSelectVenue(venue)}
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
                        Cap: {venue.defaultCapacity}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Blueprint Projection Controls */}
          <div className="p-4 rounded-xl bg-white/5 border border-line space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-[#00f5d4]" />
                Blueprint / Google Maps Overlay Opacity
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

          {/* 3. Upload Custom Google Maps Image or Floor Plan */}
          <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-line">
            <Label className="text-xs font-semibold uppercase tracking-wider text-mute flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5 text-[#d8b36d]" />
              Project Custom Google Maps / Architectural Drawing
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <Label
                  htmlFor="blueprint-file"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-line hover:border-[#00f5d4] rounded-xl p-3 cursor-pointer transition-colors text-center"
                >
                  <Upload className="h-5 w-5 text-mute mb-1" />
                  <span className="text-xs font-medium text-ink">Upload Image / Blueprint</span>
                  <span className="text-[10px] text-mute">PNG, JPG, or Google Maps screenshot</span>
                  <input
                    id="blueprint-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </Label>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-mute block">Or paste image URL:</span>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://.../mandapam-layout.jpg"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="h-8 text-xs bg-surf border-line"
                  />
                  <Button
                    size="sm"
                    onClick={handleApplyUrl}
                    className="h-8 text-xs bg-[#00f5d4] text-black font-semibold hover:bg-[#00d2b6]"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
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
