// Enhanced Event Menu Data Structure for Session-based Planning
export interface MenuItem {
  id: string;
  name_en: string;
  name_ta: string;
  category: string;
  subCategory: string;
  isVegetarian: boolean;
  image: string;
  description?: string;
}

export interface Session {
  id: string;
  name_en: string;
  name_ta: string;
  time: string;
  categories: string[];
}

export interface SelectedItem {
  itemId: string;
  quantity: number;
  notes?: string;
}

export interface SessionSelection {
  sessionId: string;
  items: SelectedItem[];
  headCount: number;
  timing: string;
}

// Event Sessions
export const eventSessions: Session[] = [
  {
    id: "breakfast",
    name_en: "Breakfast",
    name_ta: "காலை உணவு",
    time: "7:30 AM",
    categories: ["Karaikudi Specials", "Dosa Varieties", "Idly Varieties", "Pongal Varieties", "Poori Varieties", "Vadai Varieties"]
  },
  {
    id: "morning_snacks",
    name_en: "Morning Snacks",
    name_ta: "காலை சிற்றுண்டி",
    time: "11:00 AM",
    categories: ["Chutney Varieties", "Halwa Varieties", "Kesari Varieties", "Beverages"]
  },
  {
    id: "lunch",
    name_en: "Lunch",
    name_ta: "மதிய உணவு",
    time: "1:00 PM",
    categories: ["Biriyani Varieties", "Gravy Varieties", "Sambar Varieties", "Rasam Varieties", "Poriyal Varieties", "Pachadi Varieties", "Curd and Rice Items", "Dhal Varieties"]
  },
  {
    id: "afternoon_snacks",
    name_en: "Afternoon Snacks",
    name_ta: "மதிய சிற்றுண்டி",
    time: "3:00 PM",
    categories: ["Chutney Varieties", "Halwa Varieties", "Kesari Varieties", "Beverages", "Sweets"]
  },
  {
    id: "evening_snacks",
    name_en: "Evening Snacks",
    name_ta: "மாலை சிற்றுண்டி",
    time: "4:30 PM",
    categories: ["Chutney Varieties", "Halwa Varieties", "Kesari Varieties", "Beverages", "Sweets", "Dessert"]
  },
  {
    id: "dinner",
    name_en: "Dinner",
    name_ta: "இரவு உணவு",
    time: "8:00 PM",
    categories: ["Biriyani Varieties", "Gravy Varieties", "Roti Varieties", "Starters", "Curd and Rice Items", "Poriyal Varieties"]
  },
  {
    id: "packing_food",
    name_en: "Packing Food",
    name_ta: "பேக்கிங் உணவு",
    time: "As Required",
    categories: ["Biriyani Varieties", "Gravy Varieties", "Poriyal Varieties", "Sweets", "Dessert"]
  }
];

// Category mapping for better organization
export const categoryMapping = {
  "Sweets": ["Halwa Varieties", "Kesari Varieties", "Sweets"],
  "Starters": ["Starters", "Vadai Varieties"],
  "Poriyal": ["Poriyal Varieties"],
  "Pachadi": ["Pachadi Varieties"],
  "Gravies": ["Gravy Varieties", "Sambar Varieties", "Rasam Varieties"],
  "Chutneys": ["Chutney Varieties"],
  "Main Items": ["Biriyani Varieties", "Dosa Varieties", "Idly Varieties", "Pongal Varieties", "Poori Varieties"],
  "Accompaniments": ["Curd and Rice Items", "Dhal Varieties", "Pickles Varieties"],
  "Beverages": ["Beverages"],
  "Desserts": ["Dessert"]
};

// Default head counts for different event types
export const defaultHeadCounts = {
  "breakfast": 25,
  "lunch": 45,
  "dinner": 300,
  "morning_snacks": 25,
  "afternoon_snacks": 45,
  "evening_snacks": 45,
  "packing_food": 50
};
