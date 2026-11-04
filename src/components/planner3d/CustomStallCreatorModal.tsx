import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StallItem } from "@/types/planner3d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Sparkles, Image as ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";

interface CustomStallCreatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveCustomStall: (stall: StallItem) => void;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    name: "Madurai Famous Jigarthanda Cart",
    name_ta: "மதுரை புகழ்பெற்ற ஜிகர்தண்டா",
    category: "Signature Coolers",
    photoUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
    color: "#be185d",
    accentColor: "#f472b6",
    dishes: ["Special Basundi Jigarthanda", "Nungu Rose Milk"],
    capacity: 160,
    cost: 16000,
  },
  {
    name: "Kongu Live Bamboo Biryani Station",
    name_ta: "கொங்கு மூங்கில் பிரியாணி அரங்கம்",
    category: "Heritage Main",
    photoUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    color: "#854d0e",
    accentColor: "#eab308",
    dishes: ["Kovai Seeraga Samba Biryani", "Clay Pot Raitha"],
    capacity: 220,
    cost: 28000,
  },
  {
    name: "Live Tender Coconut & Nungu Bar",
    name_ta: "நேரடி இளநீர் & நொங்கு பார்",
    category: "Welcome Drinks",
    photoUrl: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80",
    color: "#15803d",
    accentColor: "#86efac",
    dishes: ["Pollachi Fresh Tender Coconut", "Elaneer Payasam Shots"],
    capacity: 250,
    cost: 14000,
  },
];

