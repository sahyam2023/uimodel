import { CircleCheck as CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface VisualStepperProps {
  currentStep: number;
  isTraining: boolean;
  isComplete: boolean;
}

export function VisualStepper({ currentStep, isTraining, isComplete }: VisualStepperProps) {
  const steps = [
    { id: 1, name: 'Data Ingest', description: 'Upload and validate data' },
    { id: 2, name: 'Configure & Tune', description: 'Set parameters and hyperparameters' },
    { id: 3, name: 'Train & Validate', description: 'Execute model training' },
    { id: 4, name: 'Deploy & Predict', description: 'Deploy and test model' },
  ];

  const getStepStatus = (stepId: number) => {
    if (isComplete && stepId <= 4) return 'complete';
    if (isTraining && stepId === 3) return 'active';
    if (stepId < currentStep) return 'complete';
    if (stepId === currentStep) return 'active';
    return 'upcoming';
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${getStepStatus(step.id) === 'complete' 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : getStepStatus(step.id) === 'active'
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-slate-600 text-slate-400'
                }
              `}>
                {getStepStatus(step.id) === 'complete' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  getStepStatus(step.id) === 'upcoming' ? 'text-slate-400' : 'text-white'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-slate-500 max-w-24">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-5 h-5 text-slate-600 mx-4 mt-[-2rem]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}