import React from 'react';
import { CheckCircle } from 'lucide-react';
import { PlanningStep } from '../types/eventTypes';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  language: 'en' | 'ta';
  currentStep: PlanningStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ language, currentStep }) => {
  const steps = [
    { key: 'event-details', label: language === 'en' ? 'Event Details' : 'நிகழ்வு விவரங்கள்' },
    { key: 'venue-details', label: language === 'en' ? 'Venue Details' : 'இட விவரங்கள்' },
    { key: 'session-planning', label: language === 'en' ? 'Sessions' : 'அமர்வுகள்' },
    { key: 'menu-selection', label: language === 'en' ? 'Menu' : 'மெனு' },
    { key: 'review', label: language === 'en' ? 'Review' : 'மதிப்பாய்வு' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      className="flex items-center justify-center mb-12"
    >
      {steps.map((step, index) => (
        <motion.div 
          key={step.key} 
          className="flex items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="flex flex-col items-center">
            <motion.div 
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm ${
                currentStep === step.key 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                  : index < steps.findIndex(s => s.key === currentStep)
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-muted text-muted-foreground border-border'
              }`}
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                transition: { duration: 0.2, type: "spring", bounce: 0.4 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              {index < steps.findIndex(s => s.key === currentStep) ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, type: "spring", bounce: 0.6 }}
                >
                  <CheckCircle className="w-6 h-6" />
                </motion.div>
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </motion.div>
            
            <motion.span 
              className={`text-xs mt-3 text-center max-w-20 ${
                currentStep === step.key 
                  ? 'text-primary font-medium' 
                  : index < steps.findIndex(s => s.key === currentStep)
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-muted-foreground'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              {step.label}
            </motion.span>
          </div>
          
          {/* Connection line */}
          {index < steps.length - 1 && (
            <motion.div 
              className={`w-16 h-0.5 mx-4 rounded-full ${
                index < steps.findIndex(s => s.key === currentStep) 
                  ? 'bg-green-500' 
                  : 'bg-border'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StepIndicator;
