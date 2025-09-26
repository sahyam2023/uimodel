import { useRef, useEffect, useCallback } from 'react';
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
import { ModelParameters, GenerationResult, TrainingLog, ChartData } from './types';
import { usePersistentState } from './hooks/usePersistentState';
import { generateLog, generateChartData } from './lib/mock-data';

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

function App() {
  const [isTraining, setIsTraining] = usePersistentState('isTraining', false);
  const [isComplete, setIsComplete] = usePersistentState('isComplete', false);
  const [generationResult, setGenerationResult] = usePersistentState<GenerationResult | null>('generationResult', null);
  const [isFileUploaded, setIsFileUploaded] = usePersistentState('isFileUploaded', false);
  const [modelParameters, setModelParameters] = usePersistentState<ModelParameters>('modelParameters', initialModelParameters);

  const [trainingLogs, setTrainingLogs] = usePersistentState<TrainingLog[]>('trainingLogs', []);
  const [remainingTime, setRemainingTime] = usePersistentState('remainingTime', 0);
  const [currentEpoch, setCurrentEpoch] = usePersistentState('currentEpoch', 0);
  const [accuracyData, setAccuracyData] = usePersistentState<ChartData[]>('accuracyData', []);

  const trainingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const finishTraining = useCallback(async (params: ModelParameters) => {
    setTrainingLogs(prev => [...prev, generateLog('end', params)]);
    
    try {
      const { trainingTime, domain } = params;
      let finalAccuracy = 75 + Math.random() * 20;
      
      const getModelNameByDomain = (d: string): string => {
        switch (d) {
            case 'City': return 'City.onnx';
            case 'Oil and Gas': return 'OilandGas.pkl';
            case 'Traffic': return 'Traffic.onnx';
            case 'Airports': return 'Airports.onnx';
            default: return 'GenericModel.pkl';
        }
      };

      const modelName = getModelNameByDomain(domain);
      const result = await apiService.generateModel({ ...params });

      const enhancedResult: GenerationResult = { ...result, modelName, accuracy: parseFloat(finalAccuracy.toFixed(2)), precision: parseFloat((finalAccuracy * (0.9 + Math.random() * 0.1)).toFixed(2)), recall: parseFloat((finalAccuracy * (0.92 + Math.random() * 0.1)).toFixed(2)), f1Score: parseFloat((finalAccuracy * (0.91 + Math.random() * 0.1)).toFixed(2)) };

      setGenerationResult(enhancedResult);
      setIsComplete(true);
      toast.success('Model Training Complete!', { description: `Your model "${enhancedResult.modelName}" achieved ${enhancedResult.accuracy}% accuracy.` });
    } catch (error) {
      toast.error('Training Failed', { description: 'Failed to train model. Please check your parameters and try again.' });
    } finally {
        setIsTraining(false);
    }
  }, [setTrainingLogs, setGenerationResult, setIsComplete, setIsTraining]);

  useEffect(() => {
    if (isTraining) {
      trainingIntervalRef.current = setInterval(() => {
        setRemainingTime(prevTime => {
          const newRemainingTime = prevTime - 2;
          if (newRemainingTime <= 0) {
            if (trainingIntervalRef.current) clearInterval(trainingIntervalRef.current);
            finishTraining(modelParameters);
            return 0;
          }

          const totalDuration = modelParameters.trainingTime * 60;
          const elapsedTime = totalDuration - newRemainingTime;
          const progress = elapsedTime / totalDuration;
          
          setCurrentEpoch(prevEpoch => {
              const newEpoch = Math.floor(progress * modelParameters.epochs);
              if (newEpoch > prevEpoch) {
                  setTrainingLogs(prevLogs => [...prevLogs, generateLog('epoch', modelParameters, newEpoch)]);
                  return newEpoch;
              }
              return prevEpoch;
          });
          
          if (Math.random() < 0.3) {
            setTrainingLogs(prevLogs => [...prevLogs, generateLog('log', modelParameters)]);
          }

          setAccuracyData(prevData => [...prevData, generateChartData(elapsedTime, totalDuration, modelParameters.epochs, 'accuracy')]);
          return newRemainingTime;
        });
      }, 2000);
    } else {
      if (trainingIntervalRef.current) {
        clearInterval(trainingIntervalRef.current);
        trainingIntervalRef.current = null;
      }
    }
    return () => {
      if (trainingIntervalRef.current) {
        clearInterval(trainingIntervalRef.current);
      }
    };
  }, [isTraining, modelParameters, finishTraining, setRemainingTime, setCurrentEpoch, setTrainingLogs, setAccuracyData]);

  const handleStartTraining = (params: ModelParameters) => {
    setIsTraining(false); // Stop any existing interval
    setTimeout(() => { // Allow interval to clear
        const totalDuration = params.trainingTime * 60;
        setModelParameters(params);
        setRemainingTime(totalDuration);
        setCurrentEpoch(0);
        setTrainingLogs([generateLog('start', params)]);
        setAccuracyData([]);
        setIsComplete(false);
        setGenerationResult(null);
        setIsTraining(true); // This will trigger the useEffect to start the interval
        toast.info('Training Started', { description: `Model training initiated. Estimated completion in ~${params.trainingTime} minutes.` });
    }, 100);
  };

  const handleStopTraining = () => {
    setIsTraining(false); // This will trigger the useEffect to clear the interval
    setTrainingLogs(prev => [...prev, generateLog('stop')]);
    toast.warning('Training Stopped', { description: 'The training process has been halted by the user.' });
  };

  const handleFileUploadSuccess = () => setIsFileUploaded(true);
  
  const handleResetUpload = () => {
    setIsFileUploaded(false);
    sessionStorage.removeItem('selectedFile');
    toast.info('File cleared', { description: 'You can now upload a new file.' });
  };

  const handleWorkspaceReset = () => {
    setIsTraining(false);
    setIsComplete(false);
    setGenerationResult(null);
    setIsFileUploaded(false);
    setModelParameters(initialModelParameters);
    setTrainingLogs([]);
    setRemainingTime(0);
    setCurrentEpoch(0);
    setAccuracyData([]);

    // Also clear items managed by child components
    sessionStorage.removeItem('selectedFile');
    sessionStorage.removeItem('dataSources');

    toast.success('Workspace Reset', {
      description: 'The workspace has been cleared. You can start a new session.',
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
                onStartTraining={handleStartTraining}
                onStopTraining={handleStopTraining}
                isFileUploaded={isFileUploaded}
                onFileUploadSuccess={handleFileUploadSuccess}
                onResetUpload={handleResetUpload}
                onWorkspaceReset={handleWorkspaceReset}
                modelParameters={modelParameters}
                onParametersChange={setModelParameters}
                trainingLogs={trainingLogs}
                remainingTime={remainingTime}
                currentEpoch={currentEpoch}
                accuracyData={accuracyData}
                estimatedTrainingTime={modelParameters.trainingTime * 60}
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