import {
  StallType,
  StallItem,
  MandapamVenue,
  BudgetTier,
  CapacityAnalysis,
  RecommendationAdvice,
} from "@/types/planner3d";

export const STALL_CATALOG: Record<
  StallType,
  Omit<StallItem, "id" | "position" | "rotation" | "wing">
> = {
  dosa: {
    type: "dosa",
    name: "Live Dosa Station",
    name_ta: "நேரடி தோசை அரங்கம்",
    category: "Live Tawa",
    width: 3.2,
    depth: 1.6,
    height: 2.2,
    color: "#f59e0b",
    accentColor: "#ef4444",
    capacityPerHour: 80,
    unitCost: 18000,
    powerRequiredKw: 6.0,
    waterRequired: true,
    dishes: [
      "Ghee Roast Dosa",
      "Podi Dosa",
      "Kari / Mushroom Dosa",
      "Onion Uthappam",
      "Tomato / Coconut / Coriander Chutneys (3 varieties)",
      "Madras Tiffin Sambar",
    ],
    dishes_ta: [
      "நெய் ரோஸ்ட் தோசை",
      "பொடி தோசை",
      "காளான் தோசை",
      "வெங்காய ஊத்தப்பம்",
      "3 வகை சட்னிகள்",
      "மதராஸ் சாம்பார்",
    ],
    tag: "High Demand Live Station",
  },
  idli: {
    type: "idli",
    name: "Heritage Idli Steamer Bar",
    name_ta: "பாரம்பரிய இட்லி ஆவி அரங்கம்",
    category: "Steam Specials",
    width: 2.4,
    depth: 1.4,
    height: 2.0,
    color: "#e2e8f0",
    accentColor: "#10b981",
    capacityPerHour: 150,
    unitCost: 12000,
    powerRequiredKw: 4.5,
    waterRequired: true,
    dishes: [
      "Kanchipuram Thatte Idli",
      "Mini Ghee Sambar Idli (14 pcs cup)",
      "Podi Idli with Cold Pressed Sesame Oil",
      "Vada Podi & Chutney Assortment",
    ],
    dishes_ta: [
      "காஞ்சிபுரம் தட்டே இட்லி",
      "மினி நெய் சாம்பார் இட்லி",
      "நெய் பொடி இட்லி",
      "மெது வடை",
    ],
    tag: "Continuous Throughput",
  },
  sweet_halwa: {
    type: "sweet_halwa",
    name: "Live Halwa & Sweet Kadai",
    name_ta: "சூடான அல்வா & இனிப்பு கடை",
    category: "Live Sweets",
    width: 2.8,
    depth: 1.5,
    height: 2.1,
    color: "#d97706",
    accentColor: "#b45309",
    capacityPerHour: 140,
    unitCost: 22000,
    powerRequiredKw: 3.5,
    waterRequired: false,
    dishes: [
      "Piping Hot Wheat Halwa (Tirunelveli Style)",
      "Elaneer Payasam Shot Glass",
      "Asoka Halwa with Roasted Cashews",
      "Kesar Jalebi with Rabdi",
    ],
    dishes_ta: [
      "திருநெல்வேலி கோதுமை அல்வா",
      "இளநீர் பாயாசம்",
      "அசோகா அல்வா",
      "கேசர் ஜிலேபி",
    ],
    tag: "Crowd Magnet Welcome Counter",
  },
  continental_pasta: {
    type: "continental_pasta",
    name: "Live Continental Pasta & Grill",
    name_ta: "கான்டினென்டல் பாஸ்தா அரங்கம்",
    category: "Global Gourmet",
    width: 3.0,
    depth: 1.5,
    height: 2.2,
    color: "#c5a059",
    accentColor: "#d4af37",
    capacityPerHour: 90,
    unitCost: 25000,
    powerRequiredKw: 7.0,
    waterRequired: true,
    dishes: [
      "Penne Arrabbiata (Fire Roasted Garlic)",
      "Fusilli Alfredo with Broccoli & Corn",
      "Cheesy Herb Garlic Breadsticks",
      "Grilled Paneer Skewers with Chimichurri",
    ],
    dishes_ta: [
      "பென்னே அராபியாட்டா பாஸ்தா",
      "அல்ஃப்ரெடோ பாஸ்தா",
      "கார்லிக் பிரெட்",
      "கிரில்டு பன்னீர்",
    ],
    tag: "Youth & Kids Favorite",
  },
  chaat: {
    type: "chaat",
    name: "Live Chaat & Pani Puri Corner",
    name_ta: "சாட் & பானி பூரி கார்னர்",
    category: "Street Savouries",
    width: 2.6,
    depth: 1.4,
    height: 2.1,
    color: "#16a34a",
    accentColor: "#22c55e",
    capacityPerHour: 120,
    unitCost: 15000,
    powerRequiredKw: 2.0,
    waterRequired: true,
    dishes: [
      "4-Flavour Pani Puri (Hing, Pudina, Khatta Meetha, Jeera)",
      "Dahi Papdi Chaat with Pomegranate Pearls",
      "Delhi Raj Kachori Supreme",
      "Samosa Chana Chaat",
    ],
    dishes_ta: [
      "4 சுவை பானி பூரி",
      "தஹி பாப்படி சாட்",
      "ராஜ் கச்சோரி",
      "சமோசா சனா சாட்",
    ],
    tag: "Pre-Dinner Reception Essential",
  },
  beverage_bar: {
    type: "beverage_bar",
    name: "Filter Coffee & Mocktail Bar",
    name_ta: "கும்பகோணம் டிகிரி காபி & மாாக்டெயில்",
    category: "Beverages",
    width: 2.5,
    depth: 1.4,
    height: 2.3,
    color: "#854d0e",
    accentColor: "#eab308",
    capacityPerHour: 200,
    unitCost: 14000,
    powerRequiredKw: 5.0,
    waterRequired: true,
    dishes: [
      "Kumbakonam Degree Filter Coffee in Brass Dabara",
      "Fresh Tender Coconut Punch with Nungu",
      "Spiced Sukku Malli Tea",
      "Blue Curacao Mojito",
    ],
    dishes_ta: [
      "கும்பகோணம் டிகிரி காபி",
      "இளநீர் நொங்கு பஞ்ச்",
      "சுக்கு மல்லி காபி",
      "ப்ளூ குராக்கோ மாாக்டெயில்",
    ],
    tag: "Signature Refreshment Station",
  },
  buffet_spread: {
    type: "buffet_spread",
    name: "Royal Grand Buffet Main Line",
    name_ta: "ராயல் கிராண்ட் பஃபே முதன்மை வரிசை",
    category: "Main Course",
    width: 5.5,
    depth: 1.8,
    height: 2.2,
    color: "#762934",
    accentColor: "#d8b36d",
    capacityPerHour: 250,
    unitCost: 35000,
    powerRequiredKw: 8.0,
    waterRequired: false,
    dishes: [
      "Bisibelebath with Boondi & Appalam",
      "Chettinad Veg Biryani with Onion Raitha",
      "Steamed Ponni Rice with Mor Kuzhambu & Rasam",
      "Urulai Roast & Poriyal Varieties",
      "Curd Rice with Pomegranate & Vadu Mango Pickle",
    ],
    dishes_ta: [
      "பிசிபேளேபாத் & காராபூந்தி",
      "செட்டிநாடு வெஜ் பிரியாணி & ரைத்தா",
      "பொன்னி சாதம் & மோர் குழம்பு, ரசம்",
      "உருளை வறுவல் & கூட்டு",
      "தயிர் சாதம் & வடு மாங்காய் ஊறுகாய்",
    ],
    tag: "Dual-Sided Island Buffet",
  },
  dessert_icecream: {
    type: "dessert_icecream",
    name: "Cold Stone Ice Cream & Dessert Cart",
    name_ta: "ஐஸ்கிரீம் & குளிர்பான வண்டி",
    category: "Dessert Parlour",
    width: 2.4,
    depth: 1.4,
    height: 2.1,
    color: "#ec4899",
    accentColor: "#f472b6",
    capacityPerHour: 180,
    unitCost: 16000,
    powerRequiredKw: 4.0,
    waterRequired: false,
    dishes: [
      "Cold Stone Mixed Fruit & Nut Blast",
      "Paan Flavoured Kulfi Stick",
      "Gulab Jamun with Vanilla Ice Cream",
      "Exotic Fruit Tartlets",
    ],
    dishes_ta: [
      "கோல்ட் ஸ்டோன் ஐஸ்கிரீம்",
      "பான் குல்பி",
      "குலாப் ஜாமுன் ஐஸ்கிரீம்",
      "பழ டார்ட்லெட்",
    ],
    tag: "Grand Finale Station",
  },
  handwash_station: {
    type: "handwash_station",
    name: "Pedal Handwash & Towel Station",
    name_ta: "பாரம்பரிய கை கழுவும் இடம்",
    category: "Hygiene & Sanitation",
    width: 3.0,
    depth: 1.2,
    height: 1.8,
    color: "#0f766e",
    accentColor: "#14b8a6",
    capacityPerHour: 350,
    unitCost: 8500,
    powerRequiredKw: 1.0,
    waterRequired: true,
    dishes: ["Herbal Vetiver Handwash", "Warm Cotton Hand Towels"],
    dishes_ta: ["வெட்டிவேர் கை கழுவும் நீர்", "பருத்தி கை துண்டுகள்"],
    tag: "Mandatory Entrance & Exit Station",
  },
  tamboolam_beeda: {
    type: "tamboolam_beeda",
    name: "Tamboolam Bag & Sweet Beeda Stall",
    name_ta: "தாம்பூல பை & இனிப்பு பீடா அரங்கம்",
    category: "Exit Reception",
    width: 2.4,
    depth: 1.3,
    height: 2.0,
    color: "#831843",
    accentColor: "#f43f5e",
    capacityPerHour: 300,
    unitCost: 11000,
    powerRequiredKw: 1.0,
    waterRequired: false,
    dishes: ["Calcutta Meetha Paan (No Tobacco)", "Traditional Tamboolam Bag with Coconut"],
    dishes_ta: ["கல்கத்தா இனிப்பு பீடா", "பாரம்பரிய தாம்பூல பை"],
    tag: "Auspicious Departure Gift Counter",
  },
  custom_stall: {
    type: "custom_stall",
    name: "Custom Generated 3D Stall",
    name_ta: "தனிப்பயன் 3D அரங்கம்",
    category: "Custom Specialty",
    width: 2.8,
    depth: 1.5,
    height: 2.2,
    color: "#8b5cf6",
    accentColor: "#a855f7",
    capacityPerHour: 100,
    unitCost: 20000,
    powerRequiredKw: 4.0,
    waterRequired: true,
    dishes: ["Specialty Live Preparation"],
    dishes_ta: ["சிறப்பு நேரடி உணவு தயாரிப்பு"],
    tag: "Photo-Generated Custom Stall",
  },
  dining_table: {
    type: "dining_table",
    name: "Banquet Round Table (8-Seater)",
    name_ta: "விருந்து வட்ட மேசை (8 இருக்கை)",
    category: "Seating",
    width: 2.2,
    depth: 2.2,
    height: 1.1,
    color: "#64748b",
    accentColor: "#cbd5e1",
    capacityPerHour: 32,
    unitCost: 4500,
    powerRequiredKw: 0,
    waterRequired: false,
    dishes: ["Table Water Carafes", "Banana Leaf / Fine Bone China Cutlery"],
    dishes_ta: ["மேசை குடிநீர்", "வாழை இலை / பீங்கான் தட்டுகள்"],
    tag: "Guest Seating Cluster",
  },
  dustbin: {
    type: "dustbin",
    name: "Eco Stainless Pedal Dustbin",
    name_ta: "சுற்றுச்சூழல் குப்பைத் தொட்டி",
    category: "Sanitation & Waste",
    width: 0.7,
    depth: 0.7,
    height: 1.0,
    color: "#334155",
    accentColor: "#22c55e",
    capacityPerHour: 600,
    unitCost: 1500,
    powerRequiredKw: 0,
    waterRequired: false,
    dishes: ["Recyclable Food Waste Disposal", "Paper Napkin Drop"],
    dishes_ta: ["உணவு கழிவு மேலாண்மை", "காகித துடைப்பான்"],
    tag: "Eco Cleanliness Station",
  },
  bkr_video_wall: {
    type: "bkr_video_wall",
    name: "BKR Catering 3D Video Wall & Reel Screen",
    name_ta: "BKR கேட்டரிங் 3D வீடியோ சுவர்",
    category: "Brand Showcase",
    width: 6.2,
    depth: 0.6,
    height: 3.8,
    color: "#0f172a",
    accentColor: "#d8b36d",
    capacityPerHour: 5000,
    unitCost: 45000,
    powerRequiredKw: 3.0,
    waterRequired: false,
    dishes: ["@bkr_events_ Instagram Reels Loop", "Signature Wedding Feast Highlights"],
    dishes_ta: ["இன்ஸ்டாகிராம் ரீல்ஸ் நேரடி காட்சி", "திருமண விருந்து தருணங்கள்"],
    tag: "BKR Brand Experience Wall",
  },
};

