import React, { useState } from 'react';
import EventDetails from './EventDetails';
import SessionPlanner from './SessionPlanner';
import EventReview from './EventReview';
import { EventPlanningData, SessionMenuSelection } from '../types/eventTypes';
import { useTheme } from '@/contexts/ThemeContext';

interface EventPlanningFlowProps {
  language: 'en' | 'ta';
}

type FlowStep = 'event-details' | 'session-planning' | 'review';

const EventPlanningFlow: React.FC<EventPlanningFlowProps> = ({ language }) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('event-details');
  const [eventData, setEventData] = useState<EventPlanningData | null>(null);
  const [sessions, setSessions] = useState<SessionMenuSelection[]>([]);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  const handleEventDetailsComplete = (data: EventPlanningData) => {
    setEventData(data);
    setCurrentStep('session-planning');
  };

  const handleSessionPlanningComplete = (sessionData: SessionMenuSelection[]) => {
    setSessions(sessionData);
    setCurrentStep('review');
  };

  const handleBackToEventDetails = () => {
    setCurrentStep('event-details');
  };

  const handleBackToSessionPlanning = () => {
    setCurrentStep('session-planning');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'event-details':
        return (
          <EventDetails
            onNext={handleEventDetailsComplete}
            language={language}
          />
        );

      case 'session-planning':
        if (!eventData) return null;
        return (
          <SessionPlanner
            eventData={eventData}
            onNext={handleSessionPlanningComplete}
            onBack={handleBackToEventDetails}
            language={language}
          />
        );

      case 'review':
        if (!eventData || !sessions) return null;
        return (
          <EventReview
            eventData={eventData}
            sessions={sessions}
            onBack={handleBackToSessionPlanning}
            language={language}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Progress Indicator */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep === 'event-details' ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'event-details' 
                  ? (isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white')
                  : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600')
              }`}>
                1
              </div>
              <span className="font-medium">
                {language === 'en' ? 'Event Details' : 'நிகழ்வு விவரங்கள்'}
              </span>
            </div>

            <div className={`flex items-center space-x-2 ${currentStep === 'session-planning' ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'session-planning' 
                  ? (isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white')
                  : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600')
              }`}>
                2
              </div>
              <span className="font-medium">
                {language === 'en' ? 'Session Planning' : 'அமர்வு திட்டமிடல்'}
              </span>
            </div>

            <div className={`flex items-center space-x-2 ${currentStep === 'review' ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'review' 
                  ? (isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white')
                  : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600')
              }`}>
                3
              </div>
              <span className="font-medium">
                {language === 'en' ? 'Review & Generate' : 'மதிப்பாய்வு & உருவாக்கு'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default EventPlanningFlow;
