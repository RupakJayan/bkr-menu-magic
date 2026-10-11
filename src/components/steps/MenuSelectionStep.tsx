import React, { useState } from "react";
import { EventMenu } from "@/types/menu";
import { buildDishKey, getManagedMenuCatalog, normalizeDishKeys } from "@/services/menuCatalogService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronLeft, ChevronRight, Leaf, Utensils } from "lucide-react";
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

  const currentDay = menu.days[currentDayIndex];
  const currentSession = currentDay?.sessions[currentSessionIndex];

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

  const categories = Object.keys(menuData) as Array<keyof typeof menuData>;
  const currentCategoryItems =
    menuData[selectedCategory as keyof typeof menuData] || [];

  return (
    <div className="space-y-4">
      {/* Session Header - Modern POS Style */}
      <div className="menu-session-heading planner-step-banner rounded-2xl shadow-xl text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Utensils className="h-7 w-7" aria-hidden="true" />
              <div>
                <h2 className="text-3xl font-bold">
                  Day {currentDay.dayNumber} - {currentSession.name}
                </h2>
                <p className="text-white/90 text-lg mt-1">
                  {currentSession.startTime} - {currentSession.endTime} |{" "}
                  {currentSession.headCount} guests
                </p>
              </div>
            </div>
          </div>
          <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[100px]">
            <div className="text-5xl font-bold">
              {currentSession.selectedDishes.length}
            </div>
            <div className="text-sm text-white/90 mt-1">Items</div>
          </div>
        </div>
      </div>

      {/* Category Tabs - Modern POS Style */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
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
                          {item.estimatedCost && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 py-1 rounded-lg text-sm font-bold shadow-lg">
                              ₹{item.estimatedCost}
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
