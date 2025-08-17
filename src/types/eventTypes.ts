// Core Event Planning Types
export interface EventPlanningData {
  clientName: string;
  phoneNumber: string;
  venue: string;
  venueCoordinates?: { lat: number; lng: number };
  startDate: string;
  endDate: string;
  numberOfDays: number;
  sessionsPerDay: SessionType[];
}

export interface SessionType {
  id: string;
  name: string;
  name_ta: string;
  icon: string;
  defaultStartTime: string;
  defaultEndTime: string;
  defaultHeadCount: number;
  isSelected?: boolean;
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface SessionMenuSelection {
  sessionId: string;
  sessionName: string;
  sessionNameTa: string;
  timeWindow: TimeRange;
  headCount: number;
  selectedItems: MenuSelectionItem[];
}

export interface MenuSelectionItem {
  id: string;
  name_en: string;
  name_ta: string;
  category: string;
  isVegetarian: boolean;
}

// Legacy Types (for backward compatibility)
export interface ClientDetails {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface VenueDetails {
  name: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  googleMapsUrl?: string;
}

export interface EventDates {
  startDate: string;
  endDate: string;
  numberOfDays: number;
}

export interface EventDetails {
  eventName: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  expectedGuests: number;
  venue: string;
  description: string;
  specialRequirements: string;
}

export interface SessionPlan {
  id: string;
  sessionName: string;
  sessionNameTa: string;
  sessionType: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'packing' | 'custom';
  timeRange: TimeRange;
  headCount: number;
  selectedItems: string[];
  notes?: string;
}

export interface DayPlan {
  date: string;
  dayNumber: number;
  sessions: SessionPlan[];
}

export interface EventPlan {
  clientDetails: ClientDetails;
  venueDetails: VenueDetails;
  eventDates: EventDates;
  days: DayPlan[];
  totalHeadCount: number;
  totalSessions: number;
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
}

export type PlanningStep = 'event-details' | 'venue-details' | 'session-planning' | 'menu-selection' | 'review';

export interface MenuItem {
  id: string;
  name_en: string;
  name_ta: string;
  isVegetarian: boolean;
  image: string;
  category: string;
  subCategory?: string;
  cuisineType: 'south-indian' | 'north-indian' | 'chettinad' | 'continental' | 'chinese' | 'other';
  price?: number;
  description?: string;
  allergens?: string[];
  isAvailable: boolean;
}

export interface MenuCategory {
  name: string;
  name_ta: string;
  items: MenuItem[];
  icon: string;
}

export interface CuisineType {
  id: string;
  name: string;
  name_ta: string;
  icon: string;
}

export interface PDFExportOptions {
  language: 'en' | 'ta';
  includeImages: boolean;
  includePricing: boolean;
  format: 'A4' | 'Letter';
}
