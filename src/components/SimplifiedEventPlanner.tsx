import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, ArrowRight, Sparkles, Calendar, MapPin, Users, ChefHat, CheckCircle, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  EventPlan, 
  PlanningStep, 
  ClientDetails, 
  VenueDetails as VenueDetailsType,
  EventDates,
  DayPlan,
  SessionPlan 
} from '../types/eventTypes';
import { 
  createNewEventPlan, 
  calculateNumberOfDays, 
  generateDefaultDayPlan,
  validateEventPlan 
} from '../utils/eventPlanningUtils';
import { databaseService } from '../services/databaseService';
import { PDFService } from '../services/pdfService';
import { useTheme } from '@/contexts/ThemeContext';
import StepIndicator from './StepIndicator';
import EventDetails from './EventDetails';
import VenueDetails from './VenueDetails';
import SessionPlanning from './SessionPlanning';
import MenuSelection from './MenuSelection';
import EventReview from './EventReview';

interface SimplifiedEventPlannerProps {
  language: 'en' | 'ta';
}

const SimplifiedEventPlanner: React.FC<SimplifiedEventPlannerProps> = ({ language }) => {
  const [currentStep, setCurrentStep] = useState<PlanningStep>('event-details');
  const [eventPlan, setEventPlan] = useState<EventPlan>(createNewEventPlan());
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Initialize event plan when component mounts
  useEffect(() => {
    const newPlan = createNewEventPlan();
    setEventPlan(newPlan);
  }, []);

  // Update number of days when dates change
  useEffect(() => {
    const numberOfDays = calculateNumberOfDays(eventPlan.eventDates.startDate, eventPlan.eventDates.endDate);
    setEventPlan(prev => ({
      ...prev,
      eventDates: { ...prev.eventDates, numberOfDays }
    }));
  }, [eventPlan.eventDates.startDate, eventPlan.eventDates.endDate]);

  // Generate day plans when number of days changes
  useEffect(() => {
    if (eventPlan.eventDates.numberOfDays > 0) {
      const days: DayPlan[] = [];
      const startDate = new Date(eventPlan.eventDates.startDate);
      
      for (let i = 0; i < eventPlan.eventDates.numberOfDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateString = currentDate.toISOString().split('T')[0];
        days.push(generateDefaultDayPlan(dateString, i + 1));
      }
      
      setEventPlan(prev => ({ ...prev, days }));
    }
  }, [eventPlan.eventDates.numberOfDays]);

  // Update client details
  const updateClientDetails = (field: keyof ClientDetails, value: string) => {
    setEventPlan(prev => ({
      ...prev,
      clientDetails: { ...prev.clientDetails, [field]: value }
    }));
  };

  // Update venue details
  const updateVenueDetails = (field: keyof VenueDetailsType, value: string) => {
    setEventPlan(prev => ({
      ...prev,
      venueDetails: { ...prev.venueDetails, [field]: value }
    }));
  };

  // Update event dates
  const updateEventDates = (field: keyof EventDates, value: string | number) => {
    setEventPlan(prev => ({
      ...prev,
      eventDates: { ...prev.eventDates, [field]: value }
    }));
  };

  // Update session details
  const updateSession = (dayIndex: number, sessionIndex: number, field: keyof SessionPlan, value: any) => {
    setEventPlan(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        sessions: newDays[dayIndex].sessions.map((session, idx) => 
          idx === sessionIndex ? { ...session, [field]: value } : session
        )
      };
      return { ...prev, days: newDays };
    });
  };

  // Update days
  const updateDays = (newDays: DayPlan[]) => {
    setEventPlan(prev => ({ ...prev, days: newDays }));
  };

  // Toggle menu item for a session
  const toggleSessionItem = (dayIndex: number, sessionIndex: number, itemId: string) => {
    const session = eventPlan.days[dayIndex].sessions[sessionIndex];
    const isSelected = session.selectedItems.includes(itemId);
    
    if (isSelected) {
      updateSession(dayIndex, sessionIndex, 'selectedItems', session.selectedItems.filter(id => id !== itemId));
    } else {
      updateSession(dayIndex, sessionIndex, 'selectedItems', [...session.selectedItems, itemId]);
    }
  };

  // Navigation functions
  const nextStep = async () => {
    setIsLoading(true);
    const steps: PlanningStep[] = ['event-details', 'venue-details', 'session-planning', 'menu-selection', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
    setTimeout(() => setIsLoading(false), 300);
  };

  const prevStep = async () => {
    setIsLoading(true);
    const steps: PlanningStep[] = ['event-details', 'venue-details', 'session-planning', 'menu-selection', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
    setTimeout(() => setIsLoading(false), 300);
  };

  // Validation functions
  const canProceedFromEventDetails = () => {
    return eventPlan.clientDetails.name.trim() !== '' && 
           eventPlan.clientDetails.phone.trim() !== '' &&
           eventPlan.eventDates.startDate !== '' &&
           eventPlan.eventDates.endDate !== '';
  };

  const canProceedFromVenue = () => {
    return eventPlan.venueDetails.name.trim() !== '' && 
           eventPlan.venueDetails.address.trim() !== '';
  };

  // Generate PDF
  const generatePDF = async (pdfLanguage: 'en' | 'ta') => {
    setIsGeneratingPDF(true);
    
    try {
      await PDFService.generateEventPDF(eventPlan, pdfLanguage);
      
      // Save to database
      await databaseService.createEvent(eventPlan);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(language === 'en' ? 'Error generating PDF. Please try again.' : 'PDF உருவாக்குவதில் பிழை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Reset for new event
  const resetForNewEvent = () => {
    setEventPlan(createNewEventPlan());
    setCurrentStep('event-details');
    setCurrentDayIndex(0);
    setCurrentSessionIndex(0);
  };

  // Get current session items
  const getCurrentSessionItems = () => {
    if (eventPlan.days.length > 0 && eventPlan.days[currentDayIndex]) {
      return eventPlan.days[currentDayIndex].sessions[currentSessionIndex]?.selectedItems || [];
    }
    return [];
  };

  // Handle menu item toggle for current session
  const handleMenuItemToggle = (itemId: string) => {
    toggleSessionItem(currentDayIndex, currentSessionIndex, itemId);
  };

  // Get current session info
  const getCurrentSessionInfo = () => {
    if (eventPlan.days.length > 0 && eventPlan.days[currentDayIndex]) {
      const session = eventPlan.days[currentDayIndex].sessions[currentSessionIndex];
      if (session) {
        return {
          name: language === 'en' ? session.sessionName : session.sessionNameTa,
          time: `${session.timeRange.startTime} - ${session.timeRange.endTime}`,
          headCount: session.headCount
        };
      }
    }
    return null;
  };

  return (
    <motion.div 
      className={`max-w-7xl mx-auto p-6 space-y-8 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
    >
      {/* Enhanced Header */}
      <motion.div 
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full px-6 py-3 shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold text-sm">
            {language === 'en' ? 'Event Planning Tool' : 'நிகழ்வு திட்டமிடல் கருவி'}
          </span>
        </motion.div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 leading-tight">
          {language === 'en' ? 'Event Planner' : 'நிகழ்வு திட்டமிடுநர்'}
        </h1>
        <p className={`text-xl max-w-3xl mx-auto leading-relaxed font-light ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {language === 'en' 
            ? 'Plan your complete event with step-by-step guidance and professional tools'
            : 'படிப்படியான வழிகாட்டுதலுடன் மற்றும் தொழில்முறை கருவிகளுடன் உங்கள் முழு நிகழ்வைத் திட்டமிடுங்கள்'
          }
        </p>
      </motion.div>

      {/* Step Indicator */}
      <StepIndicator language={language} currentStep={currentStep} />

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center space-y-4">
            <motion.div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className={`text-lg font-medium ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'Loading...' : 'ஏற்றுகிறது...'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Event Details Step */}
      {currentStep === 'event-details' && (
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {language === 'en' ? 'Event Details Step' : 'நிகழ்வு விவரங்கள் படி'}
          </h2>
          <p className={`mb-6 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {language === 'en' ? 'This step will be implemented with proper event details form' : 'இந்த படி சரியான நிகழ்வு விவரங்கள் படிவத்துடன் செயல்படுத்தப்படும்'}
          </p>
          <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
            {language === 'en' ? 'Next Step' : 'அடுத்த படி'}
          </Button>
        </div>
      )}

      {/* Venue Details Step */}
      {currentStep === 'venue-details' && (
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {language === 'en' ? 'Venue Details Step' : 'இட விவரங்கள் படி'}
          </h2>
          <p className={`mb-6 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {language === 'en' ? 'This step will be implemented with proper venue details form' : 'இந்த படி சரியான இட விவரங்கள் படிவத்துடன் செயல்படுத்தப்படும்'}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={prevStep}>
              {language === 'en' ? 'Previous' : 'முந்தைய'}
            </Button>
            <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
              {language === 'en' ? 'Next Step' : 'அடுத்த படி'}
            </Button>
          </div>
        </div>
      )}

      {/* Session Planning Step */}
      {currentStep === 'session-planning' && (
        <>
          <SessionPlanning
            language={language}
            days={eventPlan.days}
            onSessionUpdate={(dayIndex: number, sessionIndex: number, updates: Partial<SessionPlan>) => {
              const newDays = [...eventPlan.days];
              if (newDays[dayIndex] && newDays[dayIndex].sessions[sessionIndex]) {
                newDays[dayIndex].sessions[sessionIndex] = {
                  ...newDays[dayIndex].sessions[sessionIndex],
                  ...updates
                };
                updateDays(newDays);
              }
            }}
            updateDays={updateDays}
          />
          <motion.div 
            className="flex justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              variant="outline"
              onClick={prevStep}
              disabled={isLoading}
              className="flex items-center gap-3 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-2xl px-6 py-3 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              {language === 'en' ? 'Previous' : 'முந்தைய'}
            </Button>
            <Button 
              onClick={nextStep}
              disabled={isLoading}
              className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 rounded-2xl px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {language === 'en' ? 'Next: Menu Selection' : 'அடுத்து: மெனு தேர்வு'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </>
      )}

      {/* Menu Selection Step */}
      {currentStep === 'menu-selection' && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          >
            <Card className={`border-0 shadow-xl rounded-3xl overflow-hidden backdrop-blur-xl ${
              isDark ? 'bg-gray-900/80' : 'bg-white/80'
            }`}>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-4 py-2 mb-4 shadow-lg"
                  >
                    <ChefHat className="w-4 h-4" />
                    <span className="font-medium text-sm">
                      {language === 'en' ? 'Step 4 of 5' : '5 இல் 4 வது படி'}
                    </span>
                  </motion.div>
                  
                  <h3 className={`text-2xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {language === 'en' ? 'Menu Selection' : 'மெனு தேர்வு'}
                  </h3>
                  <p className={`max-w-2xl mx-auto ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {language === 'en' 
                      ? 'Select dishes for each session. Use the tabs below to navigate between days and sessions.'
                      : 'ஒவ்வொரு அமர்வுக்கும் உணவுகளைத் தேர்ந்தெடுக்கவும். நாட்கள் மற்றும் அமர்வுகளுக்கு இடையே செல்ல கீழே உள்ள தாவல்களைப் பயன்படுத்தவும்.'
                    }
                  </p>
                </div>

                <Tabs value={`${currentDayIndex}-${currentSessionIndex}`} className="w-full">
                  <TabsList className="grid w-full grid-cols-1 mb-6">
                    {eventPlan.days.map((day, dayIndex) => (
                      <TabsTrigger 
                        key={day.date} 
                        value={`${dayIndex}-0`}
                        onClick={() => {
                          setCurrentDayIndex(dayIndex);
                          setCurrentSessionIndex(0);
                        }}
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-2xl py-4 transition-all duration-300"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {language === 'en' ? `Day ${day.dayNumber}` : `நாள் ${day.dayNumber}`} - {day.date}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {eventPlan.days.map((day, dayIndex) => (
                    <TabsContent key={day.date} value={`${dayIndex}-0`} className="space-y-6">
                      {/* Session Selection */}
                      <div className="flex gap-3 overflow-x-auto pb-4">
                        {day.sessions.map((session, sessionIndex) => (
                          <motion.div
                            key={session.id}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2, type: "spring", bounce: 0.4 }}
                          >
                            <Button
                              variant={currentSessionIndex === sessionIndex ? "default" : "outline"}
                              size="lg"
                              onClick={() => {
                                setCurrentSessionIndex(sessionIndex);
                              }}
                              className={`whitespace-nowrap flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                                currentSessionIndex === sessionIndex 
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                                  : 'border-2 border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                              }`}
                            >
                              <span className="text-xl">
                                {session.sessionName === 'Breakfast' ? '🌅' :
                                 session.sessionName === 'Lunch' ? '🍽️' :
                                 session.sessionName === 'Dinner' ? '🌙' :
                                 session.sessionName.includes('Snack') ? '☕' :
                                 session.sessionName.includes('Packing') ? '📦' : '🍴'}
                              </span>
                              <span className="font-medium">
                                {language === 'en' ? session.sessionName : session.sessionNameTa}
                              </span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>

                      {/* Current Session Info */}
                      {day.sessions[currentSessionIndex] && (
                        <motion.div 
                          className={`mb-6 p-6 rounded-2xl border ${
                            isDark 
                              ? 'bg-gradient-to-r from-purple-950/30 to-pink-950/30 border-purple-800/50' 
                              : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100'
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        >
                          <h4 className={`text-xl font-semibold mb-3 ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {language === 'en' ? day.sessions[currentSessionIndex].sessionName : day.sessions[currentSessionIndex].sessionNameTa}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-purple-500" />
                              <span className={`${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {language === 'en' 
                                  ? `Time: ${day.sessions[currentSessionIndex].timeRange.startTime} - ${day.sessions[currentSessionIndex].timeRange.endTime}`
                                  : `நேரம்: ${day.sessions[currentSessionIndex].timeRange.startTime} - ${day.sessions[currentSessionIndex].timeRange.endTime}`
                                }
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Users className="w-5 h-5 text-purple-500" />
                              <span className={`${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {language === 'en' 
                                  ? `Head Count: ${day.sessions[currentSessionIndex].headCount}`
                                  : `தலை எண்ணிக்கை: ${day.sessions[currentSessionIndex].headCount}`
                                }
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Menu Selection */}
                      <MenuSelection
                        language={language}
                        selectedItems={getCurrentSessionItems()}
                        onItemsChange={(items) => {
                          const session = eventPlan.days[currentDayIndex].sessions[currentSessionIndex];
                          if (session) {
                            updateSession(currentDayIndex, currentSessionIndex, 'selectedItems', items);
                          }
                        }}
                        headCount={eventPlan.days[currentDayIndex]?.sessions[currentSessionIndex]?.headCount || 0}
                        onHeadCountChange={(count) => {
                          const session = eventPlan.days[currentDayIndex].sessions[currentSessionIndex];
                          if (session) {
                            updateSession(currentDayIndex, currentSessionIndex, 'headCount', count);
                          }
                        }}
                        sessionName={getCurrentSessionInfo()?.name}
                        sessionTime={getCurrentSessionInfo()?.time}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="flex justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              variant="outline"
              onClick={prevStep}
              disabled={isLoading}
              className="flex items-center gap-3 border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-2xl px-6 py-3 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              {language === 'en' ? 'Previous' : 'முந்தைய'}
            </Button>
            <Button 
              onClick={nextStep}
              disabled={isLoading}
              className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 rounded-2xl px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {language === 'en' ? 'Next: Review & Generate' : 'அடுத்து: மதிப்பாய்வு & உருவாக்கம்'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </>
      )}

      {/* Review Step */}
      {currentStep === 'review' && (
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {language === 'en' ? 'Review & Generate Step' : 'மதிப்பாய்வு & உருவாக்கம் படி'}
          </h2>
          <p className={`mb-6 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {language === 'en' ? 'This step will be implemented with proper review and PDF generation' : 'இந்த படி சரியான மதிப்பாய்வு மற்றும் PDF உருவாக்கத்துடன் செயல்படுத்தப்படும்'}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={prevStep}>
              {language === 'en' ? 'Previous' : 'முந்தைய'}
            </Button>
            <Button onClick={resetForNewEvent} className="bg-green-600 hover:bg-green-700">
              {language === 'en' ? 'Start New Event' : 'புதிய நிகழ்வைத் தொடங்கவும்'}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SimplifiedEventPlanner;
