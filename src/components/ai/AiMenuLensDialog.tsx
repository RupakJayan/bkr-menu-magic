import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Key,
  ArrowRight,
  RefreshCw,
  FileImage,
  Utensils,
  Calendar,
  User,
  MapPin,
  X,
  ExternalLink,
} from "lucide-react";
import {
  getGeminiApiKey,
  setGeminiApiKey,
  hasGeminiApiKey,
  compressImageFileToBase64,
  extractMenuFromHandwrittenImages,
  buildEventMenuFromExtractedData,
  ExtractedMenuData,
  ExtractedSession,
} from "@/services/aiLensService";
import { EventMenu } from "@/types/menu";

interface AiMenuLensDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMenuLoaded: (menu: EventMenu) => void;
  currentMenu?: EventMenu;
}

interface ImageUploadItem {
  id: string;
  file: File;
  previewUrl: string;
  base64Data?: string;
  mimeType?: string;
}

export const AiMenuLensDialog: React.FC<AiMenuLensDialogProps> = ({
  open,
  onOpenChange,
  onMenuLoaded,
  currentMenu,
}) => {
  const { toast } = useToast();
  const [apiKey, setApiKeyInput] = useState<string>(getGeminiApiKey());
  const [showKeyEditor, setShowKeyEditor] = useState<boolean>(!hasGeminiApiKey());
  const [images, setImages] = useState<ImageUploadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [extractedData, setExtractedData] = useState<ExtractedMenuData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid Google Gemini API key.",
        variant: "destructive",
      });
      return;
    }
    setGeminiApiKey(apiKey);
    setShowKeyEditor(false);
    toast({
      title: "API Key Saved",
      description: "Gemini API key saved securely in your browser.",
    });
  };

  const handleFilesAdded = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: ImageUploadItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: `img_${Date.now()}_${i}`,
        file,
        previewUrl,
      });
    }

    setImages((prev) => [...prev, ...newItems]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleStartExtraction = async () => {
    const key = apiKey.trim() || getGeminiApiKey();
    if (!key) {
      setShowKeyEditor(true);
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to scan handwritten menus.",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "No Photos Added",
        description: "Please take a photo or upload an image of the handwritten menu.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingStatus("Optimizing photo resolution for AI vision...");

    try {
      const preparedImages = await Promise.all(
        images.map(async (img) => {
          if (img.base64Data && img.mimeType) {
            return { base64Data: img.base64Data, mimeType: img.mimeType };
          }
          const compressed = await compressImageFileToBase64(img.file);
          img.base64Data = compressed.base64Data;
          img.mimeType = compressed.mimeType;
          return compressed;
        })
      );

      setProcessingStatus("Deciphering Tamil & English handwriting...");
      const extracted = await extractMenuFromHandwrittenImages(preparedImages, key);

      setExtractedData(extracted);
      toast({
        title: "Handwriting Converted Successfully!",
        description: `Extracted ${extracted.sessions.length} sessions with ${extracted.sessions.reduce(
          (acc, s) => acc + s.dishes.length,
          0
        )} dishes.`,
      });
    } catch (error: any) {
      console.error("AI Lens extraction failed:", error);
      toast({
        title: "Extraction Failed",
        description: error?.message || "Could not read handwritten menu. Please try with clearer photos.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleApplyToPlanner = () => {
    if (!extractedData) return;

    const eventMenu = buildEventMenuFromExtractedData(extractedData, currentMenu);
    onMenuLoaded(eventMenu);
    onOpenChange(false);

    toast({
      title: "Menu Applied to Planner!",
      description: "Everything has been loaded. You can now edit all details, dishes, and pricing.",
    });
  };

  const handleReset = () => {
    setExtractedData(null);
    setImages([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border border-line bg-surf text-ink rounded-2xl shadow-theme">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#762934] via-[#8a3540] to-[#762934] dark:from-[#242124] dark:via-[#2e292d] dark:to-[#242124] p-6 text-white dark:text-ink rounded-t-2xl relative border-b border-line">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 dark:bg-acc/10 border border-white/20 dark:border-acc/30 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Sparkles className="h-6 w-6 text-amber-200 dark:text-acc animate-pulse" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold font-display tracking-wide flex items-center gap-2.5">
                AI Menu Lens
                <Badge className="bg-amber-300/20 text-amber-200 dark:text-acc dark:bg-acc/20 border border-amber-300/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Lens / பார்வை
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-white/85 dark:text-mute text-sm mt-0.5 font-body">
                Convert handwritten catering orders & notes into fully editable digital menus instantly.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* API Key Banner / Editor */}
          {showKeyEditor ? (
            <div className="p-4 rounded-xl border border-line bg-surf2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-ink flex items-center gap-2">
                  <Key className="h-4 w-4 text-acc" />
                  Google Gemini API Key Setup
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-acc hover:underline flex items-center gap-1 font-semibold"
                >
                  Get Free Key from Google AI Studio <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-xs text-mute">
                AI Menu Lens uses Google Gemini Multimodal Vision to decipher Tamil and English handwriting. Your key is stored only locally in your browser.
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Paste AI Studio API key (AIzaSy...)"
                  value={apiKey}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="bg-surf border-line text-ink placeholder:text-mute rounded-lg"
                />
                <Button onClick={handleSaveApiKey} className="bg-acc text-accink hover:opacity-95 font-medium px-4 rounded-lg shadow-theme-sm shrink-0">
                  Save Key
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-surf2 rounded-lg text-xs text-ink border border-line">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Gemini AI Vision Ready
              </span>
              <button
                type="button"
                onClick={() => setShowKeyEditor(true)}
                className="text-acc hover:underline font-semibold"
              >
                Change API Key
              </button>
            </div>
          )}

          {/* STEP 1: UPLOAD / CAMERA (shown when no extracted data yet) */}
          {!extractedData && !isProcessing && (
            <div className="space-y-5">
              {/* Capture / Upload options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Take Photo button */}
                <div
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-line hover:border-acc rounded-xl bg-surf2/40 hover:bg-surf2 cursor-pointer flex flex-col items-center justify-center gap-3 transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-acc text-accink flex items-center justify-center group-hover:scale-105 transition-transform shadow-theme-sm">
                    <Camera className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-ink">Take Photo with Camera</p>
                    <p className="text-xs text-mute mt-0.5">Use phone or webcam to snap order slip</p>
                  </div>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFilesAdded(e.target.files)}
                  />
                </div>

                {/* Upload from gallery */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-line hover:border-acc rounded-xl bg-surf2/40 hover:bg-surf2 cursor-pointer flex flex-col items-center justify-center gap-3 transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-acc text-accink flex items-center justify-center group-hover:scale-105 transition-transform shadow-theme-sm">
                    <Upload className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-ink">Upload Picture(s)</p>
                    <p className="text-xs text-mute mt-0.5">Select images from gallery or computer</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFilesAdded(e.target.files)}
                  />
                </div>
              </div>

              {/* Uploaded images previews */}
              {images.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-ink">
                      Selected Photos ({images.length})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setImages([])}
                      className="text-xs text-mute hover:text-ink"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={img.id}
                        className="relative group rounded-xl overflow-hidden border border-line shadow-theme-sm aspect-[4/3] bg-surf2"
                      >
                        <img
                          src={img.previewUrl}
                          alt={`Handwritten menu ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(img.id);
                          }}
                          className="absolute top-1.5 right-1.5 w-7 h-7 bg-acc text-accink rounded-full flex items-center justify-center shadow-theme-sm hover:opacity-90 transition-transform active:scale-95"
                          title="Remove photo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-2 py-0.5 text-center truncate">
                          Page {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="p-4 rounded-xl bg-surf2 border border-line text-xs text-ink space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-ink">
                  <Sparkles className="h-3.5 w-3.5 text-acc" />
                  Tips for best handwriting recognition:
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-mute">
                  <li>Ensure good lighting and avoid shadows on the paper.</li>
                  <li>Tamil (தமிழ்), English, and mixed Tanglish handwriting are all recognized.</li>
                  <li>Order slips, catering contract pads, and diary pages are supported.</li>
                </ul>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleStartExtraction}
                disabled={images.length === 0}
                className="w-full h-13 text-base font-bold bg-acc text-accink hover:opacity-95 rounded-btn shadow-theme disabled:opacity-50 tp-pressable transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Convert Handwritten Menu with AI
              </Button>
            </div>
          )}

          {/* STEP 2: PROCESSING STATE */}
          {isProcessing && (
            <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-line border-t-acc animate-spin flex items-center justify-center"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-acc animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-ink">
                  Reading Handwritten Menu...
                </h3>
                <p className="text-sm text-acc font-semibold mt-1">
                  {processingStatus}
                </p>
                <p className="text-xs text-mute mt-2">
                  Matching dishes with 300+ items in BKR Catering menu database...
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRMATION (shown after extraction) */}
          {extractedData && !isProcessing && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="flex items-center justify-between p-4 bg-surf2 border border-line rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-acc text-accink flex items-center justify-center shrink-0 shadow-theme-sm">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-ink">
                      Handwritten Menu Converted!
                    </h4>
                    <p className="text-xs text-mute">
                      Review the detected details below. Everything will be fully editable in the planner.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleReset} className="border-line bg-surf hover:bg-surf2 text-ink text-xs rounded-full">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Scan Another
                </Button>
              </div>

              {/* Event Information Card */}
              <div className="p-4 border border-line rounded-xl bg-surf space-y-4 shadow-theme-sm">
                <h4 className="font-bold text-ink flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-acc" />
                  Detected Event Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-mute">Client Name</Label>
                    <Input
                      value={extractedData.clientName}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, clientName: e.target.value })
                      }
                      placeholder="e.g. Ramesh Kumar"
                      className="mt-1 bg-surf border-line text-ink placeholder:text-mute focus:border-acc focus:ring-1 focus:ring-acc rounded-lg"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-mute">Client Phone</Label>
                    <Input
                      value={extractedData.clientPhone}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, clientPhone: e.target.value })
                      }
                      placeholder="e.g. 9842100000"
                      className="mt-1 bg-surf border-line text-ink placeholder:text-mute focus:border-acc focus:ring-1 focus:ring-acc rounded-lg"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-mute">Venue / Hall</Label>
                    <Input
                      value={extractedData.venueName}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, venueName: e.target.value })
                      }
                      placeholder="e.g. Sri Krishna Mahal"
                      className="mt-1 bg-surf border-line text-ink placeholder:text-mute focus:border-acc focus:ring-1 focus:ring-acc rounded-lg"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-mute">Event Date</Label>
                    <Input
                      type="date"
                      value={extractedData.startDate}
                      onChange={(e) =>
                        setExtractedData({
                          ...extractedData,
                          startDate: e.target.value,
                          endDate: e.target.value,
                        })
                      }
                      className="mt-1 bg-surf border-line text-ink placeholder:text-mute focus:border-acc focus:ring-1 focus:ring-acc rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Sessions and Dishes Review */}
              <div className="space-y-4">
                <h4 className="font-bold text-ink flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-acc" />
                    Detected Sessions & Dishes ({extractedData.sessions.length} sessions)
                  </span>
                </h4>

                <div className="space-y-4">
                  {extractedData.sessions.map((sess, sIdx) => (
                    <div
                      key={sIdx}
                      className="border border-line rounded-xl overflow-hidden bg-surf shadow-theme-sm"
                    >
                      {/* Session Header */}
                      <div className="bg-surf2 p-3 flex flex-wrap items-center justify-between gap-2 border-b border-line">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-acc text-accink font-semibold rounded-full">{sess.name}</Badge>
                          <span className="text-xs text-mute">
                            {sess.startTime} - {sess.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-semibold text-mute">
                            Guests: <b className="text-acc">{sess.headCount}</b>
                          </span>
                          {sess.ratePerPerson > 0 && (
                            <span className="font-semibold text-mute">
                              Rate: <b className="text-acc">₹{sess.ratePerPerson}/plate</b>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dishes in this session */}
                      <div className="p-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {sess.dishes.map((dish, dIdx) => (
                            <div
                              key={dIdx}
                              className="flex items-center justify-between p-2.5 rounded-lg border border-line hover:border-acc/40 bg-surf transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {dish.image ? (
                                  <img
                                    src={dish.image}
                                    alt={dish.name_en}
                                    className="w-10 h-10 rounded-md object-cover shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-md bg-surf2 border border-line text-ink flex items-center justify-center shrink-0 font-bold text-xs">
                                    🍽️
                                  </div>
                                )}
                                <div className="truncate">
                                  <p className="font-semibold text-sm text-ink truncate">
                                    {dish.name_en}
                                  </p>
                                  <p className="text-xs text-mute truncate">
                                    {dish.name_ta || dish.rawText}
                                  </p>
                                </div>
                              </div>
                              <div className="shrink-0 pl-2">
                                {dish.isCatalogMatch ? (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700 rounded-full"
                                  >
                                    Catalog Match
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] bg-surf2 text-mute border-line rounded-full"
                                  >
                                    Custom Item
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleApplyToPlanner}
                  className="flex-1 h-13 text-base font-bold bg-acc text-accink hover:opacity-95 rounded-btn shadow-theme tp-pressable transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-5 w-5 mr-1" />
                  Apply & Open in Menu Planner
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="h-13 px-6 font-semibold rounded-btn border-line bg-surf hover:bg-surf2 text-ink"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
