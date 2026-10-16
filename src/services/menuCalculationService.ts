import { getISTDateString } from "@/utils/istDate";
import { findDishByKey } from "@/services/menuCatalogService";
import type {
  CatalogDish,
  DishCostOverrides,
  EventCostSummary,
  EventMenu,
  Session,
  SessionCostSummary,
} from "@/types/menu";

/** Cost of one selected dish, honouring a per-dish override from the review step. */
export const resolveDishCost = (
  dish: CatalogDish | null,
  dishKey: string,
  overrides: DishCostOverrides
): number => {
  const override = overrides[dishKey];
  if (typeof override === "number") {
    return override;
  }
  return dish?.estimatedCost ?? 0;
};

/** Total for a single session: (cost of each dish x head count). */
export const calculateSessionCost = (
  session: Session,
  overrides: DishCostOverrides
): number =>
  session.selectedDishes.reduce((total, dishKey) => {
    const cost = resolveDishCost(findDishByKey(dishKey), dishKey, overrides);
    return total + cost * session.headCount;
  }, 0);

/** Day-by-day, session-by-session costing for the whole event. */
export const calculateEventSummary = (
  menu: EventMenu,
  overrides: DishCostOverrides = {}
): EventCostSummary => {
  const sessions: SessionCostSummary[] = [];

  menu.days.forEach((day) => {
    day.sessions.forEach((session) => {
      sessions.push({
        sessionId: session.id,
        sessionName: session.name,
        dayNumber: day.dayNumber,
        headCount: session.headCount,
        dishCount: session.selectedDishes.length,
        estimatedTotal: calculateSessionCost(session, overrides),
      });
    });
  });

  return {
    sessions,
    totalSessions: sessions.length,
    totalHeadCount: sessions.reduce((sum, item) => sum + item.headCount, 0),
    totalDishes: sessions.reduce((sum, item) => sum + item.dishCount, 0),
    grandTotal: sessions.reduce((sum, item) => sum + item.estimatedTotal, 0),
  };
};

export const createEmptyMenu = (): EventMenu => {
  const today = getISTDateString();
  return {
    id: `menu_${Date.now()}`,
    clientDetails: {
      name: "",
      phone: "",
    },
    venueDetails: {
      name: "",
      address: "",
    },
    customMention: "",
    startDate: today,
    endDate: today,
    numberOfDays: 1,
    days: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
