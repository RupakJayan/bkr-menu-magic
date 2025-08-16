import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Clock, IndianRupee, Heart } from "lucide-react";

const eventTypes = [
  { id: "wedding", name: "Wedding", icon: "💒", color: "text-pink-600", popular: true },
  { id: "corporate", name: "Corporate", icon: "🏢", color: "text-blue-600", popular: true },
  { id: "birthday", name: "Birthday", icon: "🎂", color: "text-purple-600", popular: false },
  { id: "baby-shower", name: "Baby Shower", icon: "🍼", color: "text-green-600", popular: false },
  { id: "engagement", name: "Engagement", icon: "💍", color: "text-yellow-600", popular: true },
  { id: "housewarming", name: "Housewarming", icon: "🏠", color: "text-orange-600", popular: false }
];

const mealTypes = [
  { id: "breakfast", name: "Breakfast", time: "6:00 AM - 10:00 AM", dishes: ["Idli", "Dosa", "Upma", "Pongal"] },
  { id: "lunch", name: "Lunch", time: "12:00 PM - 3:00 PM", dishes: ["Rice", "Sambar", "Rasam", "Curry"] },
  { id: "dinner", name: "Dinner", time: "7:00 PM - 10:00 PM", dishes: ["Biryani", "Curry", "Dal", "Roti"] },
  { id: "special", name: "Special Items", time: "All Day", dishes: ["Sweets", "Snacks", "Beverages", "Ice Cream"] }
];

const EventPlanner = () => {
  const [selectedEventType, setSelectedEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [budgetPerLeaf, setBudgetPerLeaf] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const handleMealToggle = (mealId: string) => {
    setSelectedMeals(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  const calculateEstimate = () => {
    const guests = parseInt(guestCount) || 0;
    const budget = parseInt(budgetPerLeaf) || 0;
    const mealsCount = selectedMeals.length;
    return guests * budget * mealsCount;
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return selectedEventType !== "";
      case 2: return guestCount !== "" && eventDate !== "";
      case 3: return selectedMeals.length > 0;
      case 4: return budgetPerLeaf !== "";
      default: return false;
    }
  };

  return (
    <section id="events" className="py-20 bg-gradient-warm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Plan Your <span className="gradient-text">Perfect</span> Event
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let our AI-powered planner help you create an unforgettable dining experience 
            tailored to your event and preferences.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${currentStep >= step 
                    ? 'bg-primary text-primary-foreground shadow-glow' 
                    : 'bg-muted text-muted-foreground'}`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 mx-2 ${currentStep > step ? 'bg-primary' : 'bg-muted'}`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-muted-foreground">
            Step {currentStep} of 4
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6 md:p-8 shadow-elegant">
          {/* Step 1: Event Type */}
          {currentStep === 1 && (
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
          )}

          {/* Step 2: Guest Count & Date */}
          {currentStep === 2 && (
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
          )}

          {/* Step 3: Meal Selection */}
          {currentStep === 3 && (
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
                        <Clock className="w-4 h-4" />
                      </div>
                      <p className="text-sm opacity-90">{meal.time}</p>
                      <div className="flex flex-wrap gap-1">
                        {meal.dishes.slice(0, 3).map((dish, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {dish}
                          </Badge>
                        ))}
                        {meal.dishes.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{meal.dishes.length - 3} more
                          </Badge>
                        )}
                      </div>
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
          )}

          {/* Step 4: Budget & Summary */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-foreground mb-2">Budget & Summary</h3>
                <p className="text-muted-foreground">Set your budget per person and review your event plan</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <IndianRupee className="inline w-4 h-4 mr-1" />
                    Budget per Person (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 250"
                    value={budgetPerLeaf}
                    onChange={(e) => setBudgetPerLeaf(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="50"
                    step="10"
                  />
                </div>

                {/* Event Summary */}
                <Card className="bg-gradient-card p-6">
                  <h4 className="font-semibold text-foreground mb-4">Event Summary</h4>
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
                    {budgetPerLeaf && (
                      <div className="flex justify-between border-t border-border pt-3">
                        <span className="text-muted-foreground">Estimated Total:</span>
                        <span className="font-bold text-lg text-primary">₹{calculateEstimate().toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 4 ? (
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
                disabled={!budgetPerLeaf}
                className="group"
              >
                <Heart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Get AI Recommendations
              </Button>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default EventPlanner;