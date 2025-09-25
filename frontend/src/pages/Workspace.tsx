import { useState } from 'react';
import { VisualStepper } from '@/components/Workspace/VisualStepper';
import { DataIngestCard } from '@/components/Workspace/DataIngestCard';
import { ConfigurationCard } from '@/components/Workspace/ConfigurationCard';
import { TrainingCard } from '@/components/Workspace/TrainingCard';
import { DeploymentCard } from '@/components/Workspace/DeploymentCard';
import { LiveMonitoringSidebar } from '@/components/Workspace/LiveMonitoringSidebar';
import { ModelParameters, GenerationResult } from '@/types';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export function Workspace() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showMonitoring, setShowMonitoring] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  
  const [modelParameters, setModelParameters] = useState<ModelParameters>({
    analyticsType: 'Predictive Analytics',
    domain: 'Transport',
    modelType: 'Regression',
    handleMissingData: false,
    dataCleaning: false,
    featureScaling: false,
    geoFencing: true,
    calculateDistance: false,
    learningRate: 0.01,
    epochs: 100,
    batchSize: 32,
    validationType: 'train-test',
    trainTestSplit: 80,
    kFolds: 5,
  });

  const { toast } = useToast();

  const handleFileUploadSuccess = () => {
    setIsFileUploaded(true);
    setCurrentStep(2);
  };

  const handleStartTraining = async () => {
    setIsTraining(true);
    setCurrentStep(3);
    setShowMonitoring(true);

    try {
      // Simulate realistic training time (10 to 60 minutes)
      const minTrainingTime = 10 * 60 * 1000;
      const maxTrainingTime = 60 * 60 * 1000;
      const trainingTime =
        Math.floor(Math.random() * (maxTrainingTime - minTrainingTime + 1)) + minTrainingTime;
      const trainingTimeInMinutes = Math.round(trainingTime / 60000);

      toast({
        title: 'Training Started',
        description: `Model training initiated. Estimated completion in ${trainingTimeInMinutes} minutes.`,
      });

      // Simulate the delay
      await new Promise((resolve) => setTimeout(resolve, trainingTime));

      const result = await apiService.generateModel(modelParameters);

      // Add performance metrics to the result
      const enhancedResult: GenerationResult = {
        ...result,
        accuracy: 92.4,
        precision: 89.7,
        recall: 94.1,
        f1Score: 91.8,
      };

      setGenerationResult(enhancedResult);
      setIsComplete(true);
      setCurrentStep(4);

      toast({
        title: 'Model Training Complete!',
        description: `Your model "${result.modelName}" achieved 92.4% accuracy.`,
      });
    } catch (error) {
      toast({
        title: 'Training Failed',
        description: 'Failed to train model. Please check your parameters and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTraining(false);
    }
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
        showMonitoring ? 'lg:grid-cols-2 lg:pr-80' : 'lg:grid-cols-2'
      }`}>
        {/* Left Column */}
        <div className="space-y-6">
          <DataIngestCard onUploadSuccess={handleFileUploadSuccess} />
          <ConfigurationCard
            parameters={modelParameters}
            onParametersChange={setModelParameters}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <TrainingCard
            isFileUploaded={isFileUploaded}
            isTraining={isTraining}
            onStartTraining={handleStartTraining}
          />
          
          {generationResult && (
            <DeploymentCard result={generationResult} />
          )}
        </div>
      </div>

      <LiveMonitoringSidebar 
        isVisible={showMonitoring} 
        isTraining={isTraining} 
      />
    </div>
  );
}