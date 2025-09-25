import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, TrendingDown, Cpu } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiveMonitoringSidebarProps {
  isVisible: boolean;
  isTraining: boolean;
  estimatedTime: number; // in seconds
}

// A comprehensive and structured collection of realistic training logs
const realisticLogs = {
  initialization: [
    "[INFO] Training environment validated. Python: 3.9.12, TensorFlow: 2.10.0, CUDA: 11.2",
    "[INFO] Compute resources allocated: 1x NVIDIA V100 GPU, 16x vCPU, 128GB RAM.",
    "[INFO] Connecting to data source 'production_events_stream'...",
    "[INFO] Successfully connected to data source. Streaming data...",
    "[INFO] Reading dataset from remote: gs://acme-corp-datalake/processed/q1-2024-data.arrow",
    "[INFO] Dataset metadata loaded. Columns: 512, Rows: 2,750,000, Size: 10.2 GB.",
    "[INFO] Performing initial data integrity and schema validation...",
    "[SUCCESS] Data integrity check passed. No corrupt records found. Schema is valid.",
    "[DEBUG] Setting random seeds for reproducibility: NumPy=42, TensorFlow=42.",
    "[DEBUG] Cleared backend session state.",
  ],
  preprocessing: [
    "[INFO] Launching data preprocessing and feature engineering pipeline.",
    "[INFO] Applying StandardScaler to 256 numerical features.",
    "[INFO] Applying Tokenizer and Embedding layer to 16 text features.",
    "[DEBUG] Vocabulary size for 'product_description': 50,000 tokens.",
    "[WARN] Missing 3.8% of values in 'user_rating' column. Imputing with median value 4.0.",
    "[WARN] Outliers detected in 'session_duration'. Applying log transformation.",
    "[INFO] Performing feature engineering: creating cyclical features for 'hour_of_day'.",
    "[DEBUG] Generated 28 new features from geolocation data.",
    "[INFO] Preprocessing complete. Final feature shape: (2,750,000, 890).",
    "[INFO] Caching preprocessed data to disk for faster subsequent runs.",
  ],
  modelBuilding: [
    "[INFO] Building model architecture: Hybrid GRU-Transformer Network...",
    "[DEBUG] Added Bidirectional GRU layer with 256 units.",
    "[DEBUG] Added Multi-Head Attention layer with num_heads=16, key_dim=64.",
    "[DEBUG] Added Feed-Forward Network with SwiGLU activation.",
    "[DEBUG] LayerNormalization and Dropout (rate=0.15) added throughout.",
    "[INFO] Model contains 8 transformer blocks and 2 GRU layers.",
    "[INFO] Compiling model with AdamW optimizer, learning rate: 5e-5, weight_decay: 0.02.",
    "[SUCCESS] Model compiled successfully. Total trainable parameters: 112,345,678.",
  ],
  system: [
    "[INFO] GPU Memory Usage: 28.5/32.0 GB",
    "[INFO] GPU Utilization (avg over 10s): 96%",
    "[DEBUG] Data augmentation applied: random noise, time-series shifting.",
    "[DEBUG] Learning rate scheduler: Cosine decay with warmup (10% of steps).",
    "[INFO] Checkpoint saved to /models/checkpoints/epoch_{epoch}.ckpt",
    "[DEBUG] TensorBoard profiler running for next 100 steps.",
    "[DEBUG] Cache hit for data batch {batch_num}. IOPS: 35k.",
    "[INFO] CPU-to-GPU data transfer pipeline is healthy. Bandwidth: 12.5 GB/s.",
  ],
  warning: [
    "[WARN] High gradient norm detected in 'attention_layer_5': 42.8. Applying gradient clipping.",
    "[WARN] Validation loss has plateaued for 2 epochs. Early stopping patience: 2/5.",
    "[WARN] Input pipeline is taking 1.2x longer than model forward pass. Potential IO bottleneck.",
    "[WARN] Numerical instability detected in final layer. Recasting to float32.",
  ],
  special: [
    "[CRITICAL] System instability detected! Freezing layers and reducing learning rate to recover...",
    "[INFO] Fine-tuning phase initiated. Unfreezing top 3 transformer blocks.",
    "[INFO] Recompiling model with a lower learning rate (1e-6) for fine-tuning.",
    "[INFO] Switching to Stochastic Weight Averaging (SWA) for final epochs.",
  ],
  finalization: [
    "[SUCCESS] Model training completed successfully!",
    "[INFO] Evaluating final model performance on the held-out test set (250k samples)...",
    "[METRIC] Final Test Accuracy: {final_accuracy}%",
    "[INFO] Generating feature importance report using SHAP on 1000 test samples...",
    "[INFO] Saving final model artifact to /models/production/prod_model_v2.3.onnx",
    "[INFO] Cleaning up training artifacts and releasing all compute resources...",
    "[INFO] Generating ROC curve, precision-recall curve, and confusion matrix plots...",
    "[METRIC] Final AUC: {final_auc}",
    "[SYSTEM] Training container is shutting down.",
    "[SUCCESS] Process finished with exit code 0.",
  ]
};

