import {
  StallType,
  BudgetTier,
  StallSpecification,
  CapacityAnalysis,
  RecommendationAdvice,
} from "./types.js";

export const STALL_SPECS: Record<StallType, StallSpecification> = {
  dosa: {
    type: "dosa",
    name: "Live Dosa Station",
    name_ta: "நேரடி தோசை அரங்கம்",
    category: "Live Tawa",
    capacityPerHour: 80,
    unitCost: 18000,
    powerRequiredKw: 6.0,
    waterRequired: true,
    dishes: ["Ghee Roast Dosa", "Podi Dosa", "Onion Uthappam", "Chutneys & Sambar"],
    dishes_ta: ["நெய் ரோஸ்ட் தோசை", "பொடி தோசை", "வெங்காய ஊத்தப்பம்", "சட்னி சாம்பார்"],
  },
  idli: {
    type: "idli",
    name: "Heritage Idli Steamer Bar",
    name_ta: "பாரம்பரிய இட்லி அரங்கம்",
    category: "Steam Specials",
    capacityPerHour: 150,
    unitCost: 12000,
    powerRequiredKw: 4.5,
    waterRequired: true,
    dishes: ["Thatte Idli", "Mini Ghee Sambar Idli", "Medu Vada"],
    dishes_ta: ["தட்டே இட்லி", "மினி நெய் சாம்பார் இட்லி", "மெது வடை"],
  },
  sweet_halwa: {
    type: "sweet_halwa",
    name: "Live Halwa & Sweet Kadai",
    name_ta: "சூடான அல்வா கடை",
    category: "Live Sweets",
    capacityPerHour: 140,
    unitCost: 22000,
    powerRequiredKw: 3.5,
    waterRequired: false,
    dishes: ["Tirunelveli Wheat Halwa", "Elaneer Payasam", "Kesar Jalebi"],
    dishes_ta: ["கோதுமை அல்வா", "இளநீர் பாயாசம்", "ஜிலேபி"],
  },
  continental_pasta: {
    type: "continental_pasta",
    name: "Live Continental Pasta & Grill",
    name_ta: "கான்டினென்டல் பாஸ்தா",
    category: "Global Gourmet",
    capacityPerHour: 90,
    unitCost: 25000,
    powerRequiredKw: 7.0,
    waterRequired: true,
    dishes: ["Penne Arrabbiata", "Fusilli Alfredo", "Garlic Bread"],
    dishes_ta: ["பென்னே பாஸ்தா", "அல்ஃப்ரெடோ பாஸ்தா", "கார்லிக் பிரெட்"],
  },
  chaat: {
    type: "chaat",
    name: "Live Chaat & Pani Puri Corner",
    name_ta: "சாட் & பானி பூரி",
    category: "Street Savouries",
    capacityPerHour: 120,
    unitCost: 15000,
    powerRequiredKw: 2.0,
    waterRequired: true,
    dishes: ["4-Flavour Pani Puri", "Dahi Papdi Chaat", "Raj Kachori"],
    dishes_ta: ["பானி பூரி", "தஹி பாப்படி சாட்", "ராஜ் கச்சோரி"],
  },
  beverage_bar: {
    type: "beverage_bar",
    name: "Filter Coffee & Mocktail Bar",
    name_ta: "டிகிரி காபி & மாாக்டெயில்",
    category: "Beverages",
    capacityPerHour: 200,
    unitCost: 14000,
    powerRequiredKw: 5.0,
    waterRequired: true,
    dishes: ["Kumbakonam Degree Coffee", "Tender Coconut Punch"],
    dishes_ta: ["டிகிரி காபி", "இளநீர் பஞ்ச்"],
  },
  buffet_spread: {
    type: "buffet_spread",
    name: "Royal Grand Buffet Main Line",
    name_ta: "ராயல் பஃபே முதன்மை வரிசை",
    category: "Main Course",
    capacityPerHour: 250,
    unitCost: 35000,
    powerRequiredKw: 8.0,
    waterRequired: false,
    dishes: ["Bisibelebath", "Chettinad Veg Biryani", "Ponni Rice Meals", "Curd Rice"],
    dishes_ta: ["பிசிபேளேபாத்", "செட்டிநாடு பிரியாணி", "பொன்னி சாதம்", "தயிர் சாதம்"],
  },
  dessert_icecream: {
    type: "dessert_icecream",
    name: "Cold Stone Ice Cream & Dessert",
    name_ta: "ஐஸ்கிரீம் வண்டி",
    category: "Dessert Parlour",
    capacityPerHour: 180,
    unitCost: 16000,
    powerRequiredKw: 4.0,
    waterRequired: false,
    dishes: ["Cold Stone Sundaes", "Paan Kulfi", "Gulab Jamun"],
    dishes_ta: ["கோல்ட் ஸ்டோன் ஐஸ்கிரீம்", "பான் குல்பி", "குலாப் ஜாமுன்"],
  },
  dining_table: {
    type: "dining_table",
    name: "Banquet Round Table (8-Seater)",
    name_ta: "விருந்து வட்ட மேசை",
    category: "Seating",
    capacityPerHour: 32,
    unitCost: 4500,
    powerRequiredKw: 0,
    waterRequired: false,
    dishes: ["Table Carafes", "Banana Leaf / Bone China Cutlery"],
    dishes_ta: ["மேசை குடிநீர்", "வாழை இலை"],
  },
};