export const PRESET_VENUES: MandapamVenue[] = [
  {
    id: "krishna_pollachi",
    name: "Sri Krishna Kalyana Mandapam (AC Hall)",
    name_ta: "ஸ்ரீ கிருஷ்ணா கல்யாண மண்டபம்",
    location: "Pollachi Main Road, Coimbatore",
    terrainType: "hall",
    hallLength: 36,
    hallWidth: 24,
    hallHeight: 6.5,
    defaultCapacity: 600,
    blueprintUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    stagePosition: [0, 0, -14],
    entrancePosition: [0, 0, 16],
    handwashPosition: [-10, 0, 14],
    timeOfDay: "morning",
    weather: "clear",
    description:
      "Spacious pillarless convention hall with dedicated dining courtyard, dual wing power distribution, and perimeter service corridors.",
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
    blueprintUrl: "https://images.unsplash.com/photo-1545232979-fbf6c615ad8e?auto=format&fit=crop&w=1200&q=80",
    stagePosition: [0, 0, -26],
    entrancePosition: [0, 0, 28],
    handwashPosition: [-18, 0, 26],
    timeOfDay: "night",
    weather: "festive_serial_lights",
    description:
      "Exquisite 1-acre open-air lawn under night starlight and serial fairy lights. Unrestricted crowd capacity with perimeter live cooking islands.",
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
    blueprintUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    stagePosition: [0, 0, -42],
    entrancePosition: [0, 0, 44],
    handwashPosition: [-24, 0, 40],
    timeOfDay: "morning",
    weather: "clear",
    description:
      "Expansive 2.5-acre outdoor grounds configured for grand receptions, community conferences, and mega gatherings from 5,000 up to 1 Lakh (1,00,000) people.",
  },
];

