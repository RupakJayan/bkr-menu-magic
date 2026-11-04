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
    color: "#f59e0b", // Golden Tawa
    accentColor: "#ef4444",
    capacityPerHour: 80, // ~80 dosas / hr per station
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
    color: "#e2e8f0", // Clean Steam White
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
    color: "#d97706", // Amber Halwa Brass
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
    color: "#0284c7", // Sapphire Modern
    accentColor: "#38bdf8",
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
    color: "#16a34a", // Mint Emerald
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
    color: "#854d0e", // Rich Roasted Brass
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
    color: "#762934", // BKR Imperial Burgundy
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
    color: "#ec4899", // Raspberry Pink
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
};

export const PRESET_VENUES: MandapamVenue[] = [
  {
    id: "krishna_pollachi",
    name: "Sri Krishna Kalyana Mandapam",
    name_ta: "ஸ்ரீ கிருஷ்ணா கல்யாண மண்டபம்",
    location: "Pollachi Main Road, Coimbatore",
    hallLength: 36, // meters
    hallWidth: 24, // meters
    hallHeight: 6.5,
    defaultCapacity: 600,
    blueprintUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    stagePosition: [0, 0, -14],
    entrancePosition: [0, 0, 16],
    description:
      "Spacious pillarless convention hall with dedicated dining courtyard, dual wing power distribution, and perimeter service corridors. Popular for 400-800 guest weddings.",
  },
  {
    id: "anaimalai_palace",
    name: "Anaimalai Royal Palace & Banquet",
    name_ta: "ஆனைமலை ராயல் அரண்மனை மண்டபம்",
    location: "Anaimalai Foothills Highway",
    hallLength: 42,
    hallWidth: 28,
    hallHeight: 7.2,
    defaultCapacity: 1000,
    blueprintUrl: "https://images.unsplash.com/photo-1545232979-fbf6c615ad8e?auto=format&fit=crop&w=1200&q=80",
    stagePosition: [0, 0, -17],
    entrancePosition: [0, 0, 19],
    description:
      "Grand imperial mandapam featuring an ornate center courtyard, marble aisles, and dual symmetrical service wings suitable for live cooking stations.",
  },
  {
    id: "coimbatore_grand",
    name: "Coimbatore Grand Convention Center",
    name_ta: "கோயம்புத்தூர் கிராண்ட் மாநாட்டு மையம்",
    location: "Avinashi Road, Peelamedu, Coimbatore",
    hallLength: 48,
    hallWidth: 32,
    hallHeight: 8.0,
    defaultCapacity: 1500,
    blueprintUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    stagePosition: [0, 0, -20],
    entrancePosition: [0, 0, 22],
    description:
      "Ultra-modern mega convention hall with integrated heavy 3-phase power dropouts, commercial kitchen docks, and capacity for 1000+ guest grand receptions.",
  },
];

