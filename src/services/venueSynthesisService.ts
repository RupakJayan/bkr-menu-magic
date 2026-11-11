import * as THREE from "three";
import { MandapamVenue, TerrainType } from "@/types/planner3d";

export interface VenueTemplate {
  id: string;
  name: string;
  name_ta: string;
  location: string;
  terrainType: TerrainType;
  hallLength: number;
  hallWidth: number;
  hallHeight: number;
  defaultCapacity: number;
  blueprintColor: string;
  stagePosition: [number, number, number];
  entrancePosition: [number, number, number];
  handwashPosition: [number, number, number];
  timeOfDay: "morning" | "afternoon" | "sunset" | "night";
  weather: "clear" | "golden_hour" | "festive_serial_lights";
  description: string;
}

export const PRESET_VENUES: MandapamVenue[] = [
  {
    id: "vasavi_anaimalai",
    name: "Sri Vasavi Kanyaka Parameswari Temple & Kalyana Mandapam",
    name_ta: "ஸ்ரீ வாசவி கன்னிகா பரமேஸ்வரி திருக்கோவில் மற்றும் மண்டபம்",
    location: "Car Street, Anaimalai, Pollachi Taluk, Coimbatore",
    terrainType: "hall",
    hallLength: 38,
    hallWidth: 26,
    hallHeight: 7.0,
    defaultCapacity: 1500,
    blueprintUrl: "",
    stagePosition: [0, 0, -15],
    entrancePosition: [0, 0, 16],
    handwashPosition: [-10, 0, 13],
    timeOfDay: "sunset",
    weather: "golden_hour",
    panoramicSkyboxUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Vasavi_matha_statue.jpg/1200px-Vasavi_matha_statue.jpg",
    description: "Sacred Arya Vysya temple and historic wedding mandapam located on Car Street, Anaimalai near Pollachi. Features traditional Dravidian ceremonial mandap, central aisle, marble dining concourse, and 1,500-guest wedding reception capacity.",
  },
  {
    id: "masani_amman_anaimalai",
    name: "Arulmigu Sri Masani Amman Temple & Mandapam",
    name_ta: "அருள்மிகு மாசாணி அம்மன் திருக்கோவில் & திருமண அரங்கம்",
    location: "Temple Road, Anaimalai, Pollachi, Coimbatore",
    terrainType: "hall",
    hallLength: 44,
    hallWidth: 28,
    hallHeight: 7.5,
    defaultCapacity: 2200,
    blueprintUrl: "",
    stagePosition: [0, 0, -17],
    entrancePosition: [0, 0, 18],
    handwashPosition: [-11, 0, 15],
    timeOfDay: "morning",
    weather: "clear",
    panoramicSkyboxUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/MASANI_AMMAN.jpg/1200px-MASANI_AMMAN.jpg",
    description: "Renowned pilgrimage temple and wedding hall along the Aliyar River in Anaimalai. Known for massive festival gatherings, expansive ceremonial courtyards, and grand South Indian feast catering facilities.",
  },
  {
    id: "codissia_coimbatore",
    name: "CODISSIA Trade Fair Complex (Hall E)",
    name_ta: "கொடிசியா வர்த்தக மையம் (அரங்கம் E)",
    location: "Avinashi Road, Coimbatore",
    terrainType: "hall",
    hallLength: 50,
    hallWidth: 32,
    hallHeight: 8.5,
    defaultCapacity: 5000,
    blueprintUrl: "",
    stagePosition: [0, 0, -21],
    entrancePosition: [0, 0, 22],
    handwashPosition: [-13, 0, 19],
    timeOfDay: "sunset",
    weather: "golden_hour",
    description: "Expansive columnless convention auditorium with 50m clear span, dedicated banquet wing, and multi-bay electrical service concourse.",
  },
  {
    id: "mrc_chennai",
    name: "Mayor Ramanathan Chettiar Hall (MRC)",
    name_ta: "மேயர் ராமநாதன் செட்டியார் அரங்கம்",
    location: "R.A. Puram, Chennai",
    terrainType: "hall",
    hallLength: 42,
    hallWidth: 26,
    hallHeight: 7.2,
    defaultCapacity: 2500,
    blueprintUrl: "",
    stagePosition: [0, 0, -17],
    entrancePosition: [0, 0, 18],
    handwashPosition: [-11, 0, 15],
    timeOfDay: "morning",
    weather: "clear",
    description: "Prestigious Chettinad heritage architectural convention hall with teak acoustic panels, elevated ceremonial mandap, and dual banquet wings.",
  },
  {
    id: "krishna_pollachi",
    name: "Sri Krishna Kalyana Mandapam (AC Hall)",
    name_ta: "ஸ்ரீ கிருஷ்ணா கல்யாண மண்டபம்",
    location: "Pollachi Main Road, Coimbatore",
    terrainType: "hall",
    hallLength: 36,
    hallWidth: 24,
    hallHeight: 6.5,
    defaultCapacity: 1200,
    blueprintUrl: "",
    stagePosition: [0, 0, -14],
    entrancePosition: [0, 0, 15],
    handwashPosition: [-10, 0, 13],
    timeOfDay: "sunset",
    weather: "golden_hour",
    description: "Spacious central mandapam with Italian marble flooring, elevated stage podium, and perimeter buffet corridors.",
  },
  {
    id: "padmavathi_coimbatore",
    name: "Padmavathi Ammal Cultural Center",
    name_ta: "பத்மாவதி அம்மாள் கலாச்சார மையம்",
    location: "Peelamedu, Coimbatore",
    terrainType: "hall",
    hallLength: 40,
    hallWidth: 28,
    hallHeight: 7.5,
    defaultCapacity: 3000,
    blueprintUrl: "",
    stagePosition: [0, 0, -16],
    entrancePosition: [0, 0, 17],
    handwashPosition: [-12, 0, 14],
    timeOfDay: "night",
    weather: "festive_serial_lights",
    description: "Premium convention hall with state-of-the-art acoustic cladding, central mandap arch, and dedicated dining hall.",
  },
  {
    id: "pollachi_open_lawn",
    name: "Green Meadows 1-Acre Open Banquet Lawn",
    name_ta: "கிரீன் மெடோஸ் 1 ஏக்கர் திறந்தவெளி அரங்கம்",
    location: "Pollachi - Udumalpet Highway",
    terrainType: "open_lawn",
    hallLength: 64, // ~1 acre dimension (64m x 64m)
    hallWidth: 64,
    hallHeight: 12.0,
    acreage: 1.0,
    defaultCapacity: 3500,
    blueprintUrl: "",
    stagePosition: [0, 0, -26],
    entrancePosition: [0, 0, 28],
    handwashPosition: [-18, 0, 25],
    timeOfDay: "night",
    weather: "festive_serial_lights",
    description: "Exquisite 1-acre open-air lawn under night starlight and serial fairy lights. Unrestricted crowd capacity with perimeter live cooking islands.",
  },
  {
    id: "anaimalai_mega_ground",
    name: "Anaimalai Foothills 2.5-Acre Mega Ground",
    name_ta: "ஆனைமலை 2.5 ஏக்கர் மெகா மைதானம்",
    location: "Anaimalai Sanctuary Road",
    terrainType: "mega_ground",
    hallLength: 100, // ~2.5 acres (100m x 100m)
    hallWidth: 100,
    hallHeight: 15.0,
    acreage: 2.5,
    defaultCapacity: 15000,
    blueprintUrl: "",
    stagePosition: [0, 0, -42],
    entrancePosition: [0, 0, 44],
    handwashPosition: [-24, 0, 40],
    timeOfDay: "morning",
    weather: "clear",
    description: "Expansive 2.5-acre outdoor grounds configured for grand receptions, community conferences, and mega gatherings from 5,000 up to 1 Lakh (100,000) people.",
  },
  {
    id: "itc_grand_chola",
    name: "ITC Grand Chola (Rajendra Hall)",
    name_ta: "ஐடிசி கிராண்ட் சோழா (ராஜேந்திரா அரங்கம்)",
    location: "Guindy, Chennai",
    terrainType: "hall",
    hallLength: 48,
    hallWidth: 30,
    hallHeight: 8.0,
    defaultCapacity: 3200,
    blueprintUrl: "",
    stagePosition: [0, 0, -20],
    entrancePosition: [0, 0, 21],
    handwashPosition: [-12, 0, 18],
    timeOfDay: "night",
    weather: "clear",
    description: "Opulent palatial ballroom inspired by Chola dynasty architecture with carved granite motifs and immense pillarless banquet capacity.",
  },
  {
    id: "ganga_grandeur",
    name: "Ganga Grandeur Convention Center",
    name_ta: "கங்கா கிராண்டியூர் திருமண மண்டபம்",
    location: "Trichy Road, Coimbatore",
    terrainType: "hall",
    hallLength: 38,
    hallWidth: 25,
    hallHeight: 7.0,
    defaultCapacity: 2000,
    blueprintUrl: "",
    stagePosition: [0, 0, -15],
    entrancePosition: [0, 0, 16],
    handwashPosition: [-10, 0, 13],
    timeOfDay: "sunset",
    weather: "golden_hour",
    description: "Modern climate-controlled convention hall with high-lux LED ceiling matrices, wide concourse aisles, and dedicated live cooking bays.",
  },
];

