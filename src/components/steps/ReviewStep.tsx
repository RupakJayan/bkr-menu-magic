import React, { useState } from 'react';
import { EventMenu } from '@/types/menu';
import { buildDishKey, findDishByKey, getManagedMenuCatalog, normalizeDishKeys } from '@/services/menuCatalogService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BadgeCheck, Calendar, CalendarDays, Check, ClipboardList, MapPin, Phone, User, Utensils, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatISTDate } from '@/utils/istDate';
import { saveEventMenu } from '@/services/localAdminService';
import { getStoredGoogleToken } from '@/services/googleAuthService';
import { saveMenuToGoogleDrive } from '@/services/googleDriveService';
import { useToast } from '@/hooks/use-toast';

interface ReviewStepProps {
  menu: EventMenu;
  onMenuChange: (menu: EventMenu) => void;
  onNext: () => void;
  onPrevious: () => void;
  onStartNewEvent?: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ menu, onMenuChange, onNext, onPrevious, onStartNewEvent }) => {
  const { toast } = useToast();
  const [editingSession, setEditingSession] = useState<{ dayIndex: number; sessionIndex: number } | null>(null);
  const [customCosts, setCustomCosts] = useState<Record<string, number>>({});
  const menuData = getManagedMenuCatalog();

  const handleManualSave = () => {
    try {
      saveEventMenu(menu);
      const token = getStoredGoogleToken();
      if (token) {
        saveMenuToGoogleDrive(menu, token).then(() => {
          toast({
            title: "Menu Synced to Google Drive",
            description: "Saved to 'BKR Catering Events' in Google Drive.",
          });
        }).catch(() => {});
      }
      toast({
        title: "Menu Saved to Dashboard",
        description: "Event has been saved in your dashboard records.",
      });
    } catch (error) {
      toast({
        title: "Could not save menu",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeDish = (dayIndex: number, sessionIndex: number, dishKey: string) => {
    const updatedDays = [...menu.days];
    updatedDays[dayIndex].sessions[sessionIndex].selectedDishes =
      normalizeDishKeys(updatedDays[dayIndex].sessions[sessionIndex].selectedDishes)
        .filter(id => id !== dishKey);

    onMenuChange({
      ...menu,
      days: updatedDays,
      updatedAt: new Date(),
    });
  };

  const addDishToSession = (dayIndex: number, sessionIndex: number, dishKey: string) => {
    const updatedDays = [...menu.days];
    const session = updatedDays[dayIndex].sessions[sessionIndex];
    session.selectedDishes = normalizeDishKeys(session.selectedDishes);
    if (!session.selectedDishes.includes(dishKey)) {
      session.selectedDishes = [...session.selectedDishes, dishKey];
      onMenuChange({
        ...menu,
        days: updatedDays,
        updatedAt: new Date(),
      });
    }
  };

  const updateCustomCost = (dishKey: string, cost: number) => {
    setCustomCosts(prev => ({
      ...prev,
      [dishKey]: cost,
    }));
  };

  const updateSessionRate = (dayIndex: number, sessionIndex: number, ratePerPerson: number) => {
    const updatedDays = menu.days.map((day, index) => index === dayIndex
      ? {
          ...day,
          sessions: day.sessions.map((session, sessionIndexValue) => sessionIndexValue === sessionIndex
            ? { ...session, ratePerPerson }
            : session),
        }
      : day);
    onMenuChange({ ...menu, days: updatedDays, updatedAt: new Date() });
  };

  const calculateSessionTotal = (dayIndex: number, sessionIndex: number) => {
    const session = menu.days[dayIndex].sessions[sessionIndex];
    let total = 0;

    session.selectedDishes.forEach(dishKey => {
      const dish = findDishByKey(dishKey);
      if (dish) {
        const cost = customCosts[dishKey] ?? dish.estimatedCost ?? 0;
        total += cost * session.headCount;
      }
    });

    return total;
  };

  const calculateGrandTotal = () => {
    let total = 0;
    menu.days.forEach((day, dayIndex) => {
      day.sessions.forEach((session, sessionIndex) => {
        total += calculateSessionTotal(dayIndex, sessionIndex);
      });
    });
    return total;
  };

  const categories = Object.keys(menuData) as Array<keyof typeof menuData>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="planner-step-banner rounded-xl shadow-lg text-white overflow-hidden">
        <div className="p-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <BadgeCheck className="h-7 w-7" aria-hidden="true" />
              Review & Summary | மதிப்பாய்வு
            </h2>
            <p className="text-pink-100 text-lg">Review all details and edit if needed</p>
          </div>
        </div>
      </div>

      {/* Client & Venue Details */}
      <section className="planner-summary-card bg-white rounded-xl shadow-lg border border-pink-200 overflow-hidden">
        <div className="planner-card-header p-5">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
            Event Information
          </h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <User className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-blue-600 font-semibold">Client Name</p>
                <p className="text-xl font-bold text-gray-800">{menu.clientDetails.name}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <Phone className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-green-600 font-semibold">Phone</p>
                <p className="text-xl font-bold text-gray-800">{menu.clientDetails.phone}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl">
              <MapPin className="h-6 w-6 text-pink-600 mt-1" />
              <div>
                <p className="text-sm text-pink-600 font-semibold">Venue</p>
                <p className="text-lg font-bold text-gray-800">{menu.venueDetails.name}</p>
                <p className="text-sm text-gray-600">{menu.venueDetails.address}</p>
                {menu.venueDetails.googleMapsUrl && (
                  <a
                    href={menu.venueDetails.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View on Google Maps
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <Calendar className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <p className="text-sm text-orange-600 font-semibold">Event Duration</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatISTDate(menu.startDate, 'en-IN', { dateStyle: 'medium' })} - {formatISTDate(menu.endDate, 'en-IN', { dateStyle: 'medium' })}
                </p>
                <p className="text-sm text-gray-600">{menu.numberOfDays} day(s)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Day-wise Session Details with Editing */}
      {menu.days.map((day, dayIndex) => (
        <section key={day.dayNumber} className="planner-summary-card bg-white rounded-xl shadow-lg border border-pink-200 overflow-hidden">
          <div className="planner-card-header p-5">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
              Day {day.dayNumber} - {formatISTDate(day.date, 'en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
          </div>
          <div className="p-5 space-y-4">
            {day.sessions.map((session, sessionIndex) => {
              const selectedDishes = session.selectedDishes.flatMap(dishKey => {
                const dish = findDishByKey(dishKey);
                return dish ? [{ ...dish, selectionKey: dishKey }] : [];
              });

              const sessionTotal = calculateSessionTotal(dayIndex, sessionIndex);

              return (
                <div key={session.id} className="p-5 border-2 border-pink-200 rounded-lg bg-gradient-to-br from-white to-pink-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Utensils className="h-5 w-5" aria-hidden="true" />
                        {session.name}
                      </h4>
                      <p className="text-base text-gray-600 mt-1">
                        {session.startTime} - {session.endTime} | {session.headCount} people
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Dishes Selected</p>
                      <p className="text-3xl font-bold text-pink-600">{selectedDishes.length}</p>
                      <p className="text-sm text-green-600 font-semibold mt-1">Catalog estimate: ₹{sessionTotal.toLocaleString()}</p>
                      <Label className="text-xs text-gray-600">Quoted rate per person (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={session.ratePerPerson ?? 0}
                        onChange={(e) => updateSessionRate(dayIndex, sessionIndex, Math.max(0, Number(e.target.value) || 0))}
                        className="mt-1 w-36"
                      />
                      <p className="text-sm font-semibold text-gray-700 mt-1">
                        Quoted total: ₹{((session.ratePerPerson ?? 0) * session.headCount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {selectedDishes.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDishes.map((dish) => (
                        <div key={dish.selectionKey} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-pink-200 hover:border-pink-400 transition-all">
                          <div className="flex items-center gap-4 flex-1">
                            <img
                              src={dish.image}
                              alt={dish.name_en}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                              }}
                            />
                            <div className="flex-1">
                              <p className="font-bold text-gray-800">{dish.name_en || dish.name}</p>
                              <p className="text-sm text-pink-600">{dish.name_ta}</p>
                              <p className="text-xs text-gray-500">{dish.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-600">Cost per unit</Label>
                              <Input
                                type="number"
                                min="0"
                                value={customCosts[dish.selectionKey] ?? dish.estimatedCost ?? 0}
                                onChange={(e) => updateCustomCost(dish.selectionKey, parseFloat(e.target.value) || 0)}
                                className="w-24 h-10 rounded-lg border-2 border-green-200"
                              />
                            </div>
                            <div className="text-right min-w-[100px]">
                              <p className="text-xs text-gray-600">Total</p>
                              <p className="text-lg font-bold text-green-600">
                                ₹{((customCosts[dish.selectionKey] ?? dish.estimatedCost ?? 0) * session.headCount).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDish(dayIndex, sessionIndex, dish.selectionKey)}
                              className="hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 className="h-5 w-5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Add More Dishes Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-11 rounded-lg border-2 border-dashed border-pink-300 hover:bg-pink-50 text-pink-600 font-semibold"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add More Dishes to This Session
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl">Add Dishes to {session.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            {categories.map((category) => (
                              <div key={category}>
                                <h4 className="font-bold text-lg mb-3 text-pink-600">{category}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {menuData[category].map((item) => {
                                    const dishKey = buildDishKey(category, item.id);
                                    const isAlreadySelected = session.selectedDishes.includes(dishKey);
                                    return (
                                      <button
                                        key={dishKey}
                                        onClick={() => !isAlreadySelected && addDishToSession(dayIndex, sessionIndex, dishKey)}
                                        disabled={isAlreadySelected}
                                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                                          isAlreadySelected
                                            ? 'border-green-300 bg-green-50 opacity-50 cursor-not-allowed'
                                            : 'border-pink-200 hover:border-pink-400 hover:bg-pink-50'
                                        }`}
                                      >
                                        <p className="font-semibold text-sm">{item.name_en || item.name}</p>
                                        <p className="text-xs text-gray-600">{item.name_ta}</p>
                                        <p className="text-xs text-green-600 mt-1">₹{item.estimatedCost || 0}</p>
                                        {isAlreadySelected && (
                                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                            <Check className="h-3 w-3" aria-hidden="true" />
                                            Already added
                                          </p>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 italic py-4">No dishes selected for this session</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Grand Total */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-semibold">Grand Total</p>
            <p className="text-pink-100 mt-1 text-sm">Total cost for entire event</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold">₹{calculateGrandTotal().toLocaleString()}</p>
            <p className="text-pink-100 mt-1 text-sm">Including all sessions</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-5 border border-pink-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="sm:w-36 h-12 text-base font-semibold rounded-lg border-2 border-pink-300 hover:bg-pink-50"
          >
            ← Previous
          </Button>
          {onStartNewEvent && (
            <Button
              variant="outline"
              onClick={onStartNewEvent}
              className="h-12 px-4 text-base font-semibold rounded-lg border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 flex items-center justify-center gap-2"
            >
              ✨ New Event
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleManualSave}
            className="flex-1 h-12 text-base font-semibold rounded-lg border-2 border-pink-500 text-pink-700 hover:bg-pink-50 flex items-center justify-center gap-2"
          >
            <Save className="h-5 w-5 text-pink-600" />
            Save to Dashboard
          </Button>
          <Button
            onClick={onNext}
            className="flex-1 h-12 text-base font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            Continue to Generate Documents →
          </Button>
        </div>
      </div>
    </div>
  );
};
