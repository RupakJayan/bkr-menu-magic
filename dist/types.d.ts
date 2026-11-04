export type StallType = "dosa" | "idli" | "sweet_halwa" | "continental_pasta" | "chaat" | "beverage_bar" | "buffet_spread" | "dessert_icecream" | "dining_table";
export type BudgetTier = "economy" | "classic" | "grandeur";
export interface StallSpecification {
    type: StallType;
    name: string;
    name_ta: string;
    category: string;
    capacityPerHour: number;
    unitCost: number;
    powerRequiredKw: number;
    waterRequired: boolean;
    dishes: string[];
    dishes_ta: string[];
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
    totalPowerRequiredKw: number;
    waterLineCount: number;
    budgetTier: BudgetTier;
    adviceList: RecommendationAdvice[];
}
//# sourceMappingURL=types.d.ts.map