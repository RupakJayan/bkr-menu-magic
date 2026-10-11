import { useState } from 'react';
import { EventMenu, PlanningStep } from '@/types/menu';
import { EventDetailsStep } from './steps/EventDetailsStep';
import { SessionPlanningStep } from './steps/SessionPlanningStep';
import { MenuSelectionStep } from './steps/MenuSelectionStep';
import { ReviewStep } from './steps/ReviewStep';
import { DocumentGenerationStep } from './steps/DocumentGenerationStep';

interface EventPlanningFlowProps {
  menu: EventMenu;
  onMenuChange: (menu: EventMenu) => void;
}

const STEPS: { id: PlanningStep; label: string; compactLabel: string }[] = [
  { id: 'event-details', label: 'Event Details', compactLabel: 'Details' },
  { id: 'session-planning', label: 'Session Planning', compactLabel: 'Sessions' },
  { id: 'menu-selection', label: 'Menu Selection', compactLabel: 'Dishes' },
  { id: 'review', label: 'Review & Summary', compactLabel: 'Review' },
  { id: 'document-generation', label: 'Generate Documents', compactLabel: 'Export' },
];

export const EventPlanningFlow: React.FC<EventPlanningFlowProps> = ({ menu, onMenuChange }) => {
  const [currentStep, setCurrentStep] = useState<PlanningStep>('event-details');

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const handleStepClick = (stepId: PlanningStep) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="planning-flow">
      <nav className="planner-progress" aria-label="Event planning steps">
        <ol>
          {STEPS.map((step, index) => (
            <li key={step.id} className="planner-progress-item">
              <button
                type="button"
                onClick={() => handleStepClick(step.id)}
                aria-current={currentStep === step.id ? 'step' : undefined}
                aria-label={`Step ${index + 1}: ${step.label}`}
                className={`planner-step-button ${
                  currentStep === step.id ? 'is-current' : index < currentStepIndex ? 'is-complete' : ''
                }`}
              >
                <span className="planner-step-number">{index < currentStepIndex ? '✓' : index + 1}</span>
                <span className="planner-step-label">
                  <span className="planner-step-label-full">{step.label}</span>
                  <span className="planner-step-label-compact">{step.compactLabel}</span>
                </span>
              </button>
              {index < STEPS.length - 1 && <span className={`planner-step-connector ${index < currentStepIndex ? 'is-complete' : ''}`} />}
            </li>
          ))}
        </ol>
      </nav>

      {/* Step Content */}
      <div className="planner-step-content">
        {currentStep === 'event-details' && (
          <EventDetailsStep menu={menu} onMenuChange={onMenuChange} onNext={handleNext} />
        )}
        {currentStep === 'session-planning' && (
          <SessionPlanningStep menu={menu} onMenuChange={onMenuChange} onNext={handleNext} onPrevious={handlePrevious} />
        )}
        {currentStep === 'menu-selection' && (
          <MenuSelectionStep menu={menu} onMenuChange={onMenuChange} onNext={handleNext} onPrevious={handlePrevious} />
        )}
        {currentStep === 'review' && (
          <ReviewStep menu={menu} onMenuChange={onMenuChange} onNext={handleNext} onPrevious={handlePrevious} />
        )}
        {currentStep === 'document-generation' && (
          <DocumentGenerationStep menu={menu} onPrevious={handlePrevious} />
        )}
      </div>
    </div>
  );
};
