import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';

interface LiveMonitoringSidebarProps {
  isVisible: boolean;
  isTraining: boolean;
}

export function LiveMonitoringSidebar({ isVisible, isTraining }: LiveMonitoringSidebarProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [accuracyData, setAccuracyData] = useState<Array<{ epoch: number; accuracy: number }>>([]);
  const [featureImportance, setFeatureImportance] = useState<Array<{ feature: string; importance: number }>>([]);

  useEffect(() => {
    if (!isTraining) return;

    const logMessages = [
      '[INFO] Initializing training environment...',
      '[INFO] Loading dataset and preprocessing...',
      '[INFO] Starting model training...',
      '[INFO] Epoch 1/100 - Loss: 0.8234, Accuracy: 0.6543',
      '[INFO] Epoch 5/100 - Loss: 0.6789, Accuracy: 0.7234',
      '[INFO] Epoch 10/100 - Loss: 0.5432, Accuracy: 0.7891',
      '[INFO] Epoch 20/100 - Loss: 0.4321, Accuracy: 0.8234',
      '[INFO] Epoch 30/100 - Loss: 0.3654, Accuracy: 0.8567',
      '[INFO] Epoch 50/100 - Loss: 0.2987, Accuracy: 0.8891',
      '[INFO] Epoch 75/100 - Loss: 0.2345, Accuracy: 0.9123',
      '[INFO] Epoch 100/100 - Loss: 0.1987, Accuracy: 0.9234',
      '[SUCCESS] Model training completed successfully!',
      '[INFO] Generating performance metrics...',
      '[SUCCESS] Model ready for deployment!'
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < logMessages.length) {
        setLogs(prev => [...prev, logMessages[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 400);

    // Generate accuracy data
    const accuracyInterval = setInterval(() => {
      setAccuracyData(prev => {
        if (prev.length >= 10) return prev;
        const newEpoch = prev.length + 1;
        const baseAccuracy = 0.65 + (newEpoch * 0.025) + (Math.random() * 0.02);
        return [...prev, { epoch: newEpoch * 10, accuracy: Math.min(baseAccuracy, 0.95) }];
      });
    }, 500);

    // Generate feature importance after training
    setTimeout(() => {
      setFeatureImportance([
        { feature: 'Traffic Density', importance: 0.35 },
        { feature: 'Time of Day', importance: 0.28 },
        { feature: 'Weather Conditions', importance: 0.18 },
        { feature: 'Day of Week', importance: 0.12 },
        { feature: 'Special Events', importance: 0.07 },
      ]);
    }, 4500);

    return () => {
      clearInterval(logInterval);
      clearInterval(accuracyInterval);
    };
  }, [isTraining]);

  if (!isVisible) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-800 shadow-xl z-30 overflow-y-auto">
      <div className="p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Live Monitoring</h3>
        </div>

        {/* Log Stream */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white">Training Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-md p-3 h-48 overflow-y-auto font-mono text-xs">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-1 ${
                    log.includes('[SUCCESS]') ? 'text-green-400' :
                    log.includes('[INFO]') ? 'text-blue-400' :
                    'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Accuracy Chart */}
        {accuracyData.length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Training Accuracy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="epoch" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0.6, 1]} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Feature Importance */}
        {featureImportance.length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">Feature Importance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={featureImportance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#64748b" fontSize={10} />
                  <YAxis dataKey="feature" type="category" stroke="#64748b" fontSize={10} width={80} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="importance" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}