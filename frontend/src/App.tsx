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
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const trainingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartTraining = (modelParameters: ModelParameters) => {
    setIsTraining(true);
    setIsComplete(false);
    setGenerationResult(null);

    const trainingTimeInSeconds = modelParameters.trainingTime * 60;
    setEstimatedTrainingTime(trainingTimeInSeconds);

    toast.info('Training Started', {
      description: `Model training initiated. Estimated completion in ~${modelParameters.trainingTime} minutes.`,
    });

    trainingTimeoutRef.current = setTimeout(async () => {
      try {
        // 1. Final Accuracy Calculation
        const { trainingTime } = modelParameters;
        let finalAccuracy: number;
        if (trainingTime <= 10) {
          finalAccuracy = 75 + Math.random() * 10; // 75-85%
        } else if (trainingTime <= 30) {
          finalAccuracy = 80 + Math.random() * 10; // 80-90%
        } else {
          finalAccuracy = 85 + Math.random() * 10; // 85-95%
        }

        // 2. Model Selection Logic
        const getModelNameByDomain = (domain: string): string => {
          switch (domain) {
            case 'City':
              return 'City.onnx';
            case 'Oil and Gas':
              return 'OilandGas.pkl';
            case 'Traffic':
              return 'Traffic.onnx';
            case 'Airports':
              return 'Airports.onnx';
            default:
              return 'GenericModel.pkl';
          }
        };

        const modelName = getModelNameByDomain(modelParameters.domain);
        console.log(`[Model Selection] Domain: '${modelParameters.domain}', Selected Model: '${modelName}'`);
        const result = await apiService.generateModel({ ...modelParameters });

        const enhancedResult: GenerationResult = {
          ...result,
          modelName, // Override with the correct model name
          accuracy: parseFloat(finalAccuracy.toFixed(2)),
          precision: parseFloat((finalAccuracy * (0.9 + Math.random() * 0.1)).toFixed(2)),
          recall: parseFloat((finalAccuracy * (0.92 + Math.random() * 0.1)).toFixed(2)),
          f1Score: parseFloat((finalAccuracy * (0.91 + Math.random() * 0.1)).toFixed(2)),
        };

        setGenerationResult(enhancedResult);
        setIsComplete(true);
        setIsTraining(false);

        toast.success('Model Training Complete!', {
          description: `Your model "${enhancedResult.modelName}" achieved ${enhancedResult.accuracy}% accuracy.`,
        });
      } catch (error) {
        toast.error('Training Failed', {
          description: 'Failed to train model. Please check your parameters and try again.',
        });
        setIsTraining(false);
      }
    }, trainingTimeInSeconds * 1000);
  };

  const handleStopTraining = () => {
    if (trainingTimeoutRef.current) {
      clearTimeout(trainingTimeoutRef.current);
    }
    setIsTraining(false);
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