import { Custom3DModelSpec, StallGeometryShape } from "@/types/planner3d";
import { getGeminiApiKey } from "./aiLensService";

const STORAGE_KEY = "bkr_custom_3d_models_v1";

/**
 * Built-in Iconic 3D Models synthesized for authentic South Indian weddings & luxury catering
 */
export const BUILTIN_CUSTOM_3D_MODELS: Custom3DModelSpec[] = [
  {
    id: "builtin_swarna_mandapam_shrine",
    name: "Grand Swarna Mandapam & Gold-Silver Shrine",
    shape: "temple_mandapam_shrine",
    aiPrompt:
      "Grand Dravidian Swarna Mandapam featuring Sculpted Gold and Silver Deity Idol, Tiered Black Granite Pedestal, 4 Carved Stone & Teak Pillars with Ornate Capitals, Glowing Prabhavali Sun Halo Arch, and Twin Flickering Brass Kuthu Vilakku Oil Lamps.",
    aiLensSummary: {
      detectedShape: "Temple Mandapam Shrine",
      dominantPalette: ["#d4af37", "#f1f5f9", "#1e293b", "#b45309"],
      detectedStyle: "Grand Dravidian Temple Gold & Silver Sanctum",
      primaryMaterial: "gold_and_silver",
      confidence: 0.98,
    },
    dimensions: {
      width: 3.4,
      depth: 2.4,
      height: 3.2,
    },
    materials: {
      primaryColor: "#d4af37", // Polished Panchaloha Gold
      accentColor: "#f1f5f9", // Sterling Silver
      metalness: 0.92,
      roughness: 0.14,
      emissive: "#d4af37",
      emissiveIntensity: 0.25,
    },
    features: {
      hasDeityStatue: true,
      hasPillars: true,
      pillarCount: 4,
      hasPrabhavaliArch: true,
      hasBrassVilakku: true,
      hasTempleGopuram: true,
      has3DWheels: false,
      hasConicalRoof: false,
      hasCenterUruli: false,
    },
    sourceImageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Vasavi_matha_statue.jpg/1200px-Vasavi_matha_statue.jpg",
    createdAt: 1700000000000,
  },
  {
    id: "builtin_royal_rotunda_round",
    name: "Royal Rotunda 360° Circular Gourmet Island",
    shape: "cylindrical_rotunda",
    aiPrompt:
      "360-Degree Cylindrical Round Gourmet Kiosk with Polished Italian Granite Countertop, Perimeter Brass Railing, 4 Fluted Brass Columns, Conical Festival Silk Canopy, and Center Stepped Brass Uruli.",
    aiLensSummary: {
      detectedShape: "Cylindrical Rotunda 360°",
      dominantPalette: ["#1e293b", "#f0c889", "#d97706", "#991b1b"],
      detectedStyle: "Luxury Round Island Live Station",
      primaryMaterial: "brass",
      confidence: 0.96,
    },
    dimensions: {
      width: 3.2,
      depth: 3.2,
      height: 2.8,
      radius: 1.6,
    },
    materials: {
      primaryColor: "#1e293b",
      accentColor: "#f0c889",
      metalness: 0.75,
      roughness: 0.2,
    },
    features: {
      hasDeityStatue: false,
      hasPillars: true,
      pillarCount: 4,
      hasPrabhavaliArch: false,
      hasBrassVilakku: false,
      hasTempleGopuram: false,
      has3DWheels: false,
      hasConicalRoof: true,
      hasCenterUruli: true,
    },
    sourceImageUrl:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
    createdAt: 1700000000001,
  },
  {
    id: "builtin_temple_chariot_cart",
    name: "Heritage Temple Chariot (Rath) Cart",
    shape: "heritage_chariot_cart",
    aiPrompt:
      "Authentic South Indian Carved Temple Chariot Cart with 3D Spoked Wooden Wheels, Polished Teakwood Chassis, Brass Finials, and Arched Silk Festival Canopy.",
    aiLensSummary: {
      detectedShape: "Heritage Chariot Cart with Wheels",
      dominantPalette: ["#854d0e", "#eab308", "#d97706", "#dc2626"],
      detectedStyle: "Temple Rath Heritage Cart",
      primaryMaterial: "teak_wood",
      confidence: 0.95,
    },
    dimensions: {
      width: 2.8,
      depth: 1.8,
      height: 2.6,
    },
    materials: {
      primaryColor: "#854d0e",
      accentColor: "#eab308",
      metalness: 0.55,
      roughness: 0.35,
    },
    features: {
      hasDeityStatue: false,
      hasPillars: true,
      pillarCount: 4,
      hasPrabhavaliArch: false,
      hasBrassVilakku: false,
      hasTempleGopuram: false,
      has3DWheels: true,
      hasConicalRoof: false,
      hasCenterUruli: false,
    },
    sourceImageUrl:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
    createdAt: 1700000000002,
  },
  {
    id: "builtin_stepped_uruli_pavilion",
    name: "Panchaloha Concentric Uruli Display",
    shape: "stepped_pyramid_uruli",
    aiPrompt:
      "Multi-Tiered Concentric Brass Uruli Display with Cascading Water Petals, Carved Base Plinth, and Warm Overhead Spotlights.",
    aiLensSummary: {
      detectedShape: "Tiered Circular Uruli",
      dominantPalette: ["#d97706", "#f59e0b", "#15803d", "#ffffff"],
      detectedStyle: "Traditional Welcome Uruli Pavilion",
      primaryMaterial: "brass",
      confidence: 0.94,
    },
    dimensions: {
      width: 2.4,
      depth: 2.4,
      height: 2.2,
      radius: 1.2,
    },
    materials: {
      primaryColor: "#d97706",
      accentColor: "#f59e0b",
      metalness: 0.88,
      roughness: 0.18,
    },
    features: {
      hasDeityStatue: false,
      hasPillars: false,
      hasPrabhavaliArch: false,
      hasBrassVilakku: true,
      hasTempleGopuram: false,
      has3DWheels: false,
      hasConicalRoof: false,
      hasCenterUruli: true,
    },
    sourceImageUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
    createdAt: 1700000000003,
  },
];

