import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, BarChart2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiveMonitoringSidebarProps {
  isVisible: boolean;
  isTraining: boolean;
  estimatedTime: number; // in seconds
}

const generateLogMessage = (epoch: number, totalEpochs: number) => {
  const loss = (1 / (epoch + 1)) * Math.random() + 0.1;
  const accuracy = Math.min(0.98, (epoch / totalEpochs) * 0.6 + 0.35 + (Math.random() - 0.5) * 0.05);
  const logTypes = ['[INFO]', '[DEBUG]', '[METRIC]'];
  const type = logTypes[Math.floor(Math.random() * logTypes.length)];
  return `${type} Epoch ${epoch}/${totalEpochs} - Loss: ${loss.toFixed(4)}, Accuracy: ${accuracy.toFixed(4)}`;
};

const genericFeatures = Array.from({ length: 5 }, (_, i) => `Feature ${i + 1}`);

export function LiveMonitoringSidebar({ isVisible, isTraining, estimatedTime }: LiveMonitoringSidebarProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [accuracyData, setAccuracyData] = useState<Array<{ epoch: number; accuracy: number }>>([]);
  const [featureImportance, setFeatureImportance] = useState<Array<{ feature: string; importance: number }>>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTraining) {
      // Reset state for new training session
      setLogs(['[INFO] Initializing training environment...']);
      setAccuracyData([]);
      setFeatureImportance(genericFeatures.map(f => ({ feature: f, importance: 0 })));

      const totalEpochs = 100;
      let currentEpoch = 0;

      const intervalDuration = (estimatedTime * 1000) / totalEpochs;

      const trainingInterval = setInterval(() => {
        if (currentEpoch >= totalEpochs) {
          clearInterval(trainingInterval);
          setLogs(prev => [...prev, '[SUCCESS] Model training completed!']);
          return;
        }

        currentEpoch++;

        // Update Logs
        setLogs(prev => [...prev.slice(-20), generateLogMessage(currentEpoch, totalEpochs)]);

        // Update Accuracy
        const lastAccuracy = accuracyData.length > 0 ? accuracyData[accuracyData.length - 1].accuracy : 0.3;
        const newAccuracy = Math.min(0.98, lastAccuracy + (Math.random() * 0.05) - 0.02);
        setAccuracyData(prev => [...prev.slice(-20), { epoch: currentEpoch, accuracy: newAccuracy }]);

        // Update Feature Importance
        setFeatureImportance(prev =>
          prev.map(f => ({
            ...f,
            importance: Math.max(0, Math.min(1, f.importance + (Math.random() - 0.45) * 0.05)),
          }))
        );

      }, intervalDuration);

      return () => clearInterval(trainingInterval);
    }
  }, [isTraining, estimatedTime]);

  useEffect(() => {
    // Auto-scroll logs
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isVisible) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-800 shadow-xl z-30">
      <ScrollArea className="h-full p-4">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Live Monitoring</h3>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">Training Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={logContainerRef} className="bg-black rounded-md p-3 h-48 overflow-y-auto font-mono text-xs scroll-smooth">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`mb-1 ${
                      log.includes('[SUCCESS]') ? 'text-green-400' :
                      log.includes('[METRIC]') ? 'text-cyan-400' :
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
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Training Accuracy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={accuracyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="epoch" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} domain={['dataMin - 0.05', 'dataMax + 0.05']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '12px' }}
                      labelClassName="font-bold"
                      itemClassName="text-indigo-400"
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {featureImportance.length > 0 && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center space-x-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>Feature Importance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={featureImportance} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#64748b" fontSize={10} domain={[0, 1]} />
                    <YAxis dataKey="feature" type="category" stroke="#64748b" fontSize={10} width={60} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '12px' }}
                      labelClassName="font-bold"
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