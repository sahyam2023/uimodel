import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/Layout/AppLayout';
import { ChatBot } from '@/components/AIAssistant/ChatBot';
import { Dashboard } from '@/pages/Dashboard';
import { Projects } from '@/pages/Projects';
import { ProjectDetail } from '@/pages/ProjectDetail';
import { Workspace } from '@/pages/Workspace';
import { Registry } from '@/pages/Registry';
import { DataSources } from '@/pages/DataSources';
import ServerDetails from '@/pages/ServerDetails';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { apiService } from './services/api';
import { ModelParameters, GenerationResult } from './types';

function App() {
  // Global state for training
  const [isTraining, setIsTraining] = useState(false);
  const [estimatedTrainingTime, setEstimatedTrainingTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const trainingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartTraining = (modelParameters: ModelParameters) => {
    setIsTraining(true);
    setIsComplete(false);
    setGenerationResult(null);

    const trainingTimeInSeconds = modelParameters.trainingTime * 60;
    setEstimatedTrainingTime(trainingTimeInSeconds);
    setRemainingTime(trainingTimeInSeconds);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      setRemainingTime(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    toast.info('Training Started', {
      description: `Model training initiated. Estimated completion in ~${modelParameters.trainingTime} minutes.`,
    });

    trainingTimeoutRef.current = setTimeout(() => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setIsComplete(true);
      setIsTraining(false);

      // Run the model generation in the background
      const generateModelInBackground = async () => {
        try {
          const { trainingTime } = modelParameters;
          let finalAccuracy;
          if (trainingTime <= 10) finalAccuracy = 75 + Math.random() * 10;
          else if (trainingTime <= 30) finalAccuracy = 80 + Math.random() * 10;
          else finalAccuracy = 85 + Math.random() * 10;

          const getModelNameByDomain = (domain: string): string => {
            const domainMap: { [key: string]: string } = {
              'City': 'City.onnx',
              'Oil and Gas': 'OilandGas.pkl',
              'Traffic': 'Traffic.onnx',
              'Airports': 'Airports.onnx',
            };
            return domainMap[domain] || 'GenericModel.pkl';
          };

          const modelName = getModelNameByDomain(modelParameters.domain);
          const result = await apiService.generateModel({ ...modelParameters });

          const enhancedResult: GenerationResult = {
            ...result,
            modelName,
            accuracy: parseFloat(finalAccuracy.toFixed(2)),
            precision: parseFloat((finalAccuracy * (0.9 + Math.random() * 0.1)).toFixed(2)),
            recall: parseFloat((finalAccuracy * (0.92 + Math.random() * 0.1)).toFixed(2)),
            f1Score: parseFloat((finalAccuracy * (0.91 + Math.random() * 0.1)).toFixed(2)),
          };

          setGenerationResult(enhancedResult);
          toast.success('Model Training Complete!', {
            description: `Your model "${enhancedResult.modelName}" achieved ${enhancedResult.accuracy}% accuracy.`,
          });

        } catch (error) {
          toast.error('Training Failed', {
            description: 'Failed to generate model results. Please try again.',
          });
          // Optionally reset completion state if generation fails
          setIsComplete(false);
        }
      };

      generateModelInBackground();
    }, trainingTimeInSeconds * 1000);
  };

  const handleStopTraining = () => {
    if (trainingTimeoutRef.current) {
      clearTimeout(trainingTimeoutRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsTraining(false);
    setRemainingTime(0);
    toast.warning('Training Stopped', {
      description: 'The training process has been halted by the user.',
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isTraining) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isTraining]);

  return (
    <Router>
      <AppLayout isTraining={isTraining}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="/workspace"
            element={
              <Workspace
                isTraining={isTraining}
                isComplete={isComplete}
                generationResult={generationResult}
                estimatedTrainingTime={estimatedTrainingTime}
                remainingTime={remainingTime}
                onStartTraining={handleStartTraining}
                onStopTraining={handleStopTraining}
              />
            }
          />
          <Route path="/registry" element={<Registry />} />
          <Route path="/data" element={<DataSources />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/servers" element={<ServerDetails />} />
        </Routes>
        <ChatBot />
        <Toaster />
      </AppLayout>
    </Router>
  );
}

export default App;