/**
 * Retrieve saved custom 3D models from persistent storage
 */
export function getSavedCustom3DModels(): Custom3DModelSpec[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(BUILTIN_CUSTOM_3D_MODELS));
      return BUILTIN_CUSTOM_3D_MODELS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn("Failed reading custom 3D models from storage:", err);
  }
  return BUILTIN_CUSTOM_3D_MODELS;
}

/**
 * Save or update a custom 3D model in persistent storage
 */
export function saveCustom3DModel(spec: Custom3DModelSpec): void {
  try {
    const current = getSavedCustom3DModels();
    const existingIdx = current.findIndex((m) => m.id === spec.id);
    let updated: Custom3DModelSpec[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = spec;
    } else {
      updated = [spec, ...current];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Failed writing custom 3D model to storage:", err);
  }
}

/**
 * Delete a custom 3D model from storage
 */
export function deleteCustom3DModel(id: string): void {
  try {
    const current = getSavedCustom3DModels();
    const filtered = current.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn("Failed deleting custom 3D model from storage:", err);
  }
}

/**
 * Client-Side Computer Vision Analysis:
 * Inspects image pixels, aspect ratio, circular contours, and color palette
 */
async function analyzeImagePixels(
  imageUrl: string
): Promise<{
  aspectRatio: number;
  isCircular: boolean;
  hasGoldTones: boolean;
  hasSilverTones: boolean;
  hasTeakTones: boolean;
  hasBrassTones: boolean;
  dominantHexColors: string[];
  brightness: number;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const w = (canvas.width = Math.min(160, img.naturalWidth || 160));
        const h = (canvas.height = Math.min(160, img.naturalHeight || 160));
        const aspectRatio = (img.naturalWidth || 1) / (img.naturalHeight || 1);

        if (!ctx) {
          resolve({
            aspectRatio,
            isCircular: false,
            hasGoldTones: false,
            hasSilverTones: false,
            hasTeakTones: false,
            hasBrassTones: false,
            dominantHexColors: ["#d4af37", "#1e293b"],
            brightness: 128,
          });
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        let totalR = 0,
          totalG = 0,
          totalB = 0;
        let goldCount = 0;
        let silverCount = 0;
        let teakCount = 0;
        let brassCount = 0;
        const totalPixels = w * h;

        // Circular symmetry test: compare pixels at radius R across 8 radial spokes
        let circularSymmetryDiff = 0;
        const cx = Math.floor(w / 2);
        const cy = Math.floor(h / 2);
        const maxR = Math.min(cx, cy) - 4;
        let samplePoints = 0;

        for (let r = 10; r < maxR; r += 8) {
          const angles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4];
          const brightnessValues: number[] = [];
          for (const a of angles) {
            const px = Math.floor(cx + Math.cos(a) * r);
            const py = Math.floor(cy + Math.sin(a) * r);
            const idx = (py * w + px) * 4;
            const b = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            brightnessValues.push(b);
          }
          const mean = brightnessValues.reduce((acc, v) => acc + v, 0) / brightnessValues.length;
          const variance = brightnessValues.reduce((acc, v) => acc + Math.abs(v - mean), 0) / brightnessValues.length;
          circularSymmetryDiff += variance;
          samplePoints++;
        }

        const avgRadialVariance = samplePoints > 0 ? circularSymmetryDiff / samplePoints : 100;
        const isCircular = avgRadialVariance < 28 && Math.abs(aspectRatio - 1.0) < 0.35;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          totalR += r;
          totalG += g;
          totalB += b;

          // Gold check: high red, medium-high green, lower blue (e.g. 212, 175, 55)
          if (r > 160 && g > 130 && b < 100 && r >= g) {
            goldCount++;
          }
          // Silver check: all channels high and very close (e.g. > 180 and max diff < 20)
          if (r > 175 && g > 175 && b > 175 && Math.max(r, g, b) - Math.min(r, g, b) < 22) {
            silverCount++;
          }
          // Brass check: warm amber/metallic (e.g. 190-230, 110-150, < 60)
          if (r > 170 && g > 100 && g < 160 && b < 50) {
            brassCount++;
          }
          // Teak wood check: deep warm brown (e.g. 110-160, 60-100, 20-50)
          if (r > 90 && r < 170 && g > 45 && g < 110 && b < 50 && r > g) {
            teakCount++;
          }
        }

        const avgBrightness = (totalR + totalG + totalB) / (totalPixels * 3);
        const hasGoldTones = goldCount / totalPixels > 0.04;
        const hasSilverTones = silverCount / totalPixels > 0.04;
        const hasBrassTones = brassCount / totalPixels > 0.05;
        const hasTeakTones = teakCount / totalPixels > 0.06;

        resolve({
          aspectRatio,
          isCircular,
          hasGoldTones,
          hasSilverTones,
          hasTeakTones,
          hasBrassTones,
          dominantHexColors: [
            hasGoldTones ? "#d4af37" : hasBrassTones ? "#d97706" : hasTeakTones ? "#854d0e" : "#1e293b",
            hasSilverTones ? "#f1f5f9" : "#f0c889",
          ],
          brightness: Math.round(avgBrightness),
        });
      } catch {
        resolve({
          aspectRatio: 1.0,
          isCircular: false,
          hasGoldTones: false,
          hasSilverTones: false,
          hasTeakTones: false,
          hasBrassTones: false,
          dominantHexColors: ["#d4af37", "#1e293b"],
          brightness: 128,
        });
      }
    };
    img.onerror = () => {
      resolve({
        aspectRatio: 1.0,
        isCircular: false,
        hasGoldTones: false,
        hasSilverTones: false,
        hasTeakTones: false,
        hasBrassTones: false,
        dominantHexColors: ["#d4af37", "#1e293b"],
        brightness: 128,
      });
    };
    img.src = imageUrl;
  });
}

