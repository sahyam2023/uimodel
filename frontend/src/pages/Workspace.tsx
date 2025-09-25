import { useState, useEffect } from 'react';
import { VisualStepper } from '@/components/Workspace/VisualStepper';
import { DataIngestCard } from '@/components/Workspace/DataIngestCard';
import { ConfigurationCard } from '@/components/Workspace/ConfigurationCard';
import { TrainingCard } from '@/components/Workspace/TrainingCard';
import { DeploymentCard } from '@/components/Workspace/DeploymentCard';
import { LiveMonitoringSidebar } from '@/components/Workspace/LiveMonitoringSidebar';
import { ModelParameters, GenerationResult } from '@/types';

interface WorkspaceProps {
  isTraining: boolean;
  isComplete: boolean;
  generationResult: GenerationResult | null;
  estimatedTrainingTime: number;
  onStartTraining: (params: ModelParameters) => void;
  onStopTraining: () => void;
}

export function Workspace({
  isTraining,
  isComplete,
  generationResult,
  estimatedTrainingTime,
  onStartTraining,
  onStopTraining,
}: WorkspaceProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [showMonitoring, setShowMonitoring] = useState(false);
  
  const [modelParameters, setModelParameters] = useState<ModelParameters>({
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
  });

  useEffect(() => {
    setShowMonitoring(isTraining);
    if (isTraining) {
      setCurrentStep(3);
    } else if (isComplete) {
      setCurrentStep(4);
    } else if (isFileUploaded) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [isTraining, isComplete, isFileUploaded]);

  const handleFileUploadSuccess = () => {
    setIsFileUploaded(true);
  };

  const handleStartTrainingClick = () => {
    onStartTraining(modelParameters);
  };

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
        showMonitoring ? 'lg:grid-cols-2 lg:pr-[22rem]' : 'lg:grid-cols-2'
      }`}>
        <div className="space-y-6">
          <DataIngestCard onUploadSuccess={handleFileUploadSuccess} />
          <ConfigurationCard
            parameters={modelParameters}
            onParametersChange={setModelParameters}
          />
        </div>

        <div className="space-y-6">
          <TrainingCard
            isFileUploaded={isFileUploaded}
            isTraining={isTraining}
            onStartTraining={handleStartTrainingClick}
            onStopTraining={onStopTraining}
            estimatedTrainingTime={estimatedTrainingTime}
          />
          
          {generationResult && (
            <DeploymentCard result={generationResult} />
          )}
        </div>
      </div>

      <LiveMonitoringSidebar 
        isVisible={showMonitoring} 
        isTraining={isTraining}
        estimatedTime={estimatedTrainingTime}
      />
    </div>
  );
}