const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export function LiveMonitoringSidebar({ isVisible, isTraining, estimatedTime }: LiveMonitoringSidebarProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [accuracyData, setAccuracyData] = useState<Array<{ step: number; accuracy: number }>>([]);
  const [lossData, setLossData] = useState<Array<{ step: number; loss: number }>>([]);
  const [computeData, setComputeData] = useState<Array<{ step: number; gpu: number; cpu: number }>>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const trainingStateRef = useRef({
    intervalId: null as NodeJS.Timeout | null,
    currentStep: 0,
    totalSteps: 0,
    stage: 'idle',
    epoch: 0,
    totalEpochs: 0,
    targetAccuracy: 0,
  });

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-199), `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const updateMetrics = () => {
    const { currentStep, totalSteps, targetAccuracy, epoch } = trainingStateRef.current;
    const progress = currentStep / totalSteps;

    // Accuracy
    const accSteepness = 5;
    const accMidpoint = 0.5;
    const currentAccuracy = targetAccuracy * (1 / (1 + Math.exp(-accSteepness * (progress - accMidpoint))));
    const accNoise = (Math.random() - 0.5) * 0.03 * (1 - progress);
    const finalAccuracy = Math.max(0, Math.min(0.995, currentAccuracy + accNoise));
    setAccuracyData(prev => [...prev.slice(-99), { step: epoch, accuracy: finalAccuracy }]);

    // Loss
    const initialLoss = 1.5;
    const finalLoss = 0.1;
    const loss = initialLoss * Math.exp(-progress * 5) + finalLoss + (Math.random() - 0.5) * 0.1 * (1 - progress);
    setLossData(prev => [...prev.slice(-99), { step: epoch, loss: Math.max(0.05, loss) }]);

    // Compute
    const gpuUsage = 80 + Math.random() * 20 * Math.sin(progress * Math.PI);
    const cpuUsage = 40 + Math.random() * 30 * Math.sin(progress * Math.PI * 2);
    setComputeData(prev => [...prev.slice(-99), { step: epoch, gpu: gpuUsage, cpu: cpuUsage }]);
  };

  const runTrainingSimulation = () => {
    const state = trainingStateRef.current;
    state.currentStep++;

    switch (state.stage) {
      case 'init':
        if (state.currentStep > realisticLogs.initialization.length) {
          state.stage = 'preprocessing';
          state.currentStep = 1;
        } else {
          addLog(realisticLogs.initialization[state.currentStep - 1]);
        }
        break;
      case 'preprocessing':
        if (state.currentStep > realisticLogs.preprocessing.length) {
          state.stage = 'building';
          state.currentStep = 1;
        } else {
          addLog(realisticLogs.preprocessing[state.currentStep - 1]);
        }
        break;
      case 'building':
        if (state.currentStep > realisticLogs.modelBuilding.length) {
          state.stage = 'training';
          state.currentStep = 1;
          state.epoch = 1;
        } else {
          addLog(realisticLogs.modelBuilding[state.currentStep - 1]);
        }
        break;
      case 'training':
        const stepsPerEpoch = Math.floor(state.totalSteps / state.totalEpochs);
        if (state.currentStep % stepsPerEpoch === 0) {
          updateMetrics();
          const acc = accuracyData.at(-1)?.accuracy || 0;
          const loss = lossData.at(-1)?.loss || 0;
          const epochLog = `[METRIC] Epoch ${state.epoch}/${state.totalEpochs} - loss: ${loss.toFixed(4)}, acc: ${acc.toFixed(4)}, val_loss: ${(loss * 1.1).toFixed(4)}, val_acc: ${(acc * 0.98).toFixed(4)}`;
          addLog(epochLog);

          if (Math.random() < 0.3) {
            addLog(getRandomItem([...realisticLogs.system, ...realisticLogs.warning]));
          }

          if (state.epoch === Math.floor(state.totalEpochs * 0.5) || state.epoch === Math.floor(state.totalEpochs * 0.75)) {
            addLog(getRandomItem(realisticLogs.special));
          }

          state.epoch++;
        }
        if (state.epoch > state.totalEpochs) {
          state.stage = 'finalizing';
          state.currentStep = 1;
          updateMetrics();
        }
        break;
      case 'finalizing':
        if (state.currentStep > realisticLogs.finalization.length) {
          state.stage = 'done';
          if (state.intervalId) clearInterval(state.intervalId);
        } else {
          let msg = realisticLogs.finalization[state.currentStep - 1];
          if (msg.includes('{final_accuracy}')) {
            msg = msg.replace('{final_accuracy}', (state.targetAccuracy * 100).toFixed(2));
          }
          if (msg.includes('{final_auc}')) {
            msg = msg.replace('{final_auc}', (state.targetAccuracy + Math.random() * 0.05).toFixed(4));
          }
          addLog(msg);
        }
        break;
    }
  };

  useEffect(() => {
    if (isTraining) {
      setLogs([]);
      setAccuracyData([]);
      setLossData([]);
      setComputeData([]);

      const trainingTimeMinutes = estimatedTime / 60;
      let targetAccuracy;
      if (trainingTimeMinutes <= 10) {
        targetAccuracy = 0.75 + Math.random() * 0.1; // 75-85%
      } else if (trainingTimeMinutes <= 30) {
        targetAccuracy = 0.80 + Math.random() * 0.1; // 80-90%
      } else {
        targetAccuracy = 0.85 + Math.random() * 0.1; // 85-95%
      }

      const totalEpochs = Math.max(10, Math.floor(trainingTimeMinutes * 4)); // ~4 epochs per minute
      const totalSteps = totalEpochs * 10; // 10 simulation steps per epoch
      const intervalDuration = (estimatedTime * 1000) / totalSteps;

      trainingStateRef.current = {
        intervalId: null,
        currentStep: 0,
        totalSteps,
        stage: 'init',
        epoch: 0,
        totalEpochs,
        targetAccuracy
      };

      const intervalId = setInterval(runTrainingSimulation, intervalDuration);
      trainingStateRef.current.intervalId = intervalId;

    } else {
      if (trainingStateRef.current.intervalId) {
        clearInterval(trainingStateRef.current.intervalId);
        trainingStateRef.current.intervalId = null;
      }
    }

    return () => {
      if (trainingStateRef.current.intervalId) {
        clearInterval(trainingStateRef.current.intervalId);
      }
    };
  }, [isTraining, estimatedTime]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isVisible) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-[26rem] bg-slate-900 border-l border-slate-800 shadow-xl z-30 transform transition-transform duration-300 ease-in-out"
         style={{ transform: isVisible ? 'translateX(0)' : 'translateX(100%)' }}>
      <ScrollArea className="h-full p-4">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Live Training Monitor</h3>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Training Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={logContainerRef} className="bg-black rounded-md p-3 h-80 overflow-y-auto font-mono text-xs scroll-smooth">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`whitespace-nowrap ${
                      log.includes('[SUCCESS]') ? 'text-green-400' :
                      log.includes('[METRIC]') ? 'text-cyan-400' :
                      log.includes('[WARN]') ? 'text-yellow-400' :
                      log.includes('[CRITICAL]') ? 'text-red-500 animate-pulse' :
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
            <>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Validation Accuracy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={accuracyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="step" stroke="#64748b" fontSize={10} name="Epoch" />
                      <YAxis stroke="#64748b" fontSize={10} domain={[0, 1.0]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '12px' }}
                        labelClassName="font-bold"
                        itemStyle={{ color: '#818cf8' }}
                        formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
                      />
                      <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                    <TrendingDown className="h-4 w-4" />
                    <span>Training Loss</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={lossData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="step" stroke="#64748b" fontSize={10} name="Epoch" />
                      <YAxis stroke="#64748b" fontSize={10} domain={[0, 'auto']} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '12px' }}
                        labelClassName="font-bold"
                        itemStyle={{ color: '#f87171' }}
                        formatter={(value: number) => value.toFixed(4)}
                      />
                      <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                    <Cpu className="h-4 w-4" />
                    <span>Computational Graph</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={computeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="step" stroke="#64748b" fontSize={10} name="Epoch" />
                      <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} unit="%" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '12px' }}
                        labelClassName="font-bold"
                        formatter={(value: number) => `${value.toFixed(1)}%`}
                      />
                      <Line type="monotone" dataKey="gpu" name="GPU" stroke="#a78bfa" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="cpu" name="CPU" stroke="#38bdf8" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}