/**
 * Procedural Architectural Blueprint Synthesizer:
 * Generates an authentic high-resolution CAD floorplan texture for any venue
 * with dimensions, stage podium, wings, entrance, tables, and compass rose.
 */
export function generateVenueBlueprintCanvas(venue: MandapamVenue): string {
  const canvas = document.createElement("canvas");
  const scale = 24; // 24 pixels per meter
  const w = Math.round(venue.hallWidth * scale);
  const l = Math.round(venue.hallLength * scale);

  canvas.width = Math.max(1024, Math.min(2048, w));
  canvas.height = Math.max(1024, Math.min(2048, l));

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const isLawn = venue.terrainType === "open_lawn" || venue.terrainType === "mega_ground";

  // 1. Background blueprint canvas (CAD Blueprint Navy or Deep Lawn Charcoal)
  ctx.fillStyle = isLawn ? "#0c1510" : "#080c18";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Minor Grid (1 meter = scale px)
  ctx.strokeStyle = isLawn ? "rgba(34, 197, 94, 0.08)" : "rgba(56, 189, 248, 0.07)";
  ctx.lineWidth = 1;
  const gridStep = Math.max(16, Math.round(canvas.width / venue.hallWidth));

  ctx.beginPath();
  for (let x = 0; x < canvas.width; x += gridStep) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (let y = 0; y < canvas.height; y += gridStep) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  ctx.stroke();

  // 3. Major Grid (5 meter blocks) with Crosshairs
  ctx.strokeStyle = isLawn ? "rgba(34, 197, 94, 0.2)" : "rgba(226, 201, 154, 0.18)";
  ctx.lineWidth = 1.5;
  const majorStep = gridStep * 5;

  ctx.beginPath();
  for (let x = 0; x < canvas.width; x += majorStep) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (let y = 0; y < canvas.height; y += majorStep) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  ctx.stroke();

  // 4. Perimeter Boundary Wall (Heavy Architectural Line)
  const pad = Math.round(gridStep * 1.5);
  const innerW = canvas.width - pad * 2;
  const innerH = canvas.height - pad * 2;

  ctx.strokeStyle = isLawn ? "#22c55e" : "#e2c99a";
  ctx.lineWidth = 4;
  ctx.strokeRect(pad, pad, innerW, innerH);

  // Outer safety offset line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(pad - 12, pad - 12, innerW + 24, innerH + 24);
  ctx.setLineDash([]);

  // 5. Stage Zone (North End)
  const stageW = Math.round(innerW * 0.65);
  const stageH = Math.round(innerH * 0.16);
  const stageX = (canvas.width - stageW) / 2;
  const stageY = pad + 15;

  // Stage fill
  ctx.fillStyle = isLawn ? "rgba(180, 83, 9, 0.25)" : "rgba(118, 41, 52, 0.35)";
  ctx.fillRect(stageX, stageY, stageW, stageH);
  ctx.strokeStyle = "#e2c99a";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(stageX, stageY, stageW, stageH);

  // Stage Label
  ctx.fillStyle = "#e2c99a";
  ctx.font = "bold 20px monospace";
  ctx.textAlign = "center";
  ctx.fillText("CEREMONIAL STAGE & MANDAP PODIUM", canvas.width / 2, stageY + stageH / 2 + 7);

  // 6. Entrance Concourse (South End)
  const entW = Math.round(innerW * 0.5);
  const entH = Math.round(innerH * 0.12);
  const entX = (canvas.width - entW) / 2;
  const entY = canvas.height - pad - entH - 15;

  ctx.fillStyle = "rgba(14, 165, 233, 0.2)";
  ctx.fillRect(entX, entY, entW, entH);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.strokeRect(entX, entY, entW, entH);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 18px monospace";
  ctx.fillText("MAIN GUEST ENTRANCE CONCOURSE", canvas.width / 2, entY + entH / 2 + 6);

  // 7. North & South Live Counter Wings
  const wingW = Math.round(innerW * 0.22);
  const wingH = Math.round(innerH * 0.45);
  const wingY = (canvas.height - wingH) / 2;

  // West Wing (North Live Food Station)
  ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
  ctx.fillRect(pad + 20, wingY, wingW, wingH);
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(pad + 20, wingY, wingW, wingH);

  // East Wing (South Live Food Station)
  ctx.fillRect(canvas.width - pad - wingW - 20, wingY, wingW, wingH);
  ctx.strokeRect(canvas.width - pad - wingW - 20, wingY, wingW, wingH);
  ctx.setLineDash([]);

  // Wing Labels
  ctx.fillStyle = "#f59e0b";
  ctx.font = "bold 14px monospace";
  ctx.save();
  ctx.translate(pad + 20 + wingW / 2, wingY + wingH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("WEST WING // LIVE DOSA & TAWA BAYS", 0, 5);
  ctx.restore();

  ctx.save();
  ctx.translate(canvas.width - pad - 20 - wingW / 2, wingY + wingH / 2);
  ctx.rotate(Math.PI / 2);
  ctx.fillText("EAST WING // STEAM & SWEET COUNTERS", 0, 5);
  ctx.restore();

  // 8. Central Dining Corridor & Banquet Table Matrix
  const centerW = innerW - (wingW + 40) * 2;
  const tableRows = 4;
  const tableCols = 3;
  const tableStartX = (canvas.width - centerW) / 2 + 30;
  const tableStartY = wingY + 30;
  const tableStepX = (centerW - 60) / Math.max(1, tableCols - 1);
  const tableStepY = (wingH - 60) / Math.max(1, tableRows - 1);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1.5;

  for (let r = 0; r < tableRows; r++) {
    for (let c = 0; c < tableCols; c++) {
      const cx = tableStartX + c * tableStepX;
      const cy = tableStartY + r * tableStepY;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // 9. Primary Service Aisle (5.5m)
  ctx.strokeStyle = "#e2c99a";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, stageY + stageH);
  ctx.lineTo(canvas.width / 2, entY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 10. Title Block (Architectural Blueprint Cartouche in Bottom Left)
  const cartW = 340;
  const cartH = 110;
  const cartX = pad + 15;
  const cartY = canvas.height - pad - cartH - 15;

  ctx.fillStyle = "rgba(9, 11, 16, 0.95)";
  ctx.fillRect(cartX, cartY, cartW, cartH);
  ctx.strokeStyle = "#e2c99a";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(cartX, cartY, cartW, cartH);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px monospace";
  ctx.textAlign = "left";
  ctx.fillText(venue.name.toUpperCase().slice(0, 36), cartX + 14, cartY + 24);

  ctx.fillStyle = "#e2c99a";
  ctx.font = "11px monospace";
  ctx.fillText(`LOCATION: ${venue.location}`, cartX + 14, cartY + 44);
  ctx.fillText(`DIMENSIONS: ${venue.hallWidth}m (W) × ${venue.hallLength}m (L) × ${venue.hallHeight}m (H)`, cartX + 14, cartY + 64);
  ctx.fillText(`CAPACITY: ${venue.defaultCapacity.toLocaleString("en-IN")} PAX // SCALE 1:${scale * 4}`, cartX + 14, cartY + 84);

  // 11. Architectural Compass Rose Vector (Top Right)
  const roseX = canvas.width - pad - 60;
  const roseY = pad + 60;
  const roseR = 36;

  ctx.strokeStyle = "#e2c99a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(roseX, roseY, roseR, 0, Math.PI * 2);
  ctx.stroke();

  // North Needle
  ctx.fillStyle = "#e2c99a";
  ctx.beginPath();
  ctx.moveTo(roseX, roseY - roseR - 10);
  ctx.lineTo(roseX + 8, roseY);
  ctx.lineTo(roseX - 8, roseY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "center";
  ctx.fillText("N", roseX, roseY - roseR - 14);

  return canvas.toDataURL("image/png");
}

/**
 * Natural Language Venue Synthesizer:
 * Analyzes spoken or typed query, resolves closest venue or procedurally generates
 * a brand new 3D spatial venue model with tailored dimensions and blueprint texture!
 */
export function synthesizeVenueFromQuery(query: string): MandapamVenue {
  const lower = query.toLowerCase();

  // 1. Direct Name Matches
  for (const preset of PRESET_VENUES) {
    const key = preset.name.toLowerCase();
    const loc = preset.location.toLowerCase();
    if (
      lower.includes(key.split(" ")[0].toLowerCase()) ||
      lower.includes(preset.id.replace(/_/g, " ")) ||
      (preset.id === "vasavi_anaimalai" &&
        (lower.includes("vasavi") ||
          lower.includes("kanyaka") ||
          lower.includes("kanika") ||
          lower.includes("parameswari") ||
          lower.includes("parameshwari"))) ||
      (preset.id === "masani_amman_anaimalai" &&
        (lower.includes("masani") || lower.includes("amman"))) ||
      (preset.id === "codissia_coimbatore" && (lower.includes("codissia") || lower.includes("trade fair"))) ||
      (preset.id === "mrc_chennai" && (lower.includes("ramanathan") || lower.includes("mrc") || lower.includes("chettiar"))) ||
      (preset.id === "itc_grand_chola" && (lower.includes("chola") || lower.includes("grand chola") || lower.includes("itc"))) ||
      (preset.id === "padmavathi_coimbatore" && lower.includes("padmavathi")) ||
      (preset.id === "ganga_grandeur" && lower.includes("ganga")) ||
      (preset.id === "krishna_pollachi" && (lower.includes("krishna") || lower.includes("pollachi hall")))
    ) {
      const blueprint = generateVenueBlueprintCanvas(preset);
      return { ...preset, blueprintUrl: blueprint };
    }
  }

  // 2. Open Lawn / Acreage detection
  const acreMatch = lower.match(/(\d+(\.\d+)?)\s*(acre|acres|ekkar)/);
  if (acreMatch || lower.includes("lawn") || lower.includes("ground") || lower.includes("outdoor")) {
    const acreage = acreMatch ? parseFloat(acreMatch[1]) : 1.0;
    const sideMeters = Math.round(Math.sqrt(acreage * 4046.86)); // Exact 1 acre = 4046.86 m²
    const venueName = query.length > 3 ? query.trim() : `${acreage} Acre Open Banquet Grounds`;

    const customLawn: MandapamVenue = {
      id: `custom_lawn_${Date.now()}`,
      name: venueName.charAt(0).toUpperCase() + venueName.slice(1),
      name_ta: `${acreage} ஏக்கர் திறந்தவெளி அரங்கம்`,
      location: "Custom Open Venue Location",
      terrainType: acreage >= 2 ? "mega_ground" : "open_lawn",
      hallLength: Math.max(45, sideMeters),
      hallWidth: Math.max(45, sideMeters),
      hallHeight: 12.0,
      acreage,
      defaultCapacity: Math.round(acreage * 3000),
      blueprintUrl: "",
      stagePosition: [0, 0, -Math.round(sideMeters * 0.4)],
      entrancePosition: [0, 0, Math.round(sideMeters * 0.42)],
      handwashPosition: [-Math.round(sideMeters * 0.28), 0, Math.round(sideMeters * 0.38)],
      timeOfDay: lower.includes("sunset") ? "sunset" : lower.includes("morning") ? "morning" : "night",
      weather: "festive_serial_lights",
      description: `Procedurally generated ${acreage}-Acre outdoor banquet footprint with perimeter live counter wings and wide central concourse.`,
    };

    customLawn.blueprintUrl = generateVenueBlueprintCanvas(customLawn);
    return customLawn;
  }

  // 3. Generic Custom Hall Synthesizer (e.g. user tells "Taj Mahal Hall", "Sri Balaji Mandapam", "Kalyana Mandapam")
  const cleanedName = query
    .replace(/(pax|guests|dosa|counters|video|screen|lighting|morning|sunset|night)/gi, "")
    .trim();
  const nameToUse = cleanedName.length >= 4 ? cleanedName : "Custom Architectural Banquet Hall";

  const customHall: MandapamVenue = {
    id: `custom_hall_${Date.now()}`,
    name: nameToUse.charAt(0).toUpperCase() + nameToUse.slice(1),
    name_ta: "தனிப்பயன் திருமண மண்டபம்",
    location: "Tamil Nadu, India",
    terrainType: "hall",
    hallLength: 42,
    hallWidth: 28,
    hallHeight: 7.2,
    defaultCapacity: 2000,
    blueprintUrl: "",
    stagePosition: [0, 0, -17],
    entrancePosition: [0, 0, 18],
    handwashPosition: [-11, 0, 15],
    timeOfDay: lower.includes("sunset") ? "sunset" : lower.includes("night") ? "night" : "morning",
    weather: "golden_hour",
    description: `Procedurally generated 3D architectural layout for ${nameToUse} with customized blueprint projection and dual-wing crowd routing.`,
  };

  customHall.blueprintUrl = generateVenueBlueprintCanvas(customHall);
  return customHall;
}

/**
 * Image-to-3D Venue Synthesizer:
 * Takes an uploaded image (data URL or external URL) representing a blueprint or venue photo,
 * determines dimensions, and synthesizes a complete 3D MandapamVenue with the image projected onto the 3D ground plane.
 */
export function synthesizeVenueFromImage(
  imageUrl: string,
  options?: {
    venueName?: string;
    aspectRatio?: number; // width / length
    estimatedWidth?: number;
    terrainType?: "hall" | "open_lawn" | "outdoor_pandal" | "mega_ground";
  }
): MandapamVenue {
  const name = options?.venueName || "Custom Projected 3D Venue";
  const w = options?.estimatedWidth || 40;
  const ratio = options?.aspectRatio && options.aspectRatio > 0 ? options.aspectRatio : 1.4;
  const l = Math.round(w / ratio);

  return {
    id: `projected_venue_${Date.now()}`,
    name,
    name_ta: "3D வரைபட அரங்கம்",
    location: "Architectural Blueprint Ingestion",
    terrainType: options?.terrainType || "hall",
    hallWidth: Math.max(20, Math.min(120, w)),
    hallLength: Math.max(20, Math.min(120, l)),
    hallHeight: 8.0,
    defaultCapacity: Math.round(w * l * 2.2),
    blueprintUrl: imageUrl,
    stagePosition: [0, 0, -Math.round(l * 0.4)],
    entrancePosition: [0, 0, Math.round(l * 0.42)],
    handwashPosition: [-Math.round(w * 0.35), 0, Math.round(l * 0.35)],
    timeOfDay: "sunset",
    weather: "golden_hour",
    description: `Custom image-to-3D projection with real architectural floorplan texture (${w}m × ${l}m footprint).`,
  };
}