/**
 * Calculates serving capacity, queue bottleneck metrics, and automatically detects
 * when counters like Live Dosa MUST be duplicated (e.g. 2x Dosa stations for >200 guests).
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

  // Calculate live Dosa queue dynamics
  // Each Dosa counter produces ~75 dosas/hour peak.
  // In a 90-minute peak buffet window, 1 counter serves ~115 guests.
  const dosaThroughputPerHour = Math.max(1, dosaCount * 80);
  const dosaWaitMinutes = Math.round(
    ((safeHeadCount * 0.7) / (dosaThroughputPerHour / 60)) * (1 / Math.max(1, dosaCount))
  );

  // Recommend optimal Dosa counters based on headcount:
  // <180 guests -> 1 counter
  // 181-450 guests -> 2 counters (North & South wing)
  // 451-900 guests -> 3 counters
  // >900 guests -> 4+ counters
  let recommendedDosaCounters = 1;
  if (safeHeadCount > 850) {
    recommendedDosaCounters = 4;
  } else if (safeHeadCount > 450) {
    recommendedDosaCounters = 3;
  } else if (safeHeadCount > 180) {
    recommendedDosaCounters = 2;
  }

  // Calculate total hall food capacity per hour
  const totalServingCapacityPerHour = stalls.reduce(
    (sum, s) => sum + (s.type === "dining_table" ? 0 : s.capacityPerHour),
    0
  );

  const estimatedWaitMinutes = Math.min(
    45,
    Math.max(2, Math.round((safeHeadCount / Math.max(100, totalServingCapacityPerHour)) * 42))
  );

  let queueStatus: "optimal" | "moderate" | "congested" = "optimal";
  if (estimatedWaitMinutes > 15 || (dosaCount < recommendedDosaCounters && dosaWaitMinutes > 18)) {
    queueStatus = "congested";
  } else if (estimatedWaitMinutes > 8 || dosaCount < recommendedDosaCounters) {
    queueStatus = "moderate";
  }

  // Generate actionable advice
  const adviceList: RecommendationAdvice[] = [];

  // Dosa counter bottleneck advice
  if (dosaCount < recommendedDosaCounters) {
    adviceList.push({
      type: "warning",
      title: `Critical Bottleneck: Duplicate Live Dosa Counter (${dosaCount} active vs ${recommendedDosaCounters} needed)`,
      description: `With ${safeHeadCount} guests, a single Dosa counter causes an estimated ${dosaWaitMinutes}-minute wait line! We strongly recommend placing a 2nd Dosa station in the opposite wing (North + South) to keep waiting under 4 minutes.`,
      actionLabel: `Add ${recommendedDosaCounters - dosaCount}x Dosa Counter`,
      stallTypeToAdd: "dosa",
    });
  } else {
    adviceList.push({
      type: "tip",
      title: `Excellent Dosa Throughput (${dosaCount} Stations Deployed)`,
      description: `Your ${dosaCount} live tawa stations can serve up to ${dosaCount * 80} dosas per hour, guaranteeing fluid crowd movement without bottlenecking the aisles.`,
    });
  }

  // Sweet/Halwa reception advice
  const sweetCount = stalls.filter((s) => s.type === "sweet_halwa").length;
  if (sweetCount === 0) {
    adviceList.push({
      type: "tip",
      title: "Add Live Halwa Kadai at Mandapam Entrance",
      description:
        "South Indian wedding guests look for a sweet welcome. Placing a piping hot Wheat Halwa kadai right near the entrance walkway disperses incoming crowd pressure.",
      actionLabel: "Add Halwa Kadai",
      stallTypeToAdd: "sweet_halwa",
    });
  } else if (safeHeadCount > 400 && sweetCount === 1) {
    adviceList.push({
      type: "upgrade",
      title: "Recommend 2x Sweet & Beverage Pods for High Head Count",
      description: `At ${safeHeadCount} guests, duplicate the hot sweet station across both sides of the hall.`,
      actionLabel: "Duplicate Sweet Counter",
      stallTypeToAdd: "sweet_halwa",
    });
  }

  // Continental live station advice based on budget tier
  const continentalCount = stalls.filter((s) => s.type === "continental_pasta").length;
  if (budgetTier === "grandeur" && continentalCount === 0) {
    adviceList.push({
      type: "upgrade",
      title: "Grandeur Package: Live Italian Pasta & Grill Station",
      description:
        "Young guests and children flock to customized live pasta. Adding a dedicated continental counter elevates the dining ambiance to 5-star resort tier.",
      actionLabel: "Add Continental Pasta",
      stallTypeToAdd: "continental_pasta",
    });
  }

  // Chaat corner advice
  const chaatCount = stalls.filter((s) => s.type === "chaat").length;
  if (safeHeadCount > 300 && chaatCount === 0) {
    adviceList.push({
      type: "tip",
      title: "Add 4-Flavour Live Chaat & Pani Puri Corner",
      description:
        "High crowd density before the main muhurtham or reception dinner is ideally handled by interactive Pani Puri counters.",
      actionLabel: "Add Live Chaat",
      stallTypeToAdd: "chaat",
    });
  }

  return {
    headCount: safeHeadCount,
    totalServingCapacityPerHour,
    estimatedWaitMinutes,
    queueStatus,
    dosaCounterCount: dosaCount,
    dosaWaitMinutes,
    recommendedDosaCounters,
    budgetTier,
    adviceList,
  };
}

/**
 * Generates an intelligent, ready-to-render initial layout of 3D stalls tailored
 * to the venue geometry, guest headcount (with automatic counter duplication), and budget.
 */
