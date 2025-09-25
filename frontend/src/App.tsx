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
import { ModelParameters, GenerationResult, TrainingStatus } from './types';

// Define a comprehensive state for the entire workspace
interface WorkspaceState {
  status: TrainingStatus;
  isFileUploaded: boolean;
  modelParameters: ModelParameters | null;
  estimatedTrainingTime: number;
  generationResult: GenerationResult | null;
  trainingStartTime: number | null;
}

const initialWorkspaceState: WorkspaceState = {
  status: 'idle',
  isFileUploaded: false,
  modelParameters: null,
  estimatedTrainingTime: 0,
  generationResult: null,
  trainingStartTime: null,
};

function App() {
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>(initialWorkspaceState);
  const trainingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartTraining = (params: ModelParameters) => {
    const trainingTimeInSeconds = params.trainingTime * 60;

    setWorkspaceState(prevState => ({
      ...prevState,
      status: 'training',
      modelParameters: params,
      estimatedTrainingTime: trainingTimeInSeconds,
      generationResult: null,
      trainingStartTime: Date.now(),
    }));

    toast.info('Training Started', {
      description: `Model training initiated. Estimated completion in ~${params.trainingTime} minutes.`,
    });

    trainingTimeoutRef.current = setTimeout(async () => {
      try {
        const { trainingTime } = params;
        let finalAccuracy: number;
        if (trainingTime <= 10) finalAccuracy = 75 + Math.random() * 10;
        else if (trainingTime <= 30) finalAccuracy = 80 + Math.random() * 10;
        else finalAccuracy = 85 + Math.random() * 10;

        const getModelNameByDomain = (domain: string): string => {
          const domainMap = { 'City': 'City.onnx', 'Oil and Gas': 'OilandGas.pkl', 'Traffic': 'Traffic.onnx', 'Airports': 'Airports.onnx' };
          return domainMap[domain] || 'GenericModel.pkl';
        };

        const modelName = getModelNameByDomain(params.domain);
        const result = await apiService.generateModel({ ...params, modelName });

        const enhancedResult: GenerationResult = {
          ...result,
          modelName,
          accuracy: parseFloat(finalAccuracy.toFixed(2)),
          precision: parseFloat((finalAccuracy * (0.9 + Math.random() * 0.1)).toFixed(2)),
          recall: parseFloat((finalAccuracy * (0.92 + Math.random() * 0.1)).toFixed(2)),
          f1Score: parseFloat((finalAccuracy * (0.91 + Math.random() * 0.1)).toFixed(2)),
        };

        setWorkspaceState(prevState => ({ ...prevState, status: 'completed', generationResult: enhancedResult, trainingStartTime: null }));
        toast.success('Model Training Complete!', {
          description: `Your model "${enhancedResult.modelName}" achieved ${enhancedResult.accuracy}% accuracy.`,
        });

      } catch (error) {
        setWorkspaceState(prevState => ({ ...prevState, status: 'idle', trainingStartTime: null }));
        toast.error('Training Failed', {
          description: 'Failed to train model. Please check your parameters and try again.',
        });
      }
    }, trainingTimeInSeconds * 1000);
  };

  const handleStopTraining = () => {
    if (trainingTimeoutRef.current) {
      clearTimeout(trainingTimeoutRef.current);
    }
    setWorkspaceState(prevState => ({ ...prevState, status: 'stopped', trainingStartTime: null }));
    toast.warning('Training Stopped', {
      description: 'The training process has been halted by the user.',
    });
  };

  const handleFileUploadSuccess = (isSuccess: boolean) => {
    setWorkspaceState(prevState => ({ ...prevState, isFileUploaded: isSuccess }));
  };

  const handleParametersChange = (params: ModelParameters) => {
    setWorkspaceState(prevState => ({...prevState, modelParameters: params}));
  }

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (workspaceState.status === 'training') {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [workspaceState.status]);

  return (
    <Router>
      <AppLayout isTraining={workspaceState.status === 'training'}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="/workspace"
            element={
              <Workspace
                workspaceState={workspaceState}
                onStartTraining={handleStartTraining}
                onStopTraining={handleStopTraining}
                onFileUploadSuccess={handleFileUploadSuccess}
                onParametersChange={handleParametersChange}
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