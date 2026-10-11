// Clean, simple data models for Menu Creator

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  notes?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
  subtotal: number;
}

export interface Session {
  id: string;
  name: string;
  type:
    | "breakfast"
    | "morning_snacks"
    | "lunch"
    | "afternoon_snacks"
    | "evening_snacks"
    | "dinner"
    | "custom";
  startTime: string;
  endTime: string;
  headCount: number;
  ratePerPerson?: number;
  selectedDishes: string[];
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  sessions: Session[];
}

export interface ClientDetails {
  name: string;
  phone: string;
}

export interface VenueDetails {
  name: string;
  address: string;
  googleMapsUrl?: string;
}

export interface EventMenu {
  id: string;
  clientDetails: ClientDetails;
  venueDetails: VenueDetails;
  tamilDate?: string;
  transportCharge?: number;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  days: DayPlan[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuSummary {
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  tax: number;
  grandTotal: number;
  costPerPerson: number;
  categories: MenuCategory[];
}

export interface PDFExportData {
  menu: EventMenu;
  summary: MenuSummary;
  generatedAt: Date;
}

export type PlanningStep =
  | "event-details"
  | "session-planning"
  | "menu-selection"
  | "review"
  | "document-generation";
// ---------------------------------------------------------------------------
// Catalog + costing models
// ---------------------------------------------------------------------------

/**
 * A single dish in the catering catalog (src/data/menuData.ts).
 * Dish ids are unique across every category.
 */
export interface Dish {
  id: string;
  name_en: string;
  name_ta: string;
  isVegetarian: boolean;
  image: string;
  estimatedCost?: number;
}

/** Category name (e.g. "Dosa") mapped to the dishes in that category. */
export type MenuCatalog = Record<string, Dish[]>;

/** A catalog dish resolved together with the category it belongs to. */
export type CatalogDish = Dish & { category: string };

/** Per-dish price overrides, keyed by dish id. */
export type DishCostOverrides = Record<string, number>;

export interface SessionCostSummary {
  sessionId: string;
  sessionName: string;
  dayNumber: number;
  headCount: number;
  dishCount: number;
  estimatedTotal: number;
}

export interface EventCostSummary {
  sessions: SessionCostSummary[];
  totalSessions: number;
  totalHeadCount: number;
  totalDishes: number;
  grandTotal: number;
}
