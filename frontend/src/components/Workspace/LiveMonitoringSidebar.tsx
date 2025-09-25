import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, TrendingUp, Cpu, BarChart2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrainingLog, ChartData } from '@/types';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LiveMonitoringSidebarProps {
  isVisible: boolean;
  isTraining: boolean;
  logs: TrainingLog[];
  remainingTime: number;
  currentEpoch: number;
  totalEpochs: number;
  accuracyData: ChartData[];
  estimatedDuration: number;
}

const formatTime = (seconds: number) => {
  if (seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const LOG_LEVEL_COLORS = {
  info: 'text-slate-400',
  epoch: 'text-cyan-400 font-semibold',
  warning: 'text-yellow-400',
  error: 'text-red-500',
  system: 'text-indigo-400',
};

function StatsCard({ title, value, subValue }: { title: string; value: string; subValue: string }) {
    return (
        <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-xs text-slate-400">{title}</p>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500">{subValue}</p>
        </div>
    );
}

export function LiveMonitoringSidebar({ 
    isVisible, 
    isTraining,
    logs,
    remainingTime,
    currentEpoch,
    totalEpochs,
    accuracyData,
    estimatedDuration
}: LiveMonitoringSidebarProps) {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);
  
  const progressPercentage = estimatedDuration > 0 ? ((estimatedDuration - remainingTime) / estimatedDuration) * 100 : 0;

  if (!isVisible) return null;

  return (
    <div className={cn("fixed right-0 top-16 h-[calc(100vh-4rem)] w-[26rem] bg-slate-900 border-l border-slate-800 shadow-xl z-30 transform transition-transform duration-300 ease-in-out",
        isVisible ? 'translate-x-0' : 'translate-x-full'
    )}>
      <ScrollArea className="h-full p-4">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Live Training Monitor</h3>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Training Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <StatsCard title="Time Remaining" value={formatTime(remainingTime)} subValue="Est." />
                    <StatsCard title="Current Epoch" value={`${currentEpoch}`} subValue={`/ ${totalEpochs}`} />
                    <StatsCard title="Accuracy" value={`${accuracyData.at(-1)?.value.toFixed(2) || '0.00'}%`} subValue="Current" />
                </div>
                <Progress value={progressPercentage} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Training Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={logContainerRef} className="bg-black rounded-md p-3 h-64 overflow-y-auto font-mono text-xs scroll-smooth">
                {logs.map((log, index) => (
                  <div key={index} className="flex">
                    <span className="text-slate-500 mr-2">{log.timestamp}</span>
                    <span className={cn(LOG_LEVEL_COLORS[log.level], 'flex-1')}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Validation Accuracy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={accuracyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} name="Time" unit="s" />
                  <YAxis stroke="#64748b" fontSize={10} domain={[60, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '12px' }}
                    labelClassName="font-bold"
                    formatter={(value: number) => `${value.toFixed(2)}%`}
                  />
                  <defs>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={2} fill="url(#colorAccuracy)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>Features Graph</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={accuracyData.map(d => ({...d, value: d.value * (0.5 + Math.random() * 0.2)}))} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} name="Time" unit="s"/>
                    <YAxis stroke="#64748b" fontSize={10} domain={[0, 1]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '12px' }}
                      labelClassName="font-bold"
                      formatter={(value: number) => value.toFixed(4)}
                    />
                    <Line type="monotone" dataKey="value" stroke="#f472b6" strokeWidth={2} dot={false} />
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
                   <AreaChart data={accuracyData.map(d => ({...d, value: 70 + Math.sin(d.time / 10) * 15 + Math.random() * 5}))} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} name="Time" unit="s" />
                    <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} unit="%"/>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', fontSize: '12px' }}
                      labelClassName="font-bold"
                      formatter={(value: number) => `${value.toFixed(2)}%`}
                    />
                    <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} fill="url(#colorCpu)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </div>
      </ScrollArea>
    </div>
  );
}