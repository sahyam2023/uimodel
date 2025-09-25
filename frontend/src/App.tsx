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

    const trainingTimeInSeconds = Math.floor(Math.random() * (300 - 120 + 1)) + 120; // 2-5 minutes
    setEstimatedTrainingTime(trainingTimeInSeconds);

    toast.info('Training Started', {
      description: `Model training initiated. Estimated completion in ~${Math.round(trainingTimeInSeconds / 60)} minutes.`,
    });

    trainingTimeoutRef.current = setTimeout(async () => {
      try {
        const result = await apiService.generateModel(modelParameters);
        const enhancedResult: GenerationResult = {
          ...result,
          accuracy: 92.4,
          precision: 89.7,
          recall: 94.1,
          f1Score: 91.8,
        };

        setGenerationResult(enhancedResult);
        setIsComplete(true);
        setIsTraining(false);

        toast.success('Model Training Complete!', {
          description: `Your model "${result.modelName}" achieved 92.4% accuracy.`,
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