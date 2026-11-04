import React from "react";
import { Layers, LayoutGrid, Leaf, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export type MenuViewMode = "category" | "all";

interface MenuBrowserControlsProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  vegetarianOnly: boolean;
  onVegetarianOnlyChange: (value: boolean) => void;
  viewMode: MenuViewMode;
  onViewModeChange: (mode: MenuViewMode) => void;
  resultCount: number;
  onClearFilters: () => void;
}

export const MenuBrowserControls: React.FC<MenuBrowserControlsProps> = ({
  searchTerm,
  onSearchTermChange,
  vegetarianOnly,
  onVegetarianOnlyChange,
  viewMode,
  onViewModeChange,
  resultCount,
  onClearFilters,
}) => {
  const hasFilters = searchTerm.trim().length > 0 || vegetarianOnly;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Search dishes in English or Tamil (e.g. Dosa, தோசை)"
            aria-label="Search dishes"
            className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-gray-200">
            <Leaf className="h-4 w-4 text-green-600" />
            <Label
              htmlFor="vegetarian-only"
              className="text-sm font-semibold text-gray-700 cursor-pointer"
            >
              Vegetarian only
            </Label>
            <Switch
              id="vegetarian-only"
              checked={vegetarianOnly}
              onCheckedChange={onVegetarianOnlyChange}
            />
          </div>

          <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden">
            <Button
              type="button"
              variant={viewMode === "category" ? "default" : "ghost"}
              onClick={() => onViewModeChange("category")}
              className="rounded-none h-11 px-3"
              aria-pressed={viewMode === "category"}
              title="Browse one category at a time"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Category
            </Button>
            <Button
              type="button"
              variant={viewMode === "all" ? "default" : "ghost"}
              onClick={() => onViewModeChange("all")}
              className="rounded-none h-11 px-3"
              aria-pressed={viewMode === "all"}
              title="Browse every category at once"
            >
              <Layers className="h-4 w-4 mr-2" />
              All
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-600">
          {resultCount} {resultCount === 1 ? "dish" : "dishes"} shown
        </span>
        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={onClearFilters}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-semibold h-9"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
