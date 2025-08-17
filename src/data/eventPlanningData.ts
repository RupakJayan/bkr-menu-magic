// Enhanced Event Planning Data Structure
export interface ClientDetails {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface VenueDetails {
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  googleMapsUrl?: string;
}

export interface EventDates {
  startDate: string;
  endDate: string;
  numberOfDays: number;
}

export interface SessionTime {
  startTime: string;
  endTime: string;
  customTime?: boolean;
}

export interface SessionPlan {
  id: string;
  sessionType: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'packing_food' | 'custom';
  sessionName: string;
  sessionNameTa: string;
  timeRange: SessionTime;
  headCount: number;
  items: string[]; // Array of selected item IDs
  notes?: string;
}

export interface DayPlan {
  date: string;
  dayNumber: number;
  sessions: SessionPlan[];
}

export interface EventPlan {
  id: string;
  clientDetails: ClientDetails;
  venueDetails: VenueDetails;
  eventDates: EventDates;
  days: DayPlan[];
  totalHeadCount: number;
  status: 'draft' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Predefined session types
export const sessionTypes = [
  {
    id: 'breakfast',
    name_en: 'Breakfast',
    name_ta: 'காலை உணவு',
    defaultStartTime: '07:00',
    defaultEndTime: '10:00',
    defaultHeadCount: 25
  },
  {
    id: 'morning_snacks',
    name_en: 'Morning Snacks',
    name_ta: 'காலை சிற்றுண்டி',
    defaultStartTime: '11:00',
    defaultEndTime: '12:00',
    defaultHeadCount: 25
  },
  {
    id: 'lunch',
    name_en: 'Lunch',
    name_ta: 'மதிய உணவு',
    defaultStartTime: '13:00',
    defaultEndTime: '16:00',
    defaultHeadCount: 45
  },
  {
    id: 'afternoon_snacks',
    name_en: 'Afternoon Snacks',
    name_ta: 'மதிய சிற்றுண்டி',
    defaultStartTime: '15:00',
    defaultEndTime: '16:00',
    defaultHeadCount: 45
  },
  {
    id: 'evening_snacks',
    name_en: 'Evening Snacks',
    name_ta: 'மாலை சிற்றுண்டி',
    defaultStartTime: '16:30',
    defaultEndTime: '17:30',
    defaultHeadCount: 45
  },
  {
    id: 'dinner',
    name_en: 'Dinner',
    name_ta: 'இரவு உணவு',
    defaultStartTime: '20:00',
    defaultEndTime: '23:00',
    defaultHeadCount: 300
  },
  {
    id: 'packing_food',
    name_en: 'Packing Food',
    name_ta: 'பேக்கிங் உணவு',
    defaultStartTime: 'As Required',
    defaultEndTime: 'As Required',
    defaultHeadCount: 50
  },
  {
    id: 'custom',
    name_en: 'Custom Session',
    name_ta: 'தனிப்பயன் அமர்வு',
    defaultStartTime: '00:00',
    defaultEndTime: '00:00',
    defaultHeadCount: 25
  }
];

// Cuisine types
export const cuisineTypes = [
  { id: 'south_indian', name_en: 'South Indian', name_ta: 'தென்னிந்திய' },
  { id: 'north_indian', name_en: 'North Indian', name_ta: 'வடஇந்திய' },
  { id: 'chettinad', name_en: 'Chettinad', name_ta: 'செட்டிநாடு' },
  { id: 'kerala', name_en: 'Kerala', name_ta: 'கேரளா' },
  { id: 'andhra', name_en: 'Andhra', name_ta: 'ஆந்திரா' },
  { id: 'karnataka', name_en: 'Karnataka', name_ta: 'கர்நாடகா' },
  { id: 'hyderabad', name_en: 'Hyderabad', name_ta: 'ஹைதராபாத்' },
  { id: 'continental', name_en: 'Continental', name_ta: 'கண்டினென்டல்' },
  { id: 'chinese', name_en: 'Chinese', name_ta: 'சீன' },
  { id: 'multi_cuisine', name_en: 'Multi Cuisine', name_ta: 'பல சமையல்' }
];

// Enhanced category mapping with cuisine types
export const enhancedCategoryMapping = {
  "Breakfast Items": {
    categories: ["Karaikudi Specials", "Dosa Varieties", "Idly Varieties", "Pongal Varieties", "Poori Varieties", "Vadai Varieties"],
    cuisines: ["south_indian", "chettinad"]
  },
  "Lunch Items": {
    categories: ["Biriyani Varieties", "Gravy Varieties", "Sambar Varieties", "Rasam Varieties", "Poriyal Varieties", "Pachadi Varieties", "Curd and Rice Items", "Dhal Varieties"],
    cuisines: ["south_indian", "chettinad", "north_indian"]
  },
  "Dinner Items": {
    categories: ["Biriyani Varieties", "Gravy Varieties", "Roti Varieties", "Starters", "Curd and Rice Items", "Poriyal Varieties"],
    cuisines: ["south_indian", "chettinad", "north_indian", "continental"]
  },
  "Snacks & Appetizers": {
    categories: ["Chutney Varieties", "Halwa Varieties", "Kesari Varieties", "Beverages", "Sweets"],
    cuisines: ["south_indian", "chettinad", "north_indian"]
  },
  "Special Items": {
    categories: ["Halwa Varieties", "Kesari Varieties", "Sweets", "Dessert"],
    cuisines: ["south_indian", "chettinad", "north_indian", "continental"]
  },
  "Packing Food": {
    categories: ["Biriyani Varieties", "Gravy Varieties", "Poriyal Varieties", "Sweets", "Dessert"],
    cuisines: ["south_indian", "chettinad", "north_indian"]
  }
};

// Helper functions
export const calculateNumberOfDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end dates
};

export const generateDefaultDayPlan = (date: string, dayNumber: number): DayPlan => {
  return {
    date,
    dayNumber,
    sessions: sessionTypes
      .filter(session => session.id !== 'custom')
      .map(session => ({
        id: `${session.id}_${dayNumber}`,
        sessionType: session.id as SessionPlan['sessionType'],
        sessionName: session.name_en,
        sessionNameTa: session.name_ta,
        timeRange: {
          startTime: session.defaultStartTime,
          endTime: session.defaultEndTime,
          customTime: false
        },
        headCount: session.defaultHeadCount,
        items: [],
        notes: ''
      }))
  };
};

export const createNewEventPlan = (): EventPlan => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return {
    id: `event_${Date.now()}`,
    clientDetails: {
      name: '',
      phone: '',
      email: '',
      address: ''
    },
    venueDetails: {
      name: '',
      address: '',
      coordinates: undefined,
      googleMapsUrl: ''
    },
    eventDates: {
      startDate: today.toISOString().split('T')[0],
      endDate: tomorrow.toISOString().split('T')[0],
      numberOfDays: 2
    },
    days: [],
    totalHeadCount: 0,
    status: 'draft',
    createdAt: today,
    updatedAt: today
  };
};
