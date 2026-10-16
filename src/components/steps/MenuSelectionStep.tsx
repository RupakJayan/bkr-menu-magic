import React, { useState, useRef, useEffect, useMemo } from "react";
import { EventMenu } from "@/types/menu";
import { buildDishKey, getManagedMenuCatalog, normalizeDishKeys } from "@/services/menuCatalogService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, ChevronLeft, ChevronRight, Leaf, Plus, Search, Sparkles, TrendingUp, Utensils, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MenuSelectionStepProps {
  menu: EventMenu;
  onMenuChange: (menu: EventMenu) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const MenuSelectionStep: React.FC<MenuSelectionStepProps> = ({
  menu,
  onMenuChange,
  onNext,
  onPrevious,
}) => {
  const menuData = getManagedMenuCatalog();
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    Object.keys(menuData)[0],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const currentDay = menu.days[currentDayIndex];
  const currentSession = currentDay?.sessions[currentSessionIndex];

  // Close recommendations dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDish = (category: string, dishId: string) => {
    if (!currentSession) return;

    const updatedDays = [...menu.days];
    const session = updatedDays[currentDayIndex].sessions[currentSessionIndex];
    const dishKey = buildDishKey(category, dishId);
    session.selectedDishes = normalizeDishKeys(session.selectedDishes);

    if (session.selectedDishes.includes(dishKey)) {
      session.selectedDishes = session.selectedDishes.filter(
        (id) => id !== dishKey,
      );
    } else {
      session.selectedDishes = [
        ...new Set([...session.selectedDishes, dishKey]),
      ];
    }

    onMenuChange({
      ...menu,
      days: updatedDays,
      updatedAt: new Date(),
    });
  };

  const handleNext = () => {
    // Move to next session or next day
    if (currentSessionIndex < currentDay.sessions.length - 1) {
      setCurrentSessionIndex(currentSessionIndex + 1);
    } else if (currentDayIndex < menu.days.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
      setCurrentSessionIndex(0);
    } else {
      // All sessions completed
      onNext();
    }
  };

  const handlePrevious = () => {
    // Move to previous session or previous day
    if (currentSessionIndex > 0) {
      setCurrentSessionIndex(currentSessionIndex - 1);
    } else if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
      setCurrentSessionIndex(
        menu.days[currentDayIndex - 1].sessions.length - 1,
      );
    } else {
      // Go back to session planning
      onPrevious();
    }
  };

  const categories = useMemo(() => Object.keys(menuData) as Array<keyof typeof menuData>, [menuData]);

  const allCatalogItems = useMemo(() => {
    return categories.flatMap((cat) =>
      menuData[cat].map((item) => ({ ...item, category: cat }))
    );
  }, [categories, menuData]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Highlight matching substring like Google search suggestions
  const highlightMatch = (text: string | undefined, query: string) => {
    if (!text) return "";
    const trimmed = query.trim();
    if (!trimmed) return text;
    try {
      const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const parts = text.split(new RegExp(`(${escaped})`, "gi"));
      return parts.map((part, index) => {
        if (part.toLowerCase() === trimmed.toLowerCase()) {
          return (
            <span key={index} className="font-extrabold text-pink-600 underline decoration-pink-300">
              {part}
            </span>
          );
        }
        return part;
      });
    } catch {
      return text;
    }
  };

  // Popular / signature catering items for empty query state
  const popularDishes = useMemo(() => {
    const popularKeywords = ["jamun", "biryani", "sambar", "kesari", "poori", "paneer", "rasam", "vadai"];
    const matches = allCatalogItems.filter((item) => {
      const name = (item.name_en || item.name || "").toLowerCase();
      return popularKeywords.some((kw) => name.includes(kw));
    });
    return matches.length > 0 ? matches.slice(0, 8) : allCatalogItems.slice(0, 8);
  }, [allCatalogItems]);

  // Google-style predictive suggestions (ranked by prefix match then substring)
  const suggestions = useMemo(() => {
    if (!normalizedQuery) {
      return popularDishes;
    }
    return allCatalogItems
      .filter((item) => {
        const nameEn = (item.name_en || item.name || "").toLowerCase();
        const nameTa = (item.name_ta || "").toLowerCase();
        const cat = item.category.toLowerCase();
        return (
          nameEn.includes(normalizedQuery) ||
          nameTa.includes(normalizedQuery) ||
          cat.includes(normalizedQuery)
        );
      })
      .sort((a, b) => {
        const aNameEn = (a.name_en || a.name || "").toLowerCase();
        const bNameEn = (b.name_en || b.name || "").toLowerCase();
        const aNameTa = (a.name_ta || "").toLowerCase();
        const bNameTa = (b.name_ta || "").toLowerCase();

        const aPrefix = aNameEn.startsWith(normalizedQuery) || aNameTa.startsWith(normalizedQuery) ? 2 : 1;
        const bPrefix = bNameEn.startsWith(normalizedQuery) || bNameTa.startsWith(normalizedQuery) ? 2 : 1;

        if (aPrefix !== bPrefix) return bPrefix - aPrefix;
        return aNameEn.localeCompare(bNameEn);
      })
      .slice(0, 8);
  }, [allCatalogItems, normalizedQuery, popularDishes]);

  // Full search results for the catalog grid
  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return allCatalogItems.filter((item) => {
      const nameEn = (item.name_en || item.name || "").toLowerCase();
      const nameTa = (item.name_ta || "").toLowerCase();
      const cat = item.category.toLowerCase();
      return (
        nameEn.includes(normalizedQuery) ||
        nameTa.includes(normalizedQuery) ||
        cat.includes(normalizedQuery)
      );
    });
  }, [allCatalogItems, normalizedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchFocused || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        const item = suggestions[highlightedIndex];
        toggleDish(item.category, item.id);
      } else {
        setIsSearchFocused(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsSearchFocused(false);
    }
  };

  if (!currentSession) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>No sessions configured. Please go back and add sessions.</p>
          <Button onClick={onPrevious} className="mt-4">
            Back to Session Planning
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Session Header - Auto-adjusted, proportional */}
      <div className="menu-session-heading planner-step-banner rounded-xl shadow-lg p-5 w-full">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-lg bg-white/10 border border-white/20 shrink-0">
              <Utensils className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold truncate">
                Day {currentDay.dayNumber} - {currentSession.name}
              </h2>
              <p className="text-sm opacity-90 mt-0.5">
                {currentSession.startTime} – {currentSession.endTime} | {currentSession.headCount} guests
              </p>
            </div>
          </div>

          {/* Auto-adjusted Selected Items Pill */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 px-3.5 py-1.5 rounded-lg bg-white/15 dark:bg-white/10 border border-white/20 shadow-sm">
            <span className="text-lg font-bold">
              {currentSession.selectedDishes.length}
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
              {currentSession.selectedDishes.length === 1 ? "Item Selected" : "Items Selected"}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar & Category Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-4 space-y-4">
        {/* Google-style Search Input & Recommendations Container */}
        <div ref={searchContainerRef} className="relative z-40">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
                setHighlightedIndex(-1);
              }}
              onFocus={() => {
                setIsSearchFocused(true);
                setHighlightedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search dishes or type for instant recommendations (e.g., Laddu, Sambar, பாயாசம், Biryani)..."
              className="pl-11 pr-10 h-12 text-base rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-rose-200 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setHighlightedIndex(-1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Google-style Instant Recommendations Dropdown */}
          {isSearchFocused && (
            <div className="planner-search-dropdown absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl overflow-hidden z-50">
              {/* Dropdown Header */}
              <div className="planner-search-dropdown-header px-4 py-2.5 flex items-center justify-between text-xs font-medium border-b">
                <div className="flex items-center gap-1.5">
                  {normalizedQuery ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-pink-500 dark:text-amber-400" />
                      <span>
                        Recommended dishes for &ldquo;<span className="text-pink-600 dark:text-amber-400 font-semibold">{searchQuery}</span>&rdquo;
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-3.5 w-3.5 text-pink-500 dark:text-amber-400" />
                      <span>Popular Catering Recommendations</span>
                    </>
                  )}
                </div>
                <span className="text-[11px] opacity-75">
                  {suggestions.length} recommendation{suggestions.length === 1 ? "" : "s"}
                </span>
              </div>

              {/* Suggestions List */}
              {suggestions.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <p className="text-sm font-medium">No dish recommendations found for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-xs opacity-75 mt-1">Try another dish name, Tamil keyword, or browse categories below.</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {suggestions.map((item, index) => {
                    const dishKey = buildDishKey(item.category, item.id);
                    const isSelected = currentSession.selectedDishes.includes(dishKey);
                    const isHighlighted = highlightedIndex === index;

                    return (
                      <div
                        key={dishKey}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`planner-search-item px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isHighlighted ? "is-highlighted" : ""
                        }`}
                        onClick={() => {
                          toggleDish(item.category, item.id);
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-sm">
                            <img
                              src={item.image}
                              alt={item.name_en || item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                              }}
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-emerald-600/70 backdrop-blur-[0.5px] flex items-center justify-center">
                                <Check className="h-4 w-4 text-white stroke-[3]" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold truncate">
                                {highlightMatch(item.name_en || item.name, searchQuery)}
                              </p>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 dark:bg-white/10 dark:text-amber-200 border border-pink-200 dark:border-amber-400/20 shrink-0">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-xs text-pink-600 dark:text-amber-400/90 truncate font-medium">
                              {highlightMatch(item.name_ta, searchQuery)}
                            </p>
                          </div>
                        </div>

                        {/* Fast Add / Toggle Action with explicit theme-safe classes */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDish(item.category, item.id);
                          }}
                          className={isSelected ? "planner-search-added-btn shrink-0" : "planner-search-add-btn shrink-0"}
                        >
                          {isSelected ? (
                            <>
                              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="h-3.5 w-3.5" />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Dropdown Footer Navigation Shortcuts */}
              <div className="planner-search-dropdown-footer px-4 py-2 flex items-center justify-between text-[11px] border-t">
                <div className="flex items-center gap-1.5">
                  <span className="planner-search-kbd px-1.5 py-0.5 rounded text-[10px] font-mono">↑↓</span>
                  <span>navigate</span>
                  <span className="planner-search-kbd px-1.5 py-0.5 rounded text-[10px] font-mono ml-1.5">Enter</span>
                  <span>toggle/add</span>
                  <span className="planner-search-kbd px-1.5 py-0.5 rounded text-[10px] font-mono ml-1.5">Esc</span>
                  <span>close</span>
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsSearchFocused(false);
                  }}
                  className="text-pink-600 dark:text-amber-400 hover:underline font-semibold"
                >
                  View full grid →
                </button>
              </div>
            </div>
          )}
        </div>

        {searchQuery.trim() ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">
                Found {searchResults.length} dish{searchResults.length === 1 ? "" : "es"} matching &ldquo;{searchQuery}&rdquo;
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                Clear search & view categories
              </Button>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">No dishes found matching &ldquo;{searchQuery}&rdquo;.</p>
                <p className="text-xs text-gray-400 mt-1">Try another keyword or clear search to browse category tabs.</p>
                <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="mt-3">
                  Browse All Categories
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {searchResults.map((item) => {
                  const dishKey = buildDishKey(item.category, item.id);
                  const isSelected = currentSession.selectedDishes.includes(dishKey);

                  return (
                    <div
                      key={dishKey}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        isSelected ? "scale-105" : ""
                      }`}
                      onClick={() => toggleDish(item.category, item.id)}
                    >
                      <div
                        className={`bg-white rounded-xl shadow-md overflow-hidden border-3 transition-all ${
                          isSelected
                            ? "border-green-500 shadow-green-200 ring-4 ring-green-200"
                            : "border-gray-200 hover:border-orange-400 hover:shadow-lg"
                        }`}
                      >
                        {/* Food Image */}
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name_en || item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                            }}
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-green-500/30 backdrop-blur-[1px] flex items-center justify-center">
                              <div className="bg-green-500 text-white rounded-full p-3 shadow-2xl">
                                <Check className="h-6 w-6 stroke-[3]" />
                              </div>
                            </div>
                          )}
                          <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-medium">
                            {item.category}
                          </span>
                          {item.isVegetarian && (
                            <div
                              className="planner-vegetarian-mark absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg"
                              aria-label="Vegetarian"
                              title="Vegetarian"
                            >
                              <Leaf className="h-4 w-4" aria-hidden="true" />
                            </div>
                          )}
                        </div>

                        {/* Food Details */}
                        <div className="p-3 bg-gradient-to-b from-white to-gray-50">
                          <h3 className="font-bold text-sm line-clamp-2 text-gray-900 mb-1 min-h-[2.5rem]">
                            {item.name_en || item.name}
                          </h3>
                          <p className="text-xs text-pink-600 line-clamp-1 font-medium">
                            {item.name_ta}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="menu-category-list w-full flex-nowrap justify-start h-auto gap-2 bg-transparent p-0">
              {categories.map((category) => {
                const items = menuData[category];
                const selectedCount = items.filter((item) =>
                  currentSession.selectedDishes.includes(
                    buildDishKey(category, item.id),
                  ),
                ).length;

                return (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="menu-category-tab shrink-0 min-w-[120px] h-auto py-2.5 px-3 border border-gray-200 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg transition-all font-semibold"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm">{category}</span>
                      {selectedCount > 0 && (
                        <Badge className="bg-green-500 text-white font-bold px-2 py-0.5 text-xs">
                          {selectedCount}
                        </Badge>
                      )}
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {menuData[category].map((item) => {
                    const isSelected = currentSession.selectedDishes.includes(
                      buildDishKey(category, item.id),
                    );

                    return (
                      <div
                        key={buildDishKey(category, item.id)}
                        className={`cursor-pointer transition-all hover:scale-105 ${
                          isSelected ? "scale-105" : ""
                        }`}
                        onClick={() => toggleDish(category, item.id)}
                      >
                        <div
                          className={`bg-white rounded-xl shadow-md overflow-hidden border-3 transition-all ${
                            isSelected
                              ? "border-green-500 shadow-green-200 ring-4 ring-green-200"
                              : "border-gray-200 hover:border-orange-400 hover:shadow-lg"
                          }`}
                        >
                          {/* Food Image */}
                          <div className="relative aspect-square overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name_en || item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                              }}
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-green-500/30 backdrop-blur-[1px] flex items-center justify-center">
                                <div className="bg-green-500 text-white rounded-full p-3 shadow-2xl">
                                  <Check className="h-6 w-6 stroke-[3]" />
                                </div>
                              </div>
                            )}
                            {item.isVegetarian && (
                              <div
                                className="planner-vegetarian-mark absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg"
                                aria-label="Vegetarian"
                                title="Vegetarian"
                              >
                                <Leaf className="h-4 w-4" aria-hidden="true" />
                              </div>
                            )}
                          </div>

                          {/* Food Details */}
                          <div className="p-3 bg-gradient-to-b from-white to-gray-50">
                            <h3 className="font-bold text-sm line-clamp-2 text-gray-900 mb-1 min-h-[2.5rem]">
                              {item.name_en || item.name}
                            </h3>
                            <p className="text-xs text-pink-600 line-clamp-1 font-medium">
                              {item.name_ta}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Navigation - Modern Style */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="menu-selection-navigation flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex-1 h-14 text-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 rounded-xl"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-lg"
          >
            {currentDayIndex === menu.days.length - 1 &&
            currentSessionIndex === currentDay.sessions.length - 1
              ? "Continue to Review"
              : "Next Session"}
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
