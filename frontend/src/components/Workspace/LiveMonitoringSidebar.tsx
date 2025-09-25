import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, BarChart2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiveMonitoringSidebarProps {
  isVisible: boolean;
  isTraining: boolean;
  estimatedTime: number; // in minutes
}

const logTemplates = [
  "[INFO] Initializing training environment...",
  "[INFO] Loading dataset from /data/source/...",
  "[INFO] Performing data validation...",
  "[DEBUG] Found 2,456 columns in dataset.",
  "[DEBUG] Memory usage: 256.34 MB",
  "[INFO] Starting data preprocessing...",
  "[INFO] Applying StandardScaler to feature set.",
  "[INFO] Applying OneHotEncoder to categorical variables.",
  "[DEBUG] Feature 'city_id' encoded into 12 categories.",
  "[WARN] Missing 2% of values in 'avg_temp' column. Imputing with mean.",
  "[INFO] Preprocessing complete. Shape: (150000, 2478)",
  "[INFO] Building model architecture: ResNet50...",
  "[DEBUG] Layer 'conv1' added.",
  "[DEBUG] Layer 'bn1' added with momentum 0.99.",
  "[DEBUG] Layer 'relu' added.",
  "[DEBUG] Layer 'maxpool' added.",
  "[INFO] Compiling model with Adam optimizer, learning rate: 0.001",
  "[INFO] Starting training for 100 epochs...",
  () => `[METRIC] Epoch 1/100 - loss: 1.2345, accuracy: 0.5678, val_loss: 1.1000, val_accuracy: 0.6123`,
  () => `[DEBUG] Batch 128/1172 - loss: ${Math.random().toFixed(4)}`,
  () => `[DEBUG] Batch 256/1172 - loss: ${Math.random().toFixed(4)}`,
  "[INFO] Checkpoint saved to /models/checkpoints/epoch_1.h5",
  () => `[METRIC] Epoch 2/100 - loss: 0.9876, accuracy: 0.6543, val_loss: 1.0500, val_accuracy: 0.6345`,
  () => `[DEBUG] Learning rate scheduler updated learning rate to 0.0009.`,
  () => `[DEBUG] Batch 512/1172 - loss: ${Math.random().toFixed(4)}`,
  () => `[METRIC] Epoch 10/100 - loss: 0.4567, accuracy: 0.8123, val_loss: 0.5200, val_accuracy: 0.7999`,
  "[WARN] High gradient norm detected in layer 'fc2': 25.67",
  "[INFO] GPU Memory Usage: 8.7/11.2 GB",
  "[DEBUG] Data augmentation applied: random flip, rotation.",
  () => `[METRIC] Epoch 25/100 - loss: 0.2134, accuracy: 0.9123, val_loss: 0.2500, val_accuracy: 0.9011`,
  "[INFO] Saving model summary to /logs/model_summary.txt",
  "[DEBUG] TensorFLow profiler enabled for next 5 steps.",
  () => `[METRIC] Epoch 50/100 - loss: 0.1023, accuracy: 0.9654, val_loss: 0.1234, val_accuracy: 0.9587`,
  "[INFO] Early stopping patience: 3/5.",
  "[DEBUG] Cache hit for data batch 789.",
  () => `[METRIC] Epoch 75/100 - loss: 0.0512, accuracy: 0.9876, val_loss: 0.0600, val_accuracy: 0.9854`,
  "[WARN] Validation accuracy has not improved in 3 epochs.",
  "[INFO] Freezing layers for fine-tuning: conv1, conv2",
  "[DEBUG] Recompiling model with new optimizer settings.",
  () => `[METRIC] Epoch 99/100 - loss: 0.0234, accuracy: 0.9912, val_loss: 0.0300, val_accuracy: 0.9901`,
  "[SUCCESS] Model training completed!",
  "[INFO] Evaluating model performance on test set...",
  "[METRIC] Test Accuracy: 0.9905",
  "[INFO] Saving final model to /models/production/final_model.h5",
  "[INFO] Cleaning up training artifacts...",
  "[SYSTEM] Process finished with exit code 0.",
  "[DEBUG] Analyzing feature importance...",
  "[DEBUG] Feature 'traffic_density' has high correlation.",
  "[INFO] Generating ROC curve...",
  "[METRIC] AUC: 0.997",
  "[SYSTEM] Shutting down training container."
];

