import { useEffect, useState } from 'react';
import { VisualStepper } from '@/components/Workspace/VisualStepper';
import { DataIngestCard } from '@/components/Workspace/DataIngestCard';
import { ConfigurationCard } from '@/components/Workspace/ConfigurationCard';
import { TrainingCard } from '@/components/Workspace/TrainingCard';
import { DeploymentCard } from '@/components/Workspace/DeploymentCard';
import { LiveMonitoringSidebar } from '@/components/Workspace/LiveMonitoringSidebar';
import { ModelParameters, GenerationResult, TrainingLog, ChartData } from '@/types';

interface WorkspaceProps {
  isTraining: boolean;
  isComplete: boolean;
  generationResult: GenerationResult | null;
  onStartTraining: (params: ModelParameters) => void;
  onStopTraining: () => void;
  isFileUploaded: boolean;
  onFileUploadSuccess: () => void;
  modelParameters: ModelParameters;
  onParametersChange: (params: ModelParameters) => void;
  trainingLogs: TrainingLog[];
  remainingTime: number;
  currentEpoch: number;
  accuracyData: ChartData[];
  estimatedTrainingTime: number;
}

export function Workspace({
  isTraining,
  isComplete,
  generationResult,
  onStartTraining,
  onStopTraining,
  isFileUploaded,
  onFileUploadSuccess,
  modelParameters,
  onParametersChange,
  trainingLogs,
  remainingTime,
  currentEpoch,
  accuracyData,
  estimatedTrainingTime,
}: WorkspaceProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showMonitoring, setShowMonitoring] = useState(false);

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
        showMonitoring ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
      }`}>
        <div className={`space-y-6 ${showMonitoring ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataIngestCard 
              onUploadSuccess={onFileUploadSuccess} 
              isFileUploaded={isFileUploaded} 
            />
            <ConfigurationCard
              parameters={modelParameters}
              onParametersChange={onParametersChange}
              isTraining={isTraining}
            />
            <div className="lg:col-span-2">
              <TrainingCard
                isFileUploaded={isFileUploaded}
                isTraining={isTraining}
                onStartTraining={handleStartTrainingClick}
                onStopTraining={onStopTraining}
                estimatedTrainingTime={estimatedTrainingTime}
              />
            </div>
             {isComplete && generationResult && (
                <div className="lg:col-span-2">
                    <DeploymentCard result={generationResult} />
                </div>
            )}
          </div>
        </div>
        
        <div className={`transition-all duration-300 ${showMonitoring ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <LiveMonitoringSidebar 
                isVisible={showMonitoring} 
                isTraining={isTraining}
                logs={trainingLogs}
                remainingTime={remainingTime}
                currentEpoch={currentEpoch}
                totalEpochs={modelParameters.epochs}
                accuracyData={accuracyData}
                estimatedDuration={estimatedTrainingTime}
            />
        </div>
      </div>
    </div>
  );
}