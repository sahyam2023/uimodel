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
  onResetUpload: () => void;
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
  onResetUpload,
  modelParameters,
  onParametersChange,
  trainingLogs,
  remainingTime,
  currentEpoch,
  accuracyData,
  estimatedTrainingTime,
}: WorkspaceProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {
    if (isTraining) {
      setCurrentStep(3);
      setIsFinalizing(false);
    } else if (isComplete) {
      setCurrentStep(4);
      setIsFinalizing(false);
    } else if (isFileUploaded) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [isTraining, isComplete, isFileUploaded]);

  useEffect(() => {
    // This effect handles the "finalizing" state
    if (!isTraining && currentStep === 3 && !isComplete) {
      setIsFinalizing(true);
    }
  }, [isTraining, currentStep, isComplete]);


  const handleStartTrainingClick = () => {
    onStartTraining(modelParameters);
  };

  const showSidebar = isTraining || isComplete || isFinalizing;

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataIngestCard 
              onUploadSuccess={onFileUploadSuccess} 
              isFileUploaded={isFileUploaded} 
              onResetUpload={onResetUpload}
            />
            <ConfigurationCard
              parameters={modelParameters}
              onParametersChange={onParametersChange}
              isTraining={isTraining || isFinalizing}
            />
          </div>

          {/* Row 2 */}
          <div>
            <TrainingCard
              isFileUploaded={isFileUploaded}
              isTraining={isTraining}
              onStartTraining={handleStartTrainingClick}
              onStopTraining={onStopTraining}
              estimatedTrainingTime={estimatedTrainingTime}
              isFinalizing={isFinalizing}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className={`lg:col-span-1 transition-opacity duration-300 ${showSidebar ? 'opacity-100' : 'opacity-0'}`}>
          {isTraining || isFinalizing ? (
            <LiveMonitoringSidebar
              isVisible={true}
              isTraining={isTraining}
              isFinalizing={isFinalizing}
              logs={trainingLogs}
              remainingTime={remainingTime}
              currentEpoch={currentEpoch}
              totalEpochs={modelParameters.epochs}
              accuracyData={accuracyData}
              estimatedDuration={estimatedTrainingTime}
            />
          ) : isComplete && generationResult ? (
            <DeploymentCard result={generationResult} />
          ) : null}
        </div>
      </div>
    </div>
  );
}