const generateLogMessage = () => {
  const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
  return typeof template === 'function' ? template() : template;
};

const genericFeatures = Array.from({ length: 5 }, (_, i) => `Feature ${i + 1}`);

export function LiveMonitoringSidebar({ isVisible, isTraining, estimatedTime }: LiveMonitoringSidebarProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [accuracyData, setAccuracyData] = useState<Array<{ step: number; accuracy: number }>>([]);
  const [featureImportance, setFeatureImportance] = useState<Array<{ feature: string; importance: number }>>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTraining) {
      setLogs([]);
      setAccuracyData([]);
      setFeatureImportance(genericFeatures.map(f => ({ feature: f, importance: Math.random() * 0.2 })));

      const totalSteps = estimatedTime * 60 * 2; // ~2 logs per second
      const intervalDuration = (estimatedTime * 60 * 1000) / totalSteps;
      let currentStep = 0;

      const trainingInterval = setInterval(() => {
        if (currentStep >= totalSteps) {
          clearInterval(trainingInterval);
          setLogs(prev => [...prev.slice(-99), '[SUCCESS] Model training completed!']);
          return;
        }

        currentStep++;

        setLogs(prev => [...prev.slice(-99), `[${new Date().toLocaleTimeString()}] ${generateLogMessage()}`]);

        // Update Accuracy Chart
        if (currentStep % 10 === 0) { // Update chart less frequently
          const lastAccuracy = accuracyData.length > 0 ? accuracyData[accuracyData.length - 1].accuracy : 0.3;
          const newAccuracy = Math.min(0.99, lastAccuracy + (Math.random() * 0.02) - 0.005);
          setAccuracyData(prev => [...prev.slice(-50), { step: currentStep, accuracy: newAccuracy }]);
        }

        // Update Feature Importance Chart
        if (currentStep % 25 === 0) { // Update chart less frequently
          setFeatureImportance(prev =>
            prev.map(f => ({
              ...f,
              importance: Math.max(0, Math.min(1, f.importance + (Math.random() - 0.48) * 0.05)),
            }))
          );
        }

      }, intervalDuration);

      return () => clearInterval(trainingInterval);
    }
  }, [isTraining, estimatedTime]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isVisible) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-800 shadow-xl z-30 transform transition-transform duration-300 ease-in-out"
         style={{ transform: isVisible ? 'translateX(0)' : 'translateX(100%)' }}>
      <ScrollArea className="h-full p-4">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Live Monitoring</h3>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Training Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={logContainerRef} className="bg-black rounded-md p-3 h-56 overflow-y-auto font-mono text-xs scroll-smooth">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`whitespace-nowrap ${
                      log.includes('[SUCCESS]') ? 'text-green-400' :
                      log.includes('[METRIC]') ? 'text-cyan-400' :
                      log.includes('[WARN]') ? 'text-yellow-400' :
                      log.includes('[ERROR]') ? 'text-red-400' :
                      log.includes('[DEBUG]') ? 'text-slate-500' :
                      'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {accuracyData.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Training Accuracy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={accuracyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="step" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} domain={[0.4, 1.0]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '12px' }}
                      labelClassName="font-bold"
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {featureImportance.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>Feature Importance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={featureImportance} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#64748b" fontSize={10} domain={[0, 1]} />
                    <YAxis dataKey="feature" type="category" stroke="#64748b" fontSize={10} width={60} tick={{ fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '12px' }}
                      labelClassName="font-bold"
                      itemStyle={{ color: '#6366f1' }}
                    />
                    <Bar dataKey="importance" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}