export type StallType =
  | "dosa"
  | "idli"
  | "sweet_halwa"
  | "continental_pasta"
  | "chaat"
  | "beverage_bar"
  | "buffet_spread"
  | "dessert_icecream"
  | "handwash_station"
  | "tamboolam_beeda"
  | "custom_stall"
  | "dining_table"
  | "dustbin"
  | "bkr_video_wall";

export type BudgetTier = "economy" | "classic" | "grandeur";

export type CameraViewMode = "orbit" | "top_down" | "walkthrough";

export type VenueTerrainType =
  | "hall" // Traditional AC Kalyana Mandapam
  | "open_lawn" // 1-Acre / Multi-Acre Open Lawn
  | "outdoor_pandal" // Traditional Thatched Coconut Leaf / German Tent Pandal
  | "mega_ground"; // Multi-Acre Mega Ground (e.g. 5,000 to 1,00,000 guests)

export type TimeOfDay = "morning" | "afternoon" | "sunset" | "night";

export type WeatherAtmosphere = "clear" | "golden_hour" | "starlight" | "festive_serial_lights";

export interface StallItem {
  id: string;
  type: StallType;
  name: string;
  name_ta: string;
  category: string;
  position: [number, number, number]; // [x, y, z] in meters on ground
  rotation: number; // Y-axis rotation in radians (0 = facing South)
  width: number;
  depth: number;
  height: number;
  color: string;
  accentColor: string;
  capacityPerHour: number; // guests served per hour per counter
  unitCost: number; // estimated setup & chef cost in INR (₹)
  powerRequiredKw: number;
  waterRequired: boolean;
  dishes: string[];
  dishes_ta: string[];
  tag?: string;
  wing?: "North" | "South" | "East" | "West" | "Central";
  customPhotoUrl?: string; // photo uploaded to generate this stall's 3D facade
  customTableTextureUrl?: string; // photo / illusion uploaded for dining table linen
}

export interface MandapamVenue {
  id: string;
  name: string;
  name_ta: string;
  location: string;
  terrainType: VenueTerrainType;
  hallLength: number; // meters (Z axis)
  hallWidth: number; // meters (X axis)
  hallHeight: number; // meters (Y axis)
  acreage?: number; // e.g. 1.0 acre, 2.5 acres
  defaultCapacity: number;
  blueprintUrl?: string; // Mandapam layout / Google Maps blueprint projection
  panoramicSkyboxUrl?: string; // 360° panoramic photo for custom background rendering
  stagePosition: [number, number, number];
  entrancePosition: [number, number, number];
  handwashPosition?: [number, number, number];
  timeOfDay?: TimeOfDay;
  weather?: WeatherAtmosphere;
  description: string;
}

export interface RecommendationAdvice {
  type: "warning" | "tip" | "upgrade";
  title: string;
  description: string;
  actionLabel?: string;
  stallTypeToAdd?: StallType;
}

export interface CapacityAnalysis {
  headCount: number;
  headCountFormatted: string; // e.g. "3,500" or "1.5 Lakhs"
  totalServingCapacityPerHour: number;
  estimatedWaitMinutes: number;
  queueStatus: "optimal" | "moderate" | "congested";
  dosaCounterCount: number;
  dosaWaitMinutes: number;
  recommendedDosaCounters: number;
  budgetTier: BudgetTier;
  costPerPlateInr: number; // e.g. ₹450 / ₹750 / ₹1,400
  totalBudgetInr: number;
  totalBudgetFormatted: string; // e.g. "₹22.5 Lakhs", "₹1.4 Crores"
  handwashRequiredCount: number;
  activeHandwashCount: number;
  adviceList: RecommendationAdvice[];
}

export type GuestLifecyclePhase =
  | "arrival"
  | "handwash"
  | "welcome_sweet"
  | "live_stalls"
  | "dining"
  | "dessert"
  | "exit_wash";
