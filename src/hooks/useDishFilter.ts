import { useMemo } from "react";
import { getCategories, getDishesByCategory } from "@/services/menuCatalogService";
import { filterCategories, type DishCategoryGroup } from "@/utils/dishFilter";

export interface DishFilterState {
  searchTerm: string;
  vegetarianOnly: boolean;
}

/** Memoised, filtered view over the whole dish catalog. */
export const useDishFilter = ({
  searchTerm,
  vegetarianOnly,
}: DishFilterState): DishCategoryGroup[] =>
  useMemo(() => {
    const catalog = getCategories().map((category) => ({
      category,
      dishes: getDishesByCategory(category),
    }));
    return filterCategories(catalog, searchTerm, vegetarianOnly);
  }, [searchTerm, vegetarianOnly]);
