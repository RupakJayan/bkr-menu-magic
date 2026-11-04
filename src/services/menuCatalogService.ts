import { menuData } from "@/data/menuData";
import { buildCatalogKey, getManagedMenuCatalog } from "@/services/localAdminService";
import type { CatalogDish, Dish, MenuCatalog } from "@/types/menu";

/**
 * Typed view over the hand-maintained catalog in `src/data/menuData.ts`.
 *
 * The data file is authored by hand and its object literal is inferred
 * per-category, which yields a union of slightly different object shapes.
 * Annotating the view here gives every consumer one `Dish` shape while leaving
 * the data file itself completely untouched.
 */
export const menuCatalog: MenuCatalog = menuData;
export { getManagedMenuCatalog, addCustomDishToCatalog, updateDishInCatalog, removeCustomDishFromCatalog } from "@/services/localAdminService";

/** Category names, in the order they appear in the catalog. */
export const getCategories = (): string[] => Object.keys(getManagedMenuCatalog());

export const getDishesByCategory = (category: string): Dish[] =>
  getManagedMenuCatalog()[category] ?? [];

export const SEPARATOR = "::";

/**
 * Selections are stored as `category::dishId`.
 *
 * The catalog keeps human-authored ids such as `ra1`, `sa1`, `ku1` and `kvb1`,
 * and a few of those repeat across categories. A bare id is therefore ambiguous
 * and can resolve to the wrong dish (e.g. `ra1` is both "Onion Raitha" and
 * "Tomato Rasam"), which would print the wrong item on the client's menu.
 * Qualifying the id with its category makes every selection unambiguous
 * without rewriting the data file.
 */
export const buildDishKey = (category: string, dishId: string): string =>
  buildCatalogKey(category, dishId);

export const parseDishKey = (
  key: string
): { category: string | null; dishId: string } => {
  const index = key.indexOf(SEPARATOR);
  if (index === -1) {
    return { category: null, dishId: key };
  }
  return {
    category: key.slice(0, index),
    dishId: key.slice(index + SEPARATOR.length),
  };
};

/**
 * Resolves a selection key back to its dish.
 * Bare ids (written by older saved menus) still resolve - first match wins.
 */
export const findDishByKey = (key: string): CatalogDish | null => {
  const { category, dishId } = parseDishKey(key);
  const currentCatalog = getManagedMenuCatalog();

  if (category && currentCatalog[category]) {
    const dish = currentCatalog[category].find((item) => item.id === dishId);
    if (dish) return { ...dish, category };
  }

  // Fallback: search across all categories (handles category reassignments and bare IDs)
  for (const [categoryName, dishes] of Object.entries(currentCatalog)) {
    const dish = dishes.find((item) => item.id === dishId);
    if (dish) {
      return { ...dish, category: categoryName };
    }
  }

  return null;
};

/** Migrate older bare-id selections and drop duplicate references. */
export const normalizeDishKeys = (keys: string[]): string[] => [
  ...new Set(keys.map((key) => {
    const dish = findDishByKey(key);
    return dish ? buildDishKey(dish.category, dish.id) : key;
  })),
];

/** Dish ids that appear in more than one category. */
export const getDuplicateDishIds = (): string[] => {
  const seen = new Map<string, number>();
  for (const dishes of Object.values(menuCatalog)) {
    for (const dish of dishes) {
      seen.set(dish.id, (seen.get(dish.id) ?? 0) + 1);
    }
  }
  return [...seen.entries()]
    .filter(([, count]) => count > 1)
    .map(([id]) => id)
    .sort();
};
