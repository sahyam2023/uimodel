import { useState, useEffect } from 'react';
import { VisualStepper } from '@/components/Workspace/VisualStepper';
import { DataIngestCard } from '@/components/Workspace/DataIngestCard';
import { ConfigurationCard } from '@/components/Workspace/ConfigurationCard';
import { TrainingCard } from '@/components/Workspace/TrainingCard';
import { DeploymentCard } from '@/components/Workspace/DeploymentCard';
import { LiveMonitoringSidebar } from '@/components/Workspace/LiveMonitoringSidebar';
import { ModelParameters, GenerationResult, TrainingStatus } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

// Define a comprehensive state for the entire workspace
interface WorkspaceState {
  status: TrainingStatus;
  isFileUploaded: boolean;
  modelParameters: ModelParameters | null;
  estimatedTrainingTime: number;
  generationResult: GenerationResult | null;
}

interface WorkspaceProps {
  workspaceState: WorkspaceState;
  onStartTraining: (params: ModelParameters) => void;
  onStopTraining: () => void;
  onFileUploadSuccess: (isSuccess: boolean) => void;
  onParametersChange: (params: ModelParameters) => void;
}

const initialModelParameters: ModelParameters = {
  analyticsType: 'Predictive Analytics',
  domain: 'Transport',
  modelType: 'Regression',
  trainingTime: 4,
  handleMissingData: 'none',
  dataCleaning: 'none',
  featureScaling: 'none',
  geoFencing: true,
  calculateDistance: false,
  learningRate: 0.01,
  epochs: 100,
  batchSize: 32,
  validationType: 'train-test',
  trainTestSplit: 80,
  kFolds: 5,
};

export function Workspace({
  workspaceState,
  onStartTraining,
  onStopTraining,
  onFileUploadSuccess,
  onParametersChange,
}: WorkspaceProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    status,
    isFileUploaded,
    modelParameters,
    estimatedTrainingTime,
    generationResult,
    trainingStartTime,
  } = workspaceState;

  const isTraining = status === 'training';
  const isComplete = status === 'completed';
  const isStopped = status === 'stopped';

  useEffect(() => {
    // If modelParameters is null in the global state, initialize it.
    if (!modelParameters) {
      onParametersChange(initialModelParameters);
    }
  }, [modelParameters, onParametersChange]);

  useEffect(() => {
    if (isTraining) setCurrentStep(3);
    else if (isComplete) setCurrentStep(4);
    else if (isFileUploaded) setCurrentStep(2);
    else setCurrentStep(1);
  }, [isTraining, isComplete, isFileUploaded]);

  const handleStartTrainingClick = () => {
    if (modelParameters) {
      onStartTraining(modelParameters);
    }
  };

  if (!modelParameters) {
    // Render a loading state or null while parameters are being initialized
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">AI Model Workspace</h2>
        <p className="text-slate-400">
          Build, train, and deploy machine learning models with our comprehensive workflow
        </p>
      </div>

      <VisualStepper
        currentStep={currentStep}
        isTraining={isTraining}
        isComplete={isComplete}
      />

      <div className={`grid grid-cols-1 gap-6 transition-all duration-300 ${
        isTraining ? 'lg:grid-cols-2 lg:pr-[22rem]' : 'lg:grid-cols-2'
      }`}>
        <div className="space-y-6">
          <DataIngestCard onUploadSuccess={onFileUploadSuccess} isFileUploaded={isFileUploaded} />
          <ConfigurationCard
            parameters={modelParameters}
            onParametersChange={onParametersChange}
            isTraining={isTraining}
          />
        </div>

        <div className="space-y-6">
          <TrainingCard
            isFileUploaded={isFileUploaded}
            isTraining={isTraining}
            onStartTraining={handleStartTrainingClick}
            onStopTraining={onStopTraining}
            estimatedTrainingTime={estimatedTrainingTime}
            trainingStartTime={trainingStartTime}
          />
          
          {isComplete && generationResult && (
            <DeploymentCard result={generationResult} />
          )}

          {isStopped && (
             <Card className="border-amber-700 bg-amber-900/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-300">
                  <XCircle className="h-5 w-5" />
                  <span>Training Stopped</span>
                </CardTitle>
                <CardDescription className="text-amber-400">
                  The training process was manually halted by the user.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  You can adjust your parameters and start the training again when you are ready.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <LiveMonitoringSidebar
        isVisible={isTraining}
        isTraining={isTraining}
        estimatedTime={estimatedTrainingTime}
      />
    </div>
  );
}