/**
 * Calculates serving throughput, bottleneck queue wait times, and triggers
 * automatic counter duplication for South Indian wedding and buffet venues.
 */
export function calculateCateringCapacity(
  headCount: number,
  deployedStallTypes: StallType[],
  budgetTier: BudgetTier = "classic"
): CapacityAnalysis {
  const safeHeadCount = Math.max(50, headCount);

  // Count active live stations
  const dosaCount = deployedStallTypes.filter((t) => t === "dosa").length;

  // Dosa queue dynamics
  const dosaThroughputPerHour = Math.max(1, dosaCount * 80);
  const dosaWaitMinutes = Math.round(
    ((safeHeadCount * 0.7) / (dosaThroughputPerHour / 60)) * (1 / Math.max(1, dosaCount))
  );

  // Recommended Dosa counter duplication thresholds
  let recommendedDosaCounters = 1;
  if (safeHeadCount > 850) {
    recommendedDosaCounters = 4;
  } else if (safeHeadCount > 450) {
    recommendedDosaCounters = 3;
  } else if (safeHeadCount > 180) {
    recommendedDosaCounters = 2; // North & South Wings
  }

  // Hall throughput
  let totalCapacity = 0;
  let totalPower = 0;
  let waterLines = 0;

  for (const type of deployedStallTypes) {
    const spec = STALL_SPECS[type];
    if (spec) {
      if (type !== "dining_table") {
        totalCapacity += spec.capacityPerHour;
      }
      totalPower += spec.powerRequiredKw;
      if (spec.waterRequired) waterLines += 1;
    }
  }

  const estimatedWaitMinutes = Math.min(
    45,
    Math.max(2, Math.round((safeHeadCount / Math.max(100, totalCapacity)) * 42))
  );

  let queueStatus: "optimal" | "moderate" | "congested" = "optimal";
  if (estimatedWaitMinutes > 15 || (dosaCount < recommendedDosaCounters && dosaWaitMinutes > 18)) {
    queueStatus = "congested";
  } else if (estimatedWaitMinutes > 8 || dosaCount < recommendedDosaCounters) {
    queueStatus = "moderate";
  }

  const adviceList: RecommendationAdvice[] = [];

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
      title: `Optimal Dosa Flow (${dosaCount} Stations Deployed)`,
      description: `Your ${dosaCount} live tawa stations can serve up to ${dosaCount * 80} dosas per hour, guaranteeing zero bottleneck.`,
    });
  }

  return {
    headCount: safeHeadCount,
    totalServingCapacityPerHour: totalCapacity,
    estimatedWaitMinutes,
    queueStatus,
    dosaCounterCount: dosaCount,
    dosaWaitMinutes,
    recommendedDosaCounters,
    totalPowerRequiredKw: totalPower,
    waterLineCount: waterLines,
    budgetTier,
    adviceList,
  };
}
