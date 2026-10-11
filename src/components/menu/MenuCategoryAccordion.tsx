import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { DishCard } from "@/components/menu/DishCard";
import { buildDishKey } from "@/services/menuCatalogService";
import type { DishCategoryGroup } from "@/utils/dishFilter";

interface MenuCategoryAccordionProps {
  groups: DishCategoryGroup[];
  selectedKeys: string[];
  onToggle: (dishKey: string) => void;
  /**
   * Categories expanded on first render. The panel is remounted (via `key`)
   * whenever this changes, so a fresh search expands its hits.
   */
  defaultOpen?: string[];
}

export const MenuCategoryAccordion: React.FC<MenuCategoryAccordionProps> = ({
  groups,
  selectedKeys,
  onToggle,
  defaultOpen = [],
}) => (
  <Accordion
    type="multiple"
    defaultValue={defaultOpen}
    className="w-full space-y-3"
  >
    {groups.map((group) => {
      const selectedCount = group.dishes.filter((dish) =>
        selectedKeys.includes(buildDishKey(group.category, dish.id))
      ).length;

      return (
        <AccordionItem
          key={group.category}
          value={group.category}
          className="bg-white rounded-xl border-2 border-pink-100 shadow-sm px-4 overflow-hidden"
        >
          <AccordionTrigger className="hover:no-underline gap-3">
            <span className="flex flex-wrap items-center gap-3 text-left">
              <span className="font-bold text-gray-900">{group.category}</span>
              <span className="text-xs font-semibold text-gray-500">
                {group.dishes.length} items
              </span>
              {selectedCount > 0 && (
                <Badge className="bg-green-500 text-white hover:bg-green-500">
                  {selectedCount} selected
                </Badge>
              )}
            </span>
          </AccordionTrigger>

          <AccordionContent className="pb-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {group.dishes.map((dish) => {
                const dishKey = buildDishKey(group.category, dish.id);
                return (
                  <DishCard
                    key={dishKey}
                    dish={dish}
                    isSelected={selectedKeys.includes(dishKey)}
                    onToggle={() => onToggle(dishKey)}
                  />
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    })}
  </Accordion>
);

export const EMPTY_GROUPS_MESSAGE =
  "No dishes match your search. Try a different name or clear the filters.";