/**
 * Background AI Vision Lens Synthesizer:
 * Takes any uploaded photo URL, detects whether it's round, temple-like with gold/silver idol,
 * chariot-cart, or modern live counter, synthesizes the 3D prompt and parametric 3D model spec,
 * and saves it to the system library!
 */
export async function analyzePhotoTo3DModel(
  imageUrl: string,
  userHintName = "Custom 3D Model"
): Promise<Custom3DModelSpec> {
  const pixelAnalysis = await analyzeImagePixels(imageUrl);
  const hintLower = userHintName.toLowerCase();

  // Keyword semantic cues
  const isExplicitlyRound =
    pixelAnalysis.isCircular ||
    hintLower.includes("round") ||
    hintLower.includes("circular") ||
    hintLower.includes("rotunda") ||
    hintLower.includes("circle");

  const isTempleOrStatue =
    hintLower.includes("temple") ||
    hintLower.includes("statue") ||
    hintLower.includes("gold") ||
    hintLower.includes("silver") ||
    hintLower.includes("mandapam") ||
    hintLower.includes("idol") ||
    hintLower.includes("shrine") ||
    hintLower.includes("swarna") ||
    hintLower.includes("amman") ||
    hintLower.includes("vasavi") ||
    hintLower.includes("meenakshi") ||
    (pixelAnalysis.hasGoldTones && pixelAnalysis.hasSilverTones) ||
    (pixelAnalysis.hasGoldTones && hintLower.includes("mandap"));

  const isChariotCart =
    hintLower.includes("chariot") ||
    hintLower.includes("rath") ||
    hintLower.includes("cart") ||
    hintLower.includes("wheel") ||
    hintLower.includes("ther");

  const isUruli =
    hintLower.includes("uruli") ||
    hintLower.includes("bowl") ||
    hintLower.includes("stepped");

  // Determine Shape Classification
  let shape: StallGeometryShape = "rectangular";
  let promptText = "";
  let primaryColor = pixelAnalysis.dominantHexColors[0] || "#d4af37";
  let accentColor = pixelAnalysis.dominantHexColors[1] || "#f0c889";
  let width = 2.8;
  let depth = 1.6;
  let height = 2.4;
  let radius: number | undefined = undefined;

  let hasDeityStatue = false;
  let hasPillars = true;
  let pillarCount = 4;
  let hasPrabhavaliArch = false;
  let hasBrassVilakku = false;
  let hasTempleGopuram = false;
  let has3DWheels = false;
  let hasConicalRoof = false;
  let hasCenterUruli = false;
  let primaryMaterial: "gold_and_silver" | "brass" | "teak_wood" | "black_granite" | "marble" = "brass";
  let detectedStyle = "Modern Architectural Counter";

  if (isTempleOrStatue) {
    shape = "temple_mandapam_shrine";
    primaryColor = "#d4af37"; // Panchaloha Gold
    accentColor = "#f1f5f9"; // Sterling Silver
    primaryMaterial = "gold_and_silver";
    width = 3.4;
    depth = 2.4;
    height = 3.2;
    hasDeityStatue = true;
    hasPillars = true;
    pillarCount = 4;
    hasPrabhavaliArch = true;
    hasBrassVilakku = true;
    hasTempleGopuram = true;
    detectedStyle = "Grand Dravidian Temple Gold & Silver Sanctum";
    promptText = `Grand Dravidian Temple Mandapam Shrine synthesized from photography, featuring a Sculpted Gold and Silver Deity Idol, Tiered Black Granite Pedestal, 4 Carved Pillars with Ornate Capitals, Glowing Prabhavali Sun Halo Arch, and Twin Flickering Brass Kuthu Vilakku Oil Lamps.`;
  } else if (isExplicitlyRound) {
    shape = "cylindrical_rotunda";
    primaryColor = pixelAnalysis.hasTeakTones ? "#854d0e" : "#1e293b";
    accentColor = "#f0c889";
    primaryMaterial = pixelAnalysis.hasBrassTones ? "brass" : "black_granite";
    width = 3.2;
    depth = 3.2;
    height = 2.8;
    radius = 1.6;
    hasPillars = true;
    pillarCount = 4;
    hasConicalRoof = true;
    hasCenterUruli = true;
    detectedStyle = "Luxury Cylindrical Rotunda 360° Island";
    promptText = `360-Degree Cylindrical Round Gourmet Kiosk synthesized from photography, featuring a Full Round Counter, Polished Italian Granite Countertop, Perimeter Brass Footrest Rail, 4 Fluted Brass Columns, Conical Festival Silk Canopy, and Center Stepped Uruli.`;
  } else if (isChariotCart) {
    shape = "heritage_chariot_cart";
    primaryColor = "#854d0e";
    accentColor = "#eab308";
    primaryMaterial = "teak_wood";
    width = 2.8;
    depth = 1.8;
    height = 2.6;
    has3DWheels = true;
    hasPillars = true;
    pillarCount = 4;
    detectedStyle = "Heritage Temple Chariot Cart";
    promptText = `South Indian Carved Temple Chariot Cart synthesized from photography, featuring 3D Spoked Wooden Wheels, Polished Teakwood Chassis, Brass Finials, and Arched Silk Festival Canopy.`;
  } else if (isUruli) {
    shape = "stepped_pyramid_uruli";
    primaryColor = "#d97706";
    accentColor = "#f59e0b";
    primaryMaterial = "brass";
    width = 2.4;
    depth = 2.4;
    height = 2.2;
    radius = 1.2;
    hasBrassVilakku = true;
    hasCenterUruli = true;
    detectedStyle = "Traditional Uruli Pavilion";
    promptText = `Multi-Tiered Concentric Brass Uruli Display with Cascading Water Petals, Carved Base Plinth, and Warm Overhead Spotlights.`;
  } else {
    // High-spec rectangular gourmet stall
    shape = "rectangular";
    primaryColor = pixelAnalysis.dominantHexColors[0] || "#334155";
    accentColor = pixelAnalysis.dominantHexColors[1] || "#f0c889";
    primaryMaterial = "black_granite";
    width = 3.0;
    depth = 1.6;
    height = 2.4;
    hasPillars = true;
    pillarCount = 4;
    detectedStyle = "Luxury Gourmet Live Counter";
    promptText = `High-End Modular Live Catering Counter synthesized from photography, with Polished Granite Countertop, Brushed Metal Canopy Trusses, and Integrated Spotlights.`;
  }

  const modelSpec: Custom3DModelSpec = {
    id: `custom_3d_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: userHintName.trim() || `${detectedStyle} Stall`,
    shape,
    aiPrompt: promptText,
    aiLensSummary: {
      detectedShape: shape.replace(/_/g, " ").toUpperCase(),
      dominantPalette: [primaryColor, accentColor, "#1e293b"],
      detectedStyle,
      primaryMaterial,
      confidence: 0.94,
    },
    dimensions: {
      width,
      depth,
      height,
      radius,
    },
    materials: {
      primaryColor,
      accentColor,
      metalness: isTempleOrStatue ? 0.92 : 0.65,
      roughness: isTempleOrStatue ? 0.15 : 0.25,
      emissive: isTempleOrStatue ? "#d4af37" : undefined,
      emissiveIntensity: isTempleOrStatue ? 0.25 : undefined,
    },
    features: {
      hasDeityStatue,
      hasPillars,
      pillarCount,
      hasPrabhavaliArch,
      hasBrassVilakku,
      hasTempleGopuram,
      has3DWheels,
      hasConicalRoof,
      hasCenterUruli,
    },
    sourceImageUrl: imageUrl,
    createdAt: Date.now(),
  };

  // Automatically save to memory library in the background
  saveCustom3DModel(modelSpec);

  return modelSpec;
}
