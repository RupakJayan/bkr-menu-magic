import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StallItem, Custom3DModelSpec, StallGeometryShape } from "@/types/planner3d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Layers,
  RotateCw,
  Landmark,
  CircleDot,
  Compass,
  Check,
  Zap,
} from "lucide-react";
import { CrosshairVector, SpatialGridVector } from "@/components/ui/VectorIcons";
import { toast } from "sonner";
import {
  analyzePhotoTo3DModel,
  getSavedCustom3DModels,
  BUILTIN_CUSTOM_3D_MODELS,
} from "@/services/aiVisionLens3DService";

interface CustomStallCreatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveCustomStall: (stall: StallItem) => void;
}

export const CustomStallCreatorModal: React.FC<CustomStallCreatorModalProps> = ({
  open,
  onOpenChange,
  onSaveCustomStall,
}) => {
  const [stallName, setStallName] = useState("Grand Swarna Mandapam & Gold-Silver Shrine");
  const [stallNameTa, setStallNameTa] = useState("ஸ்ரீ சுவர்ண மண்டப திருக்கோவில் அரங்கம்");
  const [category, setCategory] = useState("Sanctum & Heritage Display");
  const [photoUrl, setPhotoUrl] = useState<string>(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Vasavi_matha_statue.jpg/1200px-Vasavi_matha_statue.jpg"
  );
  const [selectedShape, setSelectedShape] = useState<StallGeometryShape>("temple_mandapam_shrine");
  const [width, setWidth] = useState(3.4);
  const [depth, setDepth] = useState(2.4);
  const [height, setHeight] = useState(3.2);
  const [baseColor, setBaseColor] = useState("#d4af37"); // Panchaloha Gold
  const [accentColor, setAccentColor] = useState("#f1f5f9"); // Sterling Silver
  const [capacityPerHour, setCapacityPerHour] = useState(200);
  const [unitCost, setUnitCost] = useState(45000);
  const [dishesText, setDishesText] = useState("Auspicious Prasadam, Panchamirtham Shots, Thamboolam Pouches");

  // AI Vision Lens background analysis states
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiLensPrompt, setAiLensPrompt] = useState<string>(
    "Grand Dravidian Swarna Mandapam featuring Sculpted Gold and Silver Deity Idol, Tiered Black Granite Pedestal, 4 Carved Stone Pillars with Ornate Capitals, Glowing Prabhavali Sun Halo Arch, and Twin Flickering Brass Kuthu Vilakku Oil Lamps."
  );
  const [detectedFeatures, setDetectedFeatures] = useState<string[]>([
    "Sculpted Gold & Silver Deity Idol",
    "Prabhavali Sun Halo Arch",
    "4 Dravidian Carved Pillars",
    "Twin Flickering Brass Lamps",
    "Vimana Gopuram Top",
  ]);
  const [activeModelSpec, setActiveModelSpec] = useState<Custom3DModelSpec | null>(
    BUILTIN_CUSTOM_3D_MODELS[0]
  );
  const [savedModels, setSavedModels] = useState<Custom3DModelSpec[]>([]);

  useEffect(() => {
    if (open) {
      setSavedModels(getSavedCustom3DModels());
    }
  }, [open]);

  // Background AI Lens: analyzes image pixels, contours, symmetry & materials
  const triggerAiLensScan = async (imgUrl: string, hintName = stallName) => {
    setIsAiScanning(true);
    try {
      const spec = await analyzePhotoTo3DModel(imgUrl, hintName);
      setActiveModelSpec(spec);
      setSelectedShape(spec.shape);
      setAiLensPrompt(spec.aiPrompt);
      setWidth(spec.dimensions.width);
      setDepth(spec.dimensions.depth);
      setHeight(spec.dimensions.height);
      setBaseColor(spec.materials.primaryColor);
      setAccentColor(spec.materials.accentColor);

      // Extract detected feature chips
      const features: string[] = [];
      if (spec.features.hasDeityStatue) features.push("Sculpted Gold & Silver Deity Idol");
      if (spec.features.hasPrabhavaliArch) features.push("Prabhavali Sun Halo Arch");
      if (spec.features.hasPillars) features.push(`${spec.features.pillarCount || 4} Carved Pillars`);
      if (spec.features.hasBrassVilakku) features.push("Twin Flickering Brass Lamps");
      if (spec.features.hasTempleGopuram) features.push("Vimana Gopuram Top");
      if (spec.shape === "cylindrical_rotunda") features.push("True 360° Circular Counter");
      if (spec.features.hasConicalRoof) features.push("Conical Festival Silk Canopy");
      if (spec.features.has3DWheels) features.push("Carved 3D Spoked Wheels");
      if (spec.features.hasCenterUruli) features.push("Center Stepped Brass Uruli");
      setDetectedFeatures(features.length > 0 ? features : ["3D Architectural Truss", "Polished Granite"]);

      setSavedModels(getSavedCustom3DModels());
      toast.success("AI Vision Lens: 3D Model Synthesized!", {
        description: `Generated ${spec.aiLensSummary.detectedStyle} (${spec.aiLensSummary.detectedShape})`,
      });
    } catch (err) {
      console.warn("AI Lens analysis error:", err);
    } finally {
      setIsAiScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setPhotoUrl(dataUrl);
          const fileNameClean = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
          setStallName(fileNameClean.charAt(0).toUpperCase() + fileNameClean.slice(1));
          triggerAiLensScan(dataUrl, fileNameClean);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetModel = (model: Custom3DModelSpec) => {
    setActiveModelSpec(model);
    setStallName(model.name);
    setSelectedShape(model.shape);
    setPhotoUrl(model.sourceImageUrl || "");
    setAiLensPrompt(model.aiPrompt);
    setWidth(model.dimensions.width);
    setDepth(model.dimensions.depth);
    setHeight(model.dimensions.height);
    setBaseColor(model.materials.primaryColor);
    setAccentColor(model.materials.accentColor);

    const features: string[] = [];
    if (model.features.hasDeityStatue) features.push("Sculpted Gold & Silver Deity Idol");
    if (model.features.hasPrabhavaliArch) features.push("Prabhavali Sun Halo Arch");
    if (model.features.hasPillars) features.push(`${model.features.pillarCount || 4} Carved Pillars`);
    if (model.features.hasBrassVilakku) features.push("Twin Flickering Brass Lamps");
    if (model.features.hasTempleGopuram) features.push("Vimana Gopuram Top");
    if (model.shape === "cylindrical_rotunda") features.push("True 360° Circular Counter");
    if (model.features.hasConicalRoof) features.push("Conical Festival Silk Canopy");
    if (model.features.has3DWheels) features.push("Carved 3D Spoked Wheels");
    if (model.features.hasCenterUruli) features.push("Center Stepped Brass Uruli");
    setDetectedFeatures(features);
  };

  const handleShapeChange = (shape: StallGeometryShape) => {
    setSelectedShape(shape);
    if (shape === "cylindrical_rotunda") {
      setWidth(3.2);
      setDepth(3.2);
      setHeight(2.8);
      setBaseColor("#1e293b");
      setAccentColor("#f0c889");
      setAiLensPrompt(
        "360-Degree Cylindrical Round Gourmet Kiosk with Polished Italian Granite Countertop, Perimeter Brass Footrest Rail, 4 Fluted Columns, and Conical Silk Canopy."
      );
      setDetectedFeatures(["True 360° Circular Counter", "Polished Black Granite", "Conical Silk Canopy", "Center Uruli"]);
    } else if (shape === "temple_mandapam_shrine") {
      setWidth(3.4);
      setDepth(2.4);
      setHeight(3.2);
      setBaseColor("#d4af37");
      setAccentColor("#f1f5f9");
      setAiLensPrompt(
        "Grand Dravidian Swarna Mandapam featuring Sculpted Gold and Silver Deity Idol, Tiered Black Granite Pedestal, 4 Carved Pillars, Prabhavali Sun Halo Arch, and Twin Flickering Brass Lamps."
      );
      setDetectedFeatures(["Sculpted Gold & Silver Deity Idol", "Prabhavali Sun Halo Arch", "4 Carved Pillars", "Twin Flickering Lamps"]);
    } else if (shape === "heritage_chariot_cart") {
      setWidth(2.8);
      setDepth(1.8);
      setHeight(2.6);
      setBaseColor("#854d0e");
      setAccentColor("#eab308");
      setAiLensPrompt(
        "South Indian Carved Temple Chariot Cart featuring 3D Spoked Wooden Wheels, Polished Teak Chassis, Brass Finials, and Arched Festival Silk Canopy."
      );
      setDetectedFeatures(["Carved 3D Spoked Wheels", "Teakwood Chassis", "Arched Pandal Awning"]);
    } else if (shape === "stepped_pyramid_uruli") {
      setWidth(2.4);
      setDepth(2.4);
      setHeight(2.2);
      setBaseColor("#d97706");
      setAccentColor("#f59e0b");
      setAiLensPrompt(
        "Multi-Tiered Concentric Brass Uruli Display with Cascading Water Petals, Carved Base Plinth, and Warm Overhead Spotlights."
      );
      setDetectedFeatures(["Concentric Brass Urulis", "Water Fountain", "Corner Diya Lamps"]);
    } else {
      setWidth(3.0);
      setDepth(1.6);
      setHeight(2.4);
      setBaseColor("#334155");
      setAccentColor("#f0c889");
    }
  };

  const handleCreateStall = () => {
    if (!stallName.trim()) {
      toast.error("Please enter a stall name");
      return;
    }

    const customModelSpec: Custom3DModelSpec = activeModelSpec
      ? {
          ...activeModelSpec,
          name: stallName.trim(),
          shape: selectedShape,
          aiPrompt: aiLensPrompt,
          dimensions: {
            width,
            depth,
            height,
            radius: selectedShape === "cylindrical_rotunda" ? width / 2 : undefined,
          },
          materials: {
            primaryColor: baseColor,
            accentColor,
            metalness: selectedShape === "temple_mandapam_shrine" ? 0.92 : 0.65,
            roughness: selectedShape === "temple_mandapam_shrine" ? 0.15 : 0.25,
            emissive: selectedShape === "temple_mandapam_shrine" ? baseColor : undefined,
            emissiveIntensity: selectedShape === "temple_mandapam_shrine" ? 0.25 : undefined,
          },
          sourceImageUrl: photoUrl || undefined,
        }
      : {
          id: `custom_3d_${Date.now()}`,
          name: stallName.trim(),
          shape: selectedShape,
          aiPrompt: aiLensPrompt,
          aiLensSummary: {
            detectedShape: selectedShape.replace(/_/g, " ").toUpperCase(),
            dominantPalette: [baseColor, accentColor],
            detectedStyle:
              selectedShape === "temple_mandapam_shrine"
                ? "Grand Temple Gold & Silver Sanctum"
                : selectedShape === "cylindrical_rotunda"
                ? "360° Circular Rotunda Island"
                : "Heritage Chariot",
            primaryMaterial: selectedShape === "temple_mandapam_shrine" ? "gold_and_silver" : "brass",
            confidence: 0.95,
          },
          dimensions: {
            width,
            depth,
            height,
            radius: selectedShape === "cylindrical_rotunda" ? width / 2 : undefined,
          },
          materials: {
            primaryColor: baseColor,
            accentColor,
            metalness: selectedShape === "temple_mandapam_shrine" ? 0.92 : 0.65,
            roughness: selectedShape === "temple_mandapam_shrine" ? 0.15 : 0.25,
          },
          features: {
            hasDeityStatue: selectedShape === "temple_mandapam_shrine",
            hasPillars: true,
            pillarCount: 4,
            hasPrabhavaliArch: selectedShape === "temple_mandapam_shrine",
            hasBrassVilakku: selectedShape === "temple_mandapam_shrine",
            hasTempleGopuram: selectedShape === "temple_mandapam_shrine",
            has3DWheels: selectedShape === "heritage_chariot_cart",
            hasConicalRoof: selectedShape === "cylindrical_rotunda",
            hasCenterUruli: selectedShape === "cylindrical_rotunda" || selectedShape === "stepped_pyramid_uruli",
          },
          sourceImageUrl: photoUrl || undefined,
          createdAt: Date.now(),
        };

    const newStall: StallItem = {
      id: `custom-${Date.now().toString().slice(-4)}`,
      type: "custom_stall",
      name: stallName.trim(),
      name_ta: stallNameTa.trim() || stallName.trim(),
      category: category.trim(),
      position: [0, 0, 0],
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
      tag: `AI Lens: ${selectedShape.replace(/_/g, " ").toUpperCase()}`,
      customPhotoUrl: photoUrl || undefined,
      customModelSpec,
    };

    onSaveCustomStall(newStall);
    onOpenChange(false);
    toast.success("True 3D Model Synthesized & Placed!", {
      description: `Added "${stallName}" with pakka 3D ${selectedShape.replace(/_/g, " ")} geometry.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-[#090b12] border border-[#e2c99a]/30 text-white p-6 rounded-2xl shadow-2xl backdrop-blur-2xl max-h-[92vh] overflow-y-auto font-sans">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-white font-mono uppercase tracking-wider">
            <Sparkles className="h-5 w-5 text-[#e2c99a] animate-pulse" />
            AI Vision Lens // Photo-to-3D Model Generator
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-xs font-sans">
            AI automatically analyzes stall photography, detects circular contours or gold/silver temple statues,
            synthesizes the 3D procedural prompt, and renders true 3D geometry rather than a flat image.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-3">
          {/* 1. Pre-Synthesized 3D Model Library */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-[#e2c99a] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Landmark className="h-3.5 w-3.5" />
                Persistent 3D Model Library ({savedModels.length} Models)
              </Label>
              <span className="text-[10px] text-neutral-400 font-mono">
                1-Click Select or Upload Custom
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {savedModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleSelectPresetModel(model)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                    activeModelSpec?.id === model.id
                      ? "bg-[#d4af37]/20 border-[#d4af37] text-white shadow-lg shadow-[#d4af37]/20"
                      : "bg-[#121520] border-white/10 text-neutral-300 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {model.shape === "temple_mandapam_shrine" ? (
                      <Landmark className="h-4 w-4 text-[#d4af37] shrink-0" />
                    ) : model.shape === "cylindrical_rotunda" ? (
                      <CircleDot className="h-4 w-4 text-sky-400 shrink-0" />
                    ) : (
                      <Layers className="h-4 w-4 text-amber-400 shrink-0" />
                    )}
                    <span className="font-bold text-xs truncate block">{model.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span className="capitalize">{model.shape.replace(/_/g, " ")}</span>
                    <span className="text-[#e2c99a] font-bold">
                      {model.dimensions.width}×{model.dimensions.depth}m
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Photo Upload with Background AI Lens Analysis */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#121520] to-[#0c0d16] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-white flex items-center gap-1.5 font-mono">
                <Upload className="h-4 w-4 text-[#e2c99a]" />
                Upload Stall / Temple Photo for AI 3D Reconstruction
              </Label>
              {isAiScanning && (
                <span className="text-[11px] text-[#e2c99a] font-mono animate-pulse flex items-center gap-1.5">
                  <RotateCw className="h-3.5 w-3.5 animate-spin" />
                  AI Vision Lens analyzing contours & materials...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <Label
                htmlFor="stall-photo-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-[#e2c99a] rounded-xl p-4 cursor-pointer transition-colors text-center bg-black/40"
              >
                {photoUrl ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <img
                      src={photoUrl}
                      alt="Uploaded Stall"
                      className="h-20 w-36 object-cover rounded-lg border border-[#e2c99a]/60 shadow-lg"
                    />
                    <span className="text-[11px] text-[#e2c99a] font-semibold font-mono">
                      Change Photo & Re-Analyze
                    </span>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-7 w-7 text-neutral-400 mb-1" />
                    <span className="text-xs font-semibold text-white">
                      Upload Stall / Temple Picture
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Round kiosks, temple statues, or chariot photos
                    </span>
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
                <span className="text-xs text-neutral-400 block font-mono">Or paste photo URL:</span>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://.../temple-or-round-stall.jpg"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="text-xs bg-black/60 border-white/15 text-white font-mono"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => photoUrl && triggerAiLensScan(photoUrl)}
                    disabled={!photoUrl || isAiScanning}
                    className="text-xs shrink-0 border-[#e2c99a]/40 bg-[#e2c99a]/10 text-[#e2c99a] hover:bg-[#e2c99a]/20"
                  >
                    Scan
                  </Button>
                </div>

                {/* AI Prompt Synthesized in Background */}
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-neutral-300">
                  <div className="flex items-center gap-1.5 text-[#e2c99a] font-bold text-[10px] mb-1 uppercase">
                    <Sparkles className="h-3 w-3" />
                    Synthesized 3D Model AI Prompt:
                  </div>
                  <p className="line-clamp-2 text-neutral-400 italic">
                    "{aiLensPrompt}"
                  </p>
                </div>
              </div>
            </div>

            {/* Detected 3D Features Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-[#e2c99a] font-bold uppercase mr-1">
                Detected 3D Elements:
              </span>
              {detectedFeatures.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-[#e2c99a]/15 border border-[#e2c99a]/40 text-[#fef08a] font-mono text-[10px] flex items-center gap-1"
                >
                  <Check className="h-2.5 w-2.5 text-[#e2c99a]" />
                  {feat}
                </span>
              ))}
            </div>
          </div>

          {/* 3. True 3D Geometry Shape Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              3D Architectural Geometry Shape
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => handleShapeChange("temple_mandapam_shrine")}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                  selectedShape === "temple_mandapam_shrine"
                    ? "bg-[#d4af37]/25 border-[#d4af37] text-[#fef08a] shadow-md font-bold"
                    : "bg-[#121520] border-white/10 text-neutral-300 hover:text-white"
                }`}
              >
                <Landmark className="h-4 w-4 text-[#d4af37]" />
                <div>
                  <div className="font-bold text-[11px]">Temple Mandapam</div>
                  <div className="text-[9px] text-neutral-400">Gold/Silver Statue</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleShapeChange("cylindrical_rotunda")}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                  selectedShape === "cylindrical_rotunda"
                    ? "bg-sky-500/25 border-sky-400 text-sky-200 shadow-md font-bold"
                    : "bg-[#121520] border-white/10 text-neutral-300 hover:text-white"
                }`}
              >
                <CircleDot className="h-4 w-4 text-sky-400" />
                <div>
                  <div className="font-bold text-[11px]">Round 360° Rotunda</div>
                  <div className="text-[9px] text-neutral-400">True Circular Island</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleShapeChange("heritage_chariot_cart")}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                  selectedShape === "heritage_chariot_cart"
                    ? "bg-amber-500/25 border-amber-400 text-amber-200 shadow-md font-bold"
                    : "bg-[#121520] border-white/10 text-neutral-300 hover:text-white"
                }`}
              >
                <Layers className="h-4 w-4 text-amber-400" />
                <div>
                  <div className="font-bold text-[11px]">Chariot (Rath) Cart</div>
                  <div className="text-[9px] text-neutral-400">3D Spoked Wheels</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleShapeChange("stepped_pyramid_uruli")}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 ${
                  selectedShape === "stepped_pyramid_uruli"
                    ? "bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-md font-bold"
                    : "bg-[#121520] border-white/10 text-neutral-300 hover:text-white"
                }`}
              >
                <Compass className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="font-bold text-[11px]">Stepped Uruli</div>
                  <div className="text-[9px] text-neutral-400">Concentric Brass</div>
                </div>
              </button>
            </div>
          </div>

          {/* 4. Stall Specifications & Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-400 font-mono">Stall / Structure Name (English)</Label>
              <Input
                value={stallName}
                onChange={(e) => setStallName(e.target.value)}
                className="bg-black/60 border-white/15 text-xs font-medium text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-400 font-mono">Stall Name (Tamil)</Label>
              <Input
                value={stallNameTa}
                onChange={(e) => setStallNameTa(e.target.value)}
                className="bg-black/60 border-white/15 text-xs font-tamil font-medium text-[#f0c889]"
              />
            </div>
          </div>

          {/* Dimensions (Width / Diameter, Depth, Height) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-400 font-mono">
                {selectedShape === "cylindrical_rotunda" ? "Diameter (meters)" : "Width (meters)"}
              </Label>
              <Input
                type="number"
                step="0.1"
                value={width}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWidth(val);
                  if (selectedShape === "cylindrical_rotunda") setDepth(val);
                }}
                className="bg-black/60 border-white/15 text-xs font-mono text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-400 font-mono">Depth (meters)</Label>
              <Input
                type="number"
                step="0.1"
                value={depth}
                disabled={selectedShape === "cylindrical_rotunda"}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="bg-black/60 border-white/15 text-xs font-mono text-white disabled:opacity-50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-400 font-mono">Height (meters)</Label>
              <Input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="bg-black/60 border-white/15 text-xs font-mono text-white"
              />
            </div>
          </div>

          {/* Material & Color Themes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-400 font-mono">Material Palette (Primary / Accent)</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                />
                <span className="text-[11px] text-[#f0c889] font-mono">
                  {baseColor} / {accentColor}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-400 font-mono">Estimated Setup Cost (₹ INR)</Label>
              <Input
                type="number"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="bg-black/60 border-white/15 text-xs font-mono text-white"
              />
            </div>
          </div>

          {/* Dishes */}
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-400 font-mono">Dishes / Specialty Offerings</Label>
            <Input
              value={dishesText}
              onChange={(e) => setDishesText(e.target.value)}
              className="bg-black/60 border-white/15 text-xs text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9 border-white/15 text-neutral-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateStall}
            disabled={isAiScanning}
            className="bg-[#e2c99a] hover:bg-[#c5a059] text-black font-mono font-bold text-xs h-9 px-6 rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95 uppercase tracking-wider"
          >
            <CrosshairVector size={15} />
            <span>Instantiate 3D Stage Model</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
