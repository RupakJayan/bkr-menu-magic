import type { Dish } from "@/types/menu";

export interface DishCategoryGroup {
  category: string;
  dishes: Dish[];
}

/** True when a dish matches the search term (English name, Tamil name or category). */
export const matchesDish = (
  dish: Dish,
  category: string,
  searchTerm: string
): boolean => {
  const needle = searchTerm.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  return (
    dish.name_en.toLowerCase().includes(needle) ||
    dish.name_ta.toLowerCase().includes(needle) ||
    category.toLowerCase().includes(needle)
  );
};

/**
 * Filters a category -> dishes catalog down to the categories that still have
 * matching dishes. Empty categories are dropped so the UI never renders a
 * heading with nothing under it.
 */
export const filterCategories = (
  catalog: Array<{ category: string; dishes: Dish[] }>,
  searchTerm: string,
  vegetarianOnly: boolean
): DishCategoryGroup[] =>
  catalog.reduce<DishCategoryGroup[]>((groups, entry) => {
    const dishes = entry.dishes.filter(
      (dish) =>
        (!vegetarianOnly || dish.isVegetarian) &&
        matchesDish(dish, entry.category, searchTerm)
    );
    if (dishes.length > 0) {
      groups.push({ category: entry.category, dishes });
    }
    return groups;
  }, []);

export const countDishes = (groups: DishCategoryGroup[]): number =>
  groups.reduce((total, group) => total + group.dishes.length, 0);
