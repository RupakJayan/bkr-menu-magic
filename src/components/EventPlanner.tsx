import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Clock, IndianRupee, Heart, FileText, ChefHat } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { menuData, mealCategories } from "@/data/menuData";

// Event types
const eventTypes = [
  { id: "wedding", name: "Wedding", icon: "💒", color: "text-pink-600", popular: true },
  { id: "corporate", name: "Corporate", icon: "🏢", color: "text-blue-600", popular: true },
  { id: "birthday", name: "Birthday", icon: "🎂", color: "text-purple-600", popular: false },
  { id: "baby-shower", name: "Baby Shower", icon: "🍼", color: "text-green-600", popular: false },
  { id: "engagement", name: "Engagement", icon: "💍", color: "text-yellow-600", popular: true },
  { id: "housewarming", name: "Housewarming", icon: "🏠", color: "text-orange-600", popular: false }
];

// Meal types with time slots
const mealTypes = [
  { id: "breakfast", name: "Morning Breakfast", time: "6:00 AM - 10:00 AM", icon: "🌅" },
  { id: "lunch", name: "Lunch", time: "12:00 PM - 3:00 PM", icon: "☀️" },
  { id: "dinner", name: "Dinner", time: "7:00 PM - 10:00 PM", icon: "🌙" },
  { id: "snacks", name: "Evening Snacks", time: "4:00 PM - 6:00 PM", icon: "🍵" }
];

// Menu items organized by meal type using comprehensive menu data
const getMenuItemsForMeal = (mealId: string) => {
  const categories = mealCategories[mealId as keyof typeof mealCategories] || [];
  const items: any[] = [];
  
  categories.forEach(category => {
    if (menuData[category]) {
      menuData[category].forEach(item => {
        items.push({
          ...item,
          id: item.id,
          name_en: item.name_en,
          name_ta: item.name_ta,
          price: item.price,
          isVegetarian: item.isVegetarian,
          image: item.image
        });
      });
    }
  });
  
  return items;
};

const menuItemsByMeal = {
  breakfast: getMenuItemsForMeal("Morning Breakfast"),
  lunch: getMenuItemsForMeal("Lunch"),
  dinner: getMenuItemsForMeal("Dinner"),
  snacks: getMenuItemsForMeal("Evening Snacks")
};