/**
 * Format Indian currency amounts into Lakhs or Crores cleanly.
 */
export function formatInrCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Crores`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatIndianNumber(num: number): string {
  if (num >= 100000) {
    return `${(num / 100000).toFixed(1)} Lakh`;
  }
  return num.toLocaleString("en-IN");
}

/**
 * Calculates serving throughput, bottleneck queue wait times, and triggers
 * automatic counter duplication for South Indian wedding and buffet venues.
 */
export function calculateCapacityAnalysis(
  headCount: number,
  stalls: StallItem[],
  budgetTier: BudgetTier
): CapacityAnalysis {
  const safeHeadCount = Math.max(50, headCount);

  // Count active live stations
  const dosaCounters = stalls.filter((s) => s.type === "dosa");
  const dosaCount = dosaCounters.length;

  const handwashCounters = stalls.filter((s) => s.type === "handwash_station");
  const handwashCount = handwashCounters.length;
  const recommendedHandwash = Math.max(1, Math.ceil(safeHeadCount / 300));

  // Rate per plate in Indian Rupees (₹)
  const costPerPlateInr =
    budgetTier === "economy" ? 380 : budgetTier === "classic" ? 650 : 1250;
  const totalBudgetInr = safeHeadCount * costPerPlateInr;
  const totalBudgetFormatted = formatInrCurrency(totalBudgetInr);

  // Dosa throughput: ~80 dosas/hr per station
  const dosaThroughputPerHour = Math.max(1, dosaCount * 80);
  const dosaWaitMinutes = Math.round(
    ((safeHeadCount * 0.7) / (dosaThroughputPerHour / 60)) * (1 / Math.max(1, dosaCount))
  );

  // Scalable Dosa counter recommendation (supporting up to 1,00,000 guests)
  let recommendedDosaCounters = 1;
  if (safeHeadCount >= 10000) {
    recommendedDosaCounters = Math.min(24, Math.ceil(safeHeadCount / 600));
  } else if (safeHeadCount >= 2500) {
    recommendedDosaCounters = 6;
  } else if (safeHeadCount > 850) {
    recommendedDosaCounters = 4;
  } else if (safeHeadCount > 450) {
    recommendedDosaCounters = 3;
  } else if (safeHeadCount > 180) {
    recommendedDosaCounters = 2; // North & South wings
  }

  // Hall food throughput per hour
  const totalServingCapacityPerHour = stalls.reduce(
    (sum, s) => sum + (s.type === "dining_table" || s.type === "handwash_station" ? 0 : s.capacityPerHour),
    0
  );

  const estimatedWaitMinutes = Math.min(
    45,
    Math.max(2, Math.round((safeHeadCount / Math.max(100, totalServingCapacityPerHour)) * 36))
  );

  let queueStatus: "optimal" | "moderate" | "congested" = "optimal";
  if (estimatedWaitMinutes > 15 || (dosaCount < recommendedDosaCounters && dosaWaitMinutes > 18)) {
    queueStatus = "congested";
  } else if (estimatedWaitMinutes > 8 || dosaCount < recommendedDosaCounters) {
    queueStatus = "moderate";
  }

  const adviceList: RecommendationAdvice[] = [];

  // Handwash ritual advice (first ritual for South Indian feasts)
  if (handwashCount < recommendedHandwash) {
    adviceList.push({
      type: "warning",
      title: `Sanitation Alert: Handwash Station Needed (${handwashCount} active vs ${recommendedHandwash} recommended)`,
      description: `For ${formatIndianNumber(safeHeadCount)} guests, South Indian tradition demands handwashing before and after meals. Add dedicated pedal-operated washbasins near the entrance concourse.`,
      actionLabel: `Add Handwash Station`,
      stallTypeToAdd: "handwash_station",
    });
  }

  // Dosa counter bottleneck advice
  if (dosaCount < recommendedDosaCounters) {
    adviceList.push({
      type: "warning",
      title: `Critical Bottleneck: Duplicate Live Dosa Counter (${dosaCount} active vs ${recommendedDosaCounters} needed)`,
      description: `With ${formatIndianNumber(safeHeadCount)} guests, single/insufficient Dosa stations cause an estimated ${dosaWaitMinutes}-minute wait line! We strongly recommend duplicating into symmetrical wings (North + South) to keep waiting under 4 minutes.`,
      actionLabel: `Add ${recommendedDosaCounters - dosaCount}x Dosa Counter`,
      stallTypeToAdd: "dosa",
    });
  } else {
    adviceList.push({
      type: "tip",
      title: `Optimal Dosa Balance (${dosaCount} Stations Deployed)`,
      description: `Your ${dosaCount} live tawa stations can serve up to ${dosaCount * 80} dosas/hr across balanced wings, guaranteeing zero crowd congestion.`,
    });
  }

  // Tamboolam Bag exit counter
  const tamboolamCount = stalls.filter((s) => s.type === "tamboolam_beeda").length;
  if (tamboolamCount === 0 && safeHeadCount > 250) {
    adviceList.push({
      type: "tip",
      title: "Add Tamboolam & Sweet Beeda Station at Exit",
      description:
        "Provide a memorable departure experience with fresh Calcutta sweet beeda and auspicious Tamboolam gift bags at the exit arch.",
      actionLabel: "Add Tamboolam Stall",
      stallTypeToAdd: "tamboolam_beeda",
    });
  }

  return {
    headCount: safeHeadCount,
    headCountFormatted: formatIndianNumber(safeHeadCount),
    totalServingCapacityPerHour,
    estimatedWaitMinutes,
    queueStatus,
    dosaCounterCount: dosaCount,
    dosaWaitMinutes,
    recommendedDosaCounters,
    budgetTier,
    costPerPlateInr,
    totalBudgetInr,
    totalBudgetFormatted,
    handwashRequiredCount: recommendedHandwash,
    activeHandwashCount: handwashCount,
    adviceList,
  };
}

/**
 * Generates an intelligent, ready-to-render initial layout of 3D stalls tailored
 * to the venue geometry, guest headcount, and budget.
 */
export function getRecommendedStalls(
  headCount: number,
  budgetTier: BudgetTier,
  venue: MandapamVenue
): StallItem[] {
  const result: StallItem[] = [];
  const halfW = venue.hallWidth / 2 - 3;
  const halfL = venue.hallLength / 2 - 4;

  let stallCounter = 1;
  const makeId = (type: string) => `${type}-${stallCounter++}`;

  // 1. Mandatory Entrance Handwash Station (The first ritual stop!)
  result.push({
    ...STALL_CATALOG.handwash_station,
    id: makeId("handwash-entry"),
    position: [-halfW + 2, 0, halfL - 2],
    rotation: 0,
    wing: "West",
    tag: "Entrance Handwash",
  });

  // 2. Royal Grand Buffet Spread (Center island)
  result.push({
    ...STALL_CATALOG.buffet_spread,
    id: makeId("buffet"),
    position: [0, 0, 0],
    rotation: 0,
    wing: "Central",
    tag: "Dual-Sided Main Island Buffet",
  });

  // 3. Live Dosa Station #1 (North / Left Wing)
  result.push({
    ...STALL_CATALOG.dosa,
    id: makeId("dosa-north"),
    name: "Live Dosa Station (North Wing)",
    position: [-halfW, 0, -4],
    rotation: Math.PI / 2,
    wing: "North",
    tag: "Counter #1",
  });

  // 4. Automatically duplicate Dosa Counter if headcount > 180!
  if (headCount > 180) {
    result.push({
      ...STALL_CATALOG.dosa,
      id: makeId("dosa-south"),
      name: "Live Dosa Station (South Wing - Duplicate)",
      position: [halfW, 0, -4],
      rotation: -Math.PI / 2,
      wing: "South",
      tag: "Counter #2 (Crowd Balancer)",
    });
  }

  // Mega crowd duplication for >1000 guests
  if (headCount > 1000) {
    result.push({
      ...STALL_CATALOG.dosa,
      id: makeId("dosa-east"),
      name: "Live Dosa Station (East Wing - Counter #3)",
      position: [-halfW, 0, 4],
      rotation: Math.PI / 2,
      wing: "East",
      tag: "Counter #3",
    });
    result.push({
      ...STALL_CATALOG.dosa,
      id: makeId("dosa-west"),
      name: "Live Dosa Station (West Wing - Counter #4)",
      position: [halfW, 0, 4],
      rotation: -Math.PI / 2,
      wing: "West",
      tag: "Counter #4",
    });
  }

  // 5. Live Halwa & Sweet Kadai (Welcome station)
  result.push({
    ...STALL_CATALOG.sweet_halwa,
    id: makeId("halwa"),
    position: [-halfW + 4, 0, halfL - 3],
    rotation: 0,
    wing: "West",
    tag: "Welcome Sweet Counter",
  });

  // 6. Filter Coffee & Mocktail Bar (Opposite entrance)
  result.push({
    ...STALL_CATALOG.beverage_bar,
    id: makeId("beverage"),
    position: [halfW - 2, 0, halfL - 2],
    rotation: 0,
    wing: "East",
    tag: "Aroma Coffee Counter",
  });

  // 7. Idli Steamer Bar (Left Wing)
  result.push({
    ...STALL_CATALOG.idli,
    id: makeId("idli"),
    position: [-halfW, 0, 2],
    rotation: Math.PI / 2,
    wing: "North",
  });

  // 8. Live Chaat Corner (Right Wing)
  result.push({
    ...STALL_CATALOG.chaat,
    id: makeId("chaat"),
    position: [halfW, 0, 2],
    rotation: -Math.PI / 2,
    wing: "South",
  });

  // 9. Dessert & Cold Stone Ice Cream Parlour
  result.push({
    ...STALL_CATALOG.dessert_icecream,
    id: makeId("dessert"),
    position: [halfW, 0, -10],
    rotation: -Math.PI / 2,
    wing: "South",
  });

  // 10. Tamboolam & Sweet Beeda Station at exit
  result.push({
    ...STALL_CATALOG.tamboolam_beeda,
    id: makeId("tamboolam"),
    position: [halfW - 4, 0, halfL - 3],
    rotation: 0,
    wing: "East",
    tag: "Auspicious Departure Gift",
  });

  // 11. Grandeur Add-on (Continental Pasta)
  if (budgetTier !== "economy") {
    result.push({
      ...STALL_CATALOG.continental_pasta,
      id: makeId("continental"),
      position: [-halfW, 0, -10],
      rotation: Math.PI / 2,
      wing: "North",
      tag: "Chef Specialty",
    });
  }

  // 12. Banquet Dining Tables distributed neatly in open floor zones
  const tablePositions: [number, number, number][] = [
    [-6, 0, -8],
    [6, 0, -8],
    [-6, 0, 8],
    [6, 0, 8],
  ];

  tablePositions.forEach((pos, idx) => {
    result.push({
      ...STALL_CATALOG.dining_table,
      id: makeId(`table-${idx + 1}`),
      name: `Dining Table Cluster ${idx + 1}`,
      position: pos,
      rotation: 0,
      wing: "Central",
    });
  });

  // 13. Eco Pedal Dustbins Placed Near Dining Tables & Handwash Area
  const dustbinPositions: [number, number, number][] = [
    [-8, 0, -8], // Beside Table Cluster 1
    [8, 0, -8],  // Beside Table Cluster 2
    [-halfW + 3.5, 0, halfL - 2], // Beside Handwash Station
    [halfW - 2.5, 0, -9], // Beside Dessert Cart
  ];

  dustbinPositions.forEach((pos, idx) => {
    result.push({
      ...STALL_CATALOG.dustbin,
      id: makeId(`dustbin-${idx + 1}`),
      name: `Sanitary Dustbin #${idx + 1}`,
      position: pos,
      rotation: 0,
      wing: idx % 2 === 0 ? "North" : "South",
    });
  });

  // 14. BKR Catering 3D Video Wall & Reel Screen (Prominently mounted flank wall)
  result.push({
    ...STALL_CATALOG.bkr_video_wall,
    id: makeId("bkr-video-wall"),
    name: "BKR Catering 3D Video Wall (@bkr_events_)",
    position: [halfW + 0.5, 0, -halfL + 6],
    rotation: -Math.PI / 2,
    wing: "East",
    tag: "BKR Royal LED Media Wall",
  });

  return result;
}
