import { useState } from 'react';
import { EventMenu, PlanningStep } from '@/types/menu';
import { Check } from 'lucide-react';
import { EventDetailsStep } from './steps/EventDetailsStep';
import { SessionPlanningStep } from './steps/SessionPlanningStep';
import { MenuSelectionStep } from './steps/MenuSelectionStep';
import { ReviewStep } from './steps/ReviewStep';
import { DocumentGenerationStep } from './steps/DocumentGenerationStep';

interface EventPlanningFlowProps {
  menu: EventMenu;
  onMenuChange: (menu: EventMenu) => void;
  onStartNewEvent?: () => void;
}

const STEPS: { id: PlanningStep; label: string; compactLabel: string }[] = [
  { id: 'event-details', label: 'Event Details', compactLabel: 'Details' },
  { id: 'session-planning', label: 'Session Planning', compactLabel: 'Sessions' },
  { id: 'menu-selection', label: 'Menu Selection', compactLabel: 'Dishes' },
  { id: 'review', label: 'Review & Summary', compactLabel: 'Review' },
  { id: 'document-generation', label: 'Generate Documents', compactLabel: 'Export' },
];

export const EventPlanningFlow: React.FC<EventPlanningFlowProps> = ({
  menu,
  onMenuChange,
  onStartNewEvent,
}) => {
  const [currentStep, setCurrentStep] = useState<PlanningStep>('event-details');

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  const handleStartNew = () => {
    setCurrentStep('event-details');
    onStartNewEvent?.();
  };

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
        <div className="planner-progress-heading">
          <div>
            <p className="planner-progress-kicker">EVENT MENU WORKFLOW</p>
            <p className="planner-progress-current">{STEPS[currentStepIndex]?.label}</p>
          </div>
          <span className="planner-progress-count">STEP {currentStepIndex + 1} OF {STEPS.length}</span>
        </div>
        <div
          className="planner-progress-track"
          role="progressbar"
          aria-label="Menu planning progress"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={currentStepIndex + 1}
        >
          <span style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }} />
        </div>
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
                <span className="planner-step-number">
                  {index < currentStepIndex ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
                </span>
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
          <ReviewStep
            menu={menu}
            onMenuChange={onMenuChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onStartNewEvent={handleStartNew}
          />
        )}
        {currentStep === 'document-generation' && (
          <DocumentGenerationStep
            menu={menu}
            onPrevious={handlePrevious}
            onStartNewEvent={handleStartNew}
          />
        )}
      </div>
    </div>
  );
};