const EventPlanner = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEventType, setSelectedEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [menuSelections, setMenuSelections] = useState<{[mealId: string]: {[itemId: number]: number}}>({});
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  const totalSteps = 4 + selectedMeals.length;

  const handleMealToggle = (mealId: string) => {
    setSelectedMeals(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  const addMenuItem = (mealId: string, itemId: number) => {
    setMenuSelections(prev => ({
      ...prev,
      [mealId]: {
        ...(prev[mealId] || {}),
        [itemId]: (prev[mealId]?.[itemId] || 0) + 1
      }
    }));
  };

  const removeMenuItem = (mealId: string, itemId: number) => {
    setMenuSelections(prev => {
      const newSelections = { ...prev };
      if (newSelections[mealId]?.[itemId] > 1) {
        newSelections[mealId][itemId] -= 1;
      } else if (newSelections[mealId]) {
        delete newSelections[mealId][itemId];
        if (Object.keys(newSelections[mealId]).length === 0) {
          delete newSelections[mealId];
        }
      }
      return newSelections;
    });
  };

  const getMealTotal = (mealId: string) => {
    const selections = menuSelections[mealId] || {};
    return Object.entries(selections).reduce((total, [itemId, quantity]) => {
      return total + quantity;
    }, 0);
  };

  const getTotalHeadCount = () => {
    return Object.keys(menuSelections).reduce((total, mealId) => {
      return total + getMealTotal(mealId);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(menuSelections).reduce((total, mealSelections) => {
      return total + Object.values(mealSelections).reduce((mealTotal, quantity) => mealTotal + quantity, 0);
    }, 0);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return selectedEventType !== "";
      case 2: return guestCount !== "" && eventDate !== "";
      case 3: return selectedMeals.length > 0;
      default: return true;
    }
  };

  const generatePDF = async () => {
    try {
      const pdf = new jsPDF();
      
      // Add watermark
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(60);
      pdf.text("BKR CATERING", 105, 140, { align: "center", angle: 45 });
      
      // Reset text color for content
      pdf.setTextColor(0, 0, 0);
      
      // Add company header with logo placeholder
      pdf.setFontSize(28);
      pdf.setTextColor(139, 69, 19); // Brown color for BKR branding
      pdf.text("BKR CATERING", 105, 25, { align: "center" });
      
      pdf.setFontSize(14);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Anaimalai, Pollachi • 8012686883", 105, 35, { align: "center" });
      
      // Add event details box (similar to your PDF format)
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Event Details", 20, 55);
      
      // Draw box around event details
      pdf.rect(20, 60, 170, 40);
      
      pdf.setFontSize(12);
      pdf.text(`Event Type: ${eventTypes.find(t => t.id === selectedEventType)?.name}`, 25, 75);
      pdf.text(`Number of Guests: ${guestCount}`, 25, 85);
      pdf.text(`Event Date: ${eventDate}`, 25, 95);
      pdf.text(`Selected Meals: ${selectedMeals.map(id => mealTypes.find(m => m.id === id)?.name).join(", ")}`, 25, 105);
      
      // Add menu selections by meal
      let yPosition = 120;
      selectedMeals.forEach((mealId) => {
        const meal = mealTypes.find(m => m.id === mealId);
        const selections = menuSelections[mealId] || {};
        
        if (Object.keys(selections).length > 0) {
          pdf.setFontSize(16);
          pdf.setTextColor(139, 69, 19); // Brown color
          pdf.text(`${meal?.icon} ${meal?.name}`, 20, yPosition);
          yPosition += 10;
          
          // Add head count for this meal
          const mealHeadCount = getMealTotal(mealId);
          pdf.setFontSize(12);
          pdf.text(`Head Count: ${mealHeadCount}`, 150, yPosition - 10);
          
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          let itemCount = 1;
          Object.entries(selections).forEach(([itemId, quantity]) => {
            const menuItems = menuItemsByMeal[mealId as keyof typeof menuItemsByMeal] || [];
            const item = menuItems.find(i => i.id === parseInt(itemId));
            pdf.text(`${itemCount}. ${item?.name_en} (${item?.name_ta})`, 25, yPosition);
            yPosition += 7;
            itemCount++;
          });
          
          yPosition += 10;
        }
      });
      
      // Add total summary
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Event Summary", 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(12);
      pdf.text(`Total Menu Items Selected: ${getTotalItems()}`, 20, yPosition);
      yPosition += 10;
      pdf.text(`Total Head Count: ${getTotalHeadCount()}`, 20, yPosition);
      
      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Thank you for choosing BKR Catering!", 105, 280, { align: "center" });
      pdf.text("Generated on: " + new Date().toLocaleDateString(), 105, 285, { align: "center" });
      
      // Save the PDF
      pdf.save(`BKR_Event_${selectedEventType}_${eventDate}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-foreground mb-2">What's the occasion?</h3>
                <p className="text-muted-foreground">Choose your event type to get personalized recommendations</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {eventTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedEventType === type.id 
                        ? 'bg-primary text-primary-foreground shadow-glow' 
                        : 'bg-background hover:bg-secondary-warm'
                    }`}
                    onClick={() => setSelectedEventType(type.id)}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-2xl">{type.icon}</div>
                      <div className="font-semibold">{type.name}</div>
                      {type.popular && (
                        <Badge variant="outline" className="text-xs">Popular</Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
      );
    }

    if (currentStep === 2) {
      return (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-foreground mb-2">Event Details</h3>
                <p className="text-muted-foreground">Tell us about your guest count and preferred date</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 150"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="bg-secondary-warm rounded-lg p-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Service available in Pollachi and surrounding areas</span>
                </div>
              </div>
            </div>
      );
    }

    if (currentStep === 3) {
      return (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-foreground mb-2">Choose Your Meals</h3>
                <p className="text-muted-foreground">Select the meal types for your event</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {mealTypes.map((meal) => (
                  <Card
                    key={meal.id}
                    className={`p-4 cursor-pointer transition-all duration-300 ${
                      selectedMeals.includes(meal.id)
                        ? 'bg-primary text-primary-foreground shadow-glow'
                        : 'bg-background hover:bg-secondary-warm'
                    }`}
                    onClick={() => handleMealToggle(meal.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{meal.name}</h4>
                    <span className="text-2xl">{meal.icon}</span>
                      </div>
                      <p className="text-sm opacity-90">{meal.time}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {selectedMeals.length > 0 && (
                <div className="text-center text-sm text-muted-foreground">
                  {selectedMeals.length} meal type(s) selected
                </div>
              )}
            </div>
      );
    }

    // Menu selection steps for each meal
    if (currentStep > 3 && currentStep <= 3 + selectedMeals.length) {
      const mealIndex = currentStep - 4;
      const mealId = selectedMeals[mealIndex];
      const meal = mealTypes.find(m => m.id === mealId);
      const menuItems = menuItemsByMeal[mealId as keyof typeof menuItemsByMeal] || [];
      const selections = menuSelections[mealId] || {};

      return (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              {meal?.icon} {meal?.name} Menu Selection
            </h3>
            <p className="text-muted-foreground">
              Select items for {guestCount} guests • {meal?.time}
            </p>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-center gap-2">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('en')}
            >
              English
            </Button>
            <Button
              variant={language === 'ta' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('ta')}
            >
              தமிழ்
            </Button>
              </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start gap-4">
                  <img 
                    src={item.image} 
                    alt={language === 'en' ? item.name_en : item.name_ta}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">
                      {language === 'en' ? item.name_en : item.name_ta}
                    </h4>
                    {language === 'ta' && (
                      <p className="text-sm text-muted-foreground">{item.name_en}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={item.isVegetarian ? "default" : "secondary"} className="text-xs">
                        {item.isVegetarian ? "🟢 Veg" : "🔴 Non-Veg"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selections[item.id] ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeMenuItem(mealId, item.id)}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium min-w-[20px] text-center">
                          {selections[item.id]}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addMenuItem(mealId, item.id)}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => addMenuItem(mealId, item.id)}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

                     {/* Meal Summary */}
           {Object.keys(selections).length > 0 && (
             <Card className="bg-gradient-card p-4">
               <div className="flex items-center justify-between">
                 <div>
                   <h4 className="font-semibold text-foreground">Selected Items: {Object.values(selections).reduce((a, b) => a + b, 0)}</h4>
                   <p className="text-sm text-muted-foreground">
                     {Object.entries(selections).map(([itemId, quantity]) => {
                       const item = menuItems.find(i => i.id === parseInt(itemId));
                       return `${item?.name_en} (${quantity})`;
                     }).join(", ")}
                   </p>
                 </div>
                 <div className="text-right">
                   <div className="text-lg font-bold text-primary">Head Count: {getMealTotal(mealId)}</div>
                   <div className="text-sm text-muted-foreground">For this meal</div>
                 </div>
               </div>
             </Card>
           )}

           {/* Skip Meal Option */}
           {Object.keys(selections).length === 0 && (
             <Card className="bg-muted/50 p-4 text-center">
               <p className="text-muted-foreground mb-3">
                 No items selected for this meal. You can skip this meal or select items above.
               </p>
               <Button 
                 variant="outline" 
                 size="sm"
                 onClick={() => nextStep()}
               >
                 Skip This Meal
               </Button>
             </Card>
           )}
        </div>
      );
    }

    // Final summary step
    if (currentStep === totalSteps) {
      return (
        <div className="space-y-6 animate-slide-up">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-foreground mb-2">Event Summary & Confirmation</h3>
            <p className="text-muted-foreground">Review your event details and menu selections</p>
                </div>

                {/* Event Summary */}
                <Card className="bg-gradient-card p-6">
            <h4 className="font-semibold text-foreground mb-4">Event Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Event Type:</span>
                      <span className="font-medium">
                        {eventTypes.find(t => t.id === selectedEventType)?.name} 
                        {eventTypes.find(t => t.id === selectedEventType)?.icon}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests:</span>
                      <span className="font-medium">{guestCount} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{eventDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Meals:</span>
                      <span className="font-medium">
                        {selectedMeals.map(id => mealTypes.find(m => m.id === id)?.name).join(", ")}
                      </span>
                    </div>
            </div>
          </Card>

          {/* Menu Summary */}
          <Card className="p-6">
            <h4 className="font-semibold text-foreground mb-4">Menu Selections</h4>
            <div className="space-y-4">
              {selectedMeals.map((mealId) => {
                const meal = mealTypes.find(m => m.id === mealId);
                const selections = menuSelections[mealId] || {};
                const mealTotal = getMealTotal(mealId);
                
                if (Object.keys(selections).length === 0) return null;
                
                return (
                  <div key={mealId} className="border-b border-border pb-3 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-foreground">{meal?.icon} {meal?.name}</h5>
                      <span className="text-sm font-medium text-primary">₹{mealTotal}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(selections).map(([itemId, quantity]) => {
                        const menuItems = menuItemsByMeal[mealId as keyof typeof menuItemsByMeal] || [];
                        const item = menuItems.find(i => i.id === parseInt(itemId));
                        return `${item?.name_en} (${quantity})`;
                      }).join(", ")}
                      </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-foreground">Total Items: {getTotalItems()}</div>
                  <div className="text-sm text-muted-foreground">Across all meals</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">Total Head Count: {getTotalHeadCount()}</div>
                  <div className="text-sm text-muted-foreground">For your event</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }
  };

  return (
    <section id="events" className="py-20 bg-gradient-warm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Plan Your <span className="gradient-text">Perfect</span> Event
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create your dream event with our step-by-step planner. Select your menu items 
            for each meal and get a complete event summary.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${currentStep >= step 
                    ? 'bg-primary text-primary-foreground shadow-glow' 
                    : 'bg-muted text-muted-foreground'}`}>
                  {step}
                </div>
                {step < totalSteps && (
                  <div className={`w-8 h-0.5 mx-1 ${currentStep > step ? 'bg-primary' : 'bg-muted'}`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6 md:p-8 shadow-elegant">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                variant="hero"
                onClick={nextStep}
                disabled={!canProceedToNext()}
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="glow"
                onClick={generatePDF}
                className="group"
              >
                <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Generate Event PDF
              </Button>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default EventPlanner;