export const CustomStallCreatorModal: React.FC<CustomStallCreatorModalProps> = ({
  open,
  onOpenChange,
  onSaveCustomStall,
}) => {
  const [stallName, setStallName] = useState("Custom Live Gourmet Stall");
  const [stallNameTa, setStallNameTa] = useState("தனிப்பயன் நேரடி அரங்கம்");
  const [category, setCategory] = useState("Live Specialty");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [width, setWidth] = useState(2.8);
  const [depth, setDepth] = useState(1.5);
  const [height, setHeight] = useState(2.2);
  const [baseColor, setBaseColor] = useState("#8b5cf6");
  const [accentColor, setAccentColor] = useState("#a855f7");
  const [capacityPerHour, setCapacityPerHour] = useState(120);
  const [unitCost, setUnitCost] = useState(18000);
  const [dishesText, setDishesText] = useState("Chef Specialty Live Dish, House Chutney Assortment");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
          toast.success("Stall photo loaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (preset: typeof SAMPLE_PHOTO_PRESETS[0]) => {
    setStallName(preset.name);
    setStallNameTa(preset.name_ta);
    setCategory(preset.category);
    setPhotoUrl(preset.photoUrl);
    setBaseColor(preset.color);
    setAccentColor(preset.accentColor);
    setCapacityPerHour(preset.capacity);
    setUnitCost(preset.cost);
    setDishesText(preset.dishes.join(", "));
  };

  const handleCreateStall = () => {
    if (!stallName.trim()) {
      toast.error("Please enter a stall name");
      return;
    }

    const newStall: StallItem = {
      id: `custom-${Date.now().toString().slice(-4)}`,
      type: "custom_stall",
      name: stallName.trim(),
      name_ta: stallNameTa.trim() || stallName.trim(),
      category: category.trim(),
      position: [0, 0, 0], // Center placed
      rotation: 0,
      width,
      depth,
      height,
      color: baseColor,
      accentColor,
      capacityPerHour,
      unitCost,
      powerRequiredKw: 4.5,
      waterRequired: true,
      dishes: dishesText.split(",").map((s) => s.trim()).filter(Boolean),
      dishes_ta: [],
      tag: "Custom Photo-Generated Stall",
      customPhotoUrl: photoUrl || undefined,
    };

    onSaveCustomStall(newStall);
    onOpenChange(false);
    toast.success("3D Stall Generated On The Spot!", {
      description: `Added "${stallName}" with custom photo billboard to the 3D scene.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0c0d16] border border-line text-ink p-6 rounded-2xl shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-ink">
            <Sparkles className="h-5 w-5 text-[#8b5cf6]" />
            On-The-Spot 3D Stall Generator
          </DialogTitle>
          <DialogDescription className="text-mute text-xs">
            Upload a photo of any catering stall or live food counter. We instantly build and render
            its photorealistic 3D stall model in the layout.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-3">
          {/* 1. Quick Presets */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-mute uppercase tracking-wider">
              Quick Photo Presets
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_PHOTO_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    photoUrl === preset.photoUrl
                      ? "bg-[#8b5cf6]/20 border-[#8b5cf6] text-white shadow-md shadow-[#8b5cf6]/20"
                      : "bg-surf-2 border-line text-mute hover:text-ink hover:border-line/80"
                  }`}
                >
                  <img
                    src={preset.photoUrl}
                    alt={preset.name}
                    className="w-10 h-10 rounded-lg object-cover border border-line shrink-0"
                  />
                  <div className="truncate text-xs">
                    <span className="font-bold text-ink block truncate">{preset.name}</span>
                    <span className="text-[10px] text-mute block">{preset.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Photo Upload or URL */}
          <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-line">
            <Label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Upload className="h-4 w-4 text-[#8b5cf6]" />
              Upload Stall Photo (Billboarding Texture)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <Label
                htmlFor="stall-photo-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-line hover:border-[#8b5cf6] rounded-xl p-4 cursor-pointer transition-colors text-center"
              >
                {photoUrl ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <img
                      src={photoUrl}
                      alt="Uploaded Stall"
                      className="h-16 w-28 object-cover rounded-lg border border-[#8b5cf6]"
                    />
                    <span className="text-[11px] text-[#8b5cf6] font-semibold">Change Photo</span>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 text-mute mb-1" />
                    <span className="text-xs font-semibold text-ink">Upload Stall Picture</span>
                    <span className="text-[10px] text-mute">From your mobile or camera roll</span>
                  </>
                )}
                <input
                  id="stall-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </Label>

              <div className="space-y-2">
                <span className="text-xs text-mute block">Or paste stall image URL:</span>
                <Input
                  placeholder="https://.../stall-facade.jpg"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="text-xs bg-surf border-line"
                />
              </div>
            </div>
          </div>

          {/* 3. Stall Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-mute">Stall Name (English)</Label>
              <Input
                value={stallName}
                onChange={(e) => setStallName(e.target.value)}
                className="bg-surf border-line text-xs font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-mute">Stall Name (Tamil)</Label>
              <Input
                value={stallNameTa}
                onChange={(e) => setStallNameTa(e.target.value)}
                className="bg-surf border-line text-xs font-tamil font-medium text-[#d8b36d]"
              />
            </div>
          </div>

          {/* Dimensions & Budget */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-mute">Width (meters)</Label>
              <Input
                type="number"
                step="0.1"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="bg-surf border-line text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-mute">Depth (meters)</Label>
              <Input
                type="number"
                step="0.1"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="bg-surf border-line text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-mute">Height (meters)</Label>
              <Input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="bg-surf border-line text-xs font-mono"
              />
            </div>
          </div>

          {/* Color & Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-mute">Color Theme</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-8 h-8 rounded border border-line bg-transparent cursor-pointer"
                />
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded border border-line bg-transparent cursor-pointer"
                />
                <span className="text-[11px] text-mute font-mono">{baseColor} / {accentColor}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-mute">Estimated Setup Cost (₹ INR)</Label>
              <Input
                type="number"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="bg-surf border-line text-xs font-mono"
              />
            </div>
          </div>

          {/* Dishes */}
          <div className="space-y-1.5">
            <Label className="text-xs text-mute">Dishes / Menu Items (comma-separated)</Label>
            <Input
              value={dishesText}
              onChange={(e) => setDishesText(e.target.value)}
              className="bg-surf border-line text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-line">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9 border-line text-mute hover:text-ink"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateStall}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#e2c99a] hover:opacity-90 text-black font-bold text-xs h-9 px-5 rounded-xl shadow-lg flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            Generate 3D Stall
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
