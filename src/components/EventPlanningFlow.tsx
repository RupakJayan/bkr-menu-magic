import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventDetails from './EventDetails';
import SessionPlanner from './SessionPlanner';
import EventReview from './EventReview';
import { EventPlanningData, SessionMenuSelection } from '../types/eventTypes';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Save, Download, Upload, ArrowLeft, ArrowRight, CheckCircle, Clock, Users, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EventPlanningFlowProps {
  language: 'en' | 'ta';
}

type FlowStep = 'event-details' | 'session-planning' | 'review';

const EventPlanningFlow: React.FC<EventPlanningFlowProps> = ({ language }) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('event-details');
  const [eventData, setEventData] = useState<EventPlanningData | null>(null);
  const [sessions, setSessions] = useState<SessionMenuSelection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();

  const isDark = resolvedTheme === 'dark';

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedEventData = localStorage.getItem('bkr-event-data');
    const savedSessions = localStorage.getItem('bkr-sessions-data');
    
    if (savedEventData) {
      try {
        setEventData(JSON.parse(savedEventData));
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Error loading saved event data:', error);
      }
    }
    
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (error) {
        console.error('Error loading saved sessions:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (eventData) {
      localStorage.setItem('bkr-event-data', JSON.stringify(eventData));
      setHasUnsavedChanges(false);
    }
  }, [eventData]);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('bkr-sessions-data', JSON.stringify(sessions));
    }
  }, [sessions]);

  const handleEventDetailsComplete = (data: EventPlanningData) => {
    setEventData(data);
    setCurrentStep('session-planning');
    setHasUnsavedChanges(true);
    toast({
      title: language === 'en' ? 'Event Details Saved' : 'நிகழ்வு விவரங்கள் சேமிக்கப்பட்டன',
      description: language === 'en' ? 'Proceeding to session planning' : 'அமர்வு திட்டமிடலுக்கு செல்கிறது',
    });
  };

  const handleSessionPlanningComplete = (sessionData: SessionMenuSelection[]) => {
    setSessions(sessionData);
    setCurrentStep('review');
    setHasUnsavedChanges(true);
    toast({
      title: language === 'en' ? 'Sessions Planned' : 'அமர்வுகள் திட்டமிடப்பட்டன',
      description: language === 'en' ? 'Ready for final review' : 'இறுதி மதிப்பாய்வுக்கு தயார்',
    });
  };

  const handleBackToEventDetails = () => {
    setCurrentStep('event-details');
  };

  const handleBackToSessionPlanning = () => {
    setCurrentStep('session-planning');
  };

  const handleSaveProgress = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setHasUnsavedChanges(false);
      toast({
        title: language === 'en' ? 'Progress Saved' : 'முன்னேற்றம் சேமிக்கப்பட்டது',
        description: language === 'en' ? 'Your event planning progress has been saved' : 'உங்கள் நிகழ்வு திட்டமிடல் முன்னேற்றம் சேமிக்கப்பட்டது',
      });
    }, 1000);
  };

  const handleExportEvent = () => {
    if (!eventData || !sessions) {
      toast({
        title: language === 'en' ? 'No Data to Export' : 'ஏற்றுமதிக்க தரவு இல்லை',
        description: language === 'en' ? 'Please complete event planning first' : 'முதலில் நிகழ்வு திட்டமிடலை முடிக்கவும்',
        variant: 'destructive',
      });
      return;
    }

    const exportData = {
      event: eventData,
      sessions: sessions,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-plan-${eventData.clientName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: language === 'en' ? 'Event Exported' : 'நிகழ்வு ஏற்றுமதி செய்யப்பட்டது',
      description: language === 'en' ? 'Event plan has been downloaded' : 'நிகழ்வு திட்டம் பதிவிறக்கப்பட்டது',
    });
  };

  const handleImportEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (importedData.event && importedData.sessions) {
          setEventData(importedData.event);
          setSessions(importedData.sessions);
          setHasUnsavedChanges(true);
          toast({
            title: language === 'en' ? 'Event Imported' : 'நிகழ்வு இறக்குமதி செய்யப்பட்டது',
            description: language === 'en' ? 'Event plan has been loaded successfully' : 'நிகழ்வு திட்டம் வெற்றிகரமாக ஏற்றப்பட்டது',
          });
        }
      } catch (error) {
        toast({
          title: language === 'en' ? 'Import Failed' : 'இறக்குமதி தோல்வி',
          description: language === 'en' ? 'Invalid file format' : 'தவறான கோப்பு வடிவம்',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const getStepStatus = (step: FlowStep) => {
    if (step === currentStep) return 'current';
    if (step === 'event-details') return eventData ? 'completed' : 'pending';
    if (step === 'session-planning') return sessions.length > 0 ? 'completed' : 'pending';
    if (step === 'review') return 'pending';
    return 'pending';
  };

  const getStepIcon = (step: FlowStep, status: string) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5" />;
    if (status === 'current') return <Clock className="w-5 h-5" />;
    return <div className="w-5 h-5 rounded-full border-2 border-current" />;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'event-details':
        return (
          <motion.div
            key="event-details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <EventDetails
              onNext={handleEventDetailsComplete}
              language={language}
              initialData={eventData}
            />
          </motion.div>
        );

      case 'session-planning':
        if (!eventData) return null;
        return (
          <motion.div
            key="session-planning"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <SessionPlanner
              eventData={eventData}
              onNext={handleSessionPlanningComplete}
              onBack={handleBackToEventDetails}
              language={language}
              initialSessions={sessions}
            />
          </motion.div>
        );

      case 'review':
        if (!eventData || !sessions) return null;
        return (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <EventReview
              eventData={eventData}
              sessions={sessions}
              onBack={handleBackToSessionPlanning}
              language={language}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Enhanced Progress Indicator */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm sticky top-0 z-10`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-8 mb-4">
            {(['event-details', 'session-planning', 'review'] as FlowStep[]).map((step, index) => {
              const status = getStepStatus(step);
              const isCurrent = step === currentStep;
              const isCompleted = status === 'completed';
              
              return (
                <motion.div
                  key={step}
                  className={`flex items-center space-x-2 transition-all duration-300 ${
                    isCurrent 
                      ? (isDark ? 'text-blue-400' : 'text-blue-600')
                      : isCompleted
                        ? (isDark ? 'text-green-400' : 'text-green-600')
                        : (isDark ? 'text-gray-500' : 'text-gray-400')
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    isCurrent 
                      ? (isDark ? 'bg-blue-500 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg')
                      : isCompleted
                        ? (isDark ? 'bg-green-500 text-white' : 'bg-green-600 text-white')
                        : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600')
                  }`}>
                    {getStepIcon(step, status)}
                  </div>
                  <span className="font-medium">
                    {step === 'event-details' && (language === 'en' ? 'Event Details' : 'நிகழ்வு விவரங்கள்')}
                    {step === 'session-planning' && (language === 'en' ? 'Session Planning' : 'அமர்வு திட்டமிடல்')}
                    {step === 'review' && (language === 'en' ? 'Review & Generate' : 'மதிப்பாய்வு & உருவாக்கு')}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveProgress}
                disabled={isLoading || !hasUnsavedChanges}
                className={isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? (language === 'en' ? 'Saving...' : 'சேமிக்கிறது...') : (language === 'en' ? 'Save Progress' : 'முன்னேற்றத்தை சேமிக்கவும்')}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportEvent}
                disabled={!eventData || !sessions}
                className={isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              >
                <Download className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Export' : 'ஏற்றுமதி'}
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportEvent}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="import-event"
                />
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className={isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                >
                  <label htmlFor="import-event">
                    <Upload className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Import' : 'இறக்குமதி'}
                  </label>
                </Button>
              </div>
            </div>

            {/* Event Summary */}
            {eventData && (
              <Card className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'} border shadow-sm`}>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {eventData.clientName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {eventData.venue}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <AnimatePresence mode="wait">
          {renderCurrentStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventPlanningFlow;
