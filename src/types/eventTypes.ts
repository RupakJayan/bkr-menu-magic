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
  // Enhanced fields
  eventType?: 'wedding' | 'corporate' | 'birthday' | 'anniversary' | 'other';
  specialRequirements?: string;
  budget?: number;
  paymentTerms?: string;
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
  // Enhanced fields
  customTiming?: boolean;
  specialInstructions?: string;
  dietaryRestrictions?: string[];
  serviceStaff?: number;
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
  // Enhanced fields
  customTiming?: boolean;
  specialInstructions?: string;
  dietaryRestrictions?: string[];
  serviceStaff?: number;
  estimatedCost?: number;
  notes?: string;
}

export interface MenuSelectionItem {
  id: string;
  name_en: string;
  name_ta: string;
  category: string;
  isVegetarian: boolean;
  // Enhanced fields
  estimatedCost?: number;
  preparationTime?: number;
  spiceLevel?: 'mild' | 'medium' | 'hot';
  allergens?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
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
  id: string;
  name_en: string;
  name_ta: string;
  icon: string;
  description?: string;
  items: MenuSelectionItem[];
}

export interface DietaryRestriction {
  id: string;
  name_en: string;
  name_ta: string;
  description?: string;
  icon: string;
}

export interface ServiceStaff {
  id: string;
  role: string;
  role_ta: string;
  hourlyRate: number;
  description?: string;
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

// New types for enhanced features
export interface BillingItem {
  sessionId: string;
  sessionName: string;
  headCount: number;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
  serviceStaffCost: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface EventBilling {
  eventId: string;
  clientName: string;
  eventDate: string;
  totalSessions: number;
  totalHeadCount: number;
  billingItems: BillingItem[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  paymentTerms: string;
  dueDate: string;
}