export function getRecommendedStalls(
  headCount: number,
  budgetTier: BudgetTier,
  venue: MandapamVenue
): StallItem[] {
  const result: StallItem[] = [];
  const halfW = venue.hallWidth / 2 - 2.5; // distance from center line to side walls
  const halfL = venue.hallLength / 2 - 3.5;

  let stallCounter = 1;
  const makeId = (type: string) => `${type}-${stallCounter++}`;

  // 1. Royal Grand Buffet Spread (Center-Rear island)
  result.push({
    ...STALL_CATALOG.buffet_spread,
    id: makeId("buffet"),
    position: [0, 0, 0],
    rotation: 0,
    wing: "Central",
    tag: "Dual-Sided Main Island Buffet",
  });

  // 2. Live Dosa Station #1 (North / Left Wing)
  result.push({
    ...STALL_CATALOG.dosa,
    id: makeId("dosa-north"),
    name: "Live Dosa Station (North Wing)",
    position: [-halfW, 0, -4],
    rotation: Math.PI / 2, // Facing inside toward center aisle
    wing: "North",
    tag: "Counter #1",
  });

  // 3. Automatically duplicate Dosa Counter if headcount > 180!
  if (headCount > 180) {
    result.push({
      ...STALL_CATALOG.dosa,
      id: makeId("dosa-south"),
      name: "Live Dosa Station (South Wing - Duplicate)",
      position: [halfW, 0, -4],
      rotation: -Math.PI / 2, // Facing inside
      wing: "South",
      tag: "Counter #2 (Crowd Balancer)",
    });
  }

  // For very large headcounts (>500), add a 3rd Dosa Station
  if (headCount > 500) {
    result.push({
      ...STALL_CATALOG.dosa,
      id: makeId("dosa-east"),
      name: "Live Dosa Station (Express Counter #3)",
      position: [-halfW, 0, 4],
      rotation: Math.PI / 2,
      wing: "East",
      tag: "Counter #3 (Express)",
    });
  }

  // 4. Live Halwa & Sweet Kadai (Near Entrance to welcome guests)
  result.push({
    ...STALL_CATALOG.sweet_halwa,
    id: makeId("halwa"),
    position: [-halfW + 1.5, 0, halfL - 2],
    rotation: 0,
    wing: "West",
    tag: "Welcome Sweet Counter",
  });

  // 5. Filter Coffee & Mocktail Bar (Opposite entrance)
  result.push({
    ...STALL_CATALOG.beverage_bar,
    id: makeId("beverage"),
    position: [halfW - 1.5, 0, halfL - 2],
    rotation: 0,
    wing: "East",
    tag: "Aroma Coffee Counter",
  });

  // 6. Idli Steamer Bar (Alongside Left Wing)
  result.push({
    ...STALL_CATALOG.idli,
    id: makeId("idli"),
    position: [-halfW, 0, 2],
    rotation: Math.PI / 2,
    wing: "North",
  });

  // 7. Live Chaat Corner (Right Wing)
  result.push({
    ...STALL_CATALOG.chaat,
    id: makeId("chaat"),
    position: [halfW, 0, 2],
    rotation: -Math.PI / 2,
    wing: "South",
  });

  // 8. Dessert & Ice Cream Parlour
  result.push({
    ...STALL_CATALOG.dessert_icecream,
    id: makeId("dessert"),
    position: [halfW, 0, -10],
    rotation: -Math.PI / 2,
    wing: "South",
  });

  // 9. Grandeur or Classic Add-ons (Continental Pasta)
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

  // 10. Banquet Dining Tables distributed neatly in open floor zones
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

  return result;
}
