export type StallType =
  | "dosa"
  | "idli"
  | "sweet_halwa"
  | "continental_pasta"
  | "chaat"
  | "beverage_bar"
  | "buffet_spread"
  | "dessert_icecream"
  | "dining_table";

export type BudgetTier = "economy" | "classic" | "grandeur";

export type CameraViewMode = "orbit" | "top_down" | "walkthrough";

export interface StallItem {
  id: string;
  type: StallType;
  name: string;
  name_ta: string;
  category: string;
  position: [number, number, number]; // [x, y, z] in meters on hall floor
  rotation: number; // Y-axis rotation in radians (0 = facing South)
  width: number;
  depth: number;
  height: number;
  color: string;
  accentColor: string;
  capacityPerHour: number; // guests served per hour per counter
  unitCost: number; // estimated setup & chef cost in INR
  powerRequiredKw: number;
  waterRequired: boolean;
  dishes: string[];
  dishes_ta: string[];
  tag?: string;
  wing?: "North" | "South" | "East" | "West" | "Central";
}

export interface MandapamVenue {
  id: string;
  name: string;
  name_ta: string;
  location: string;
  hallLength: number; // meters (Z axis)
  hallWidth: number; // meters (X axis)
  hallHeight: number; // meters (Y axis)
  defaultCapacity: number;
  blueprintUrl?: string; // Mandapam layout / Google Maps blueprint projection
  stagePosition: [number, number, number];
  entrancePosition: [number, number, number];
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
  totalServingCapacityPerHour: number;
  estimatedWaitMinutes: number;
  queueStatus: "optimal" | "moderate" | "congested";
  dosaCounterCount: number;
  dosaWaitMinutes: number;
  recommendedDosaCounters: number;
  budgetTier: BudgetTier;
  adviceList: RecommendationAdvice[];
}
