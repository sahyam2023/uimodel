import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, Thermometer, MemoryStick, HardDrive, Zap, Server, Loader2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '@/lib/utils';

const generateFakeProcess = () => {
  const processes = [
    'python train.py --model=resnet',
    'jupyter-notebook --port=8888',
    'tensorboard --logdir=runs',
    'nvidia-smi -l 1',
    'htop',
    'docker exec -it tf-gpu-1 bash',
  ];
  return processes[Math.floor(Math.random() * processes.length)];
};

const ServerIcon = ({ status }: { status: 'online' | 'offline' | 'fetching' }) => (
  <div className="relative">
    <Server
      className={cn(
        'h-10 w-10',
        status === 'online' && 'text-green-500',
        status === 'offline' && 'text-slate-600',
        status === 'fetching' && 'text-amber-500'
      )}
    />
    {status === 'online' && (
      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-slate-900" />
    )}
    {status === 'fetching' && (
      <Loader2 className="absolute bottom-0 right-0 h-4 w-4 animate-spin text-amber-500" />
    )}
  </div>
);

const MetricChart = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={40}>
    <LineChart data={data}>
      <YAxis domain={[0, 100]} hide />
      <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

const ServerCard = ({ serverId, isActive }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [metrics, setMetrics] = useState({
    cpuTemp: 0,
    gpuTemp: 0,
    memoryUsage: 0,
    diskUsage: 0,
    processes: [],
  });
  const [cpuHistory, setCpuHistory] = useState([]);
  const [gpuHistory, setGpuHistory] = useState([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showDetails) {
      interval = setInterval(() => {
        setCpuHistory(prev => [...prev.slice(-20), { value: Math.floor(Math.random() * 100) }]);
        setGpuHistory(prev => [...prev.slice(-20), { value: Math.floor(Math.random() * 100) }]);
        setMetrics({
          cpuTemp: Math.floor(Math.random() * (90 - 40 + 1)) + 40,
          gpuTemp: Math.floor(Math.random() * (95 - 45 + 1)) + 45,
          memoryUsage: Math.floor(Math.random() * 100),
          diskUsage: Math.floor(Math.random() * 100),
          processes: Array.from({ length: 3 }, generateFakeProcess),
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [showDetails]);

  const handleClick = () => {
    if (showDetails) {
      setShowDetails(false);
    } else {
      setIsFetching(true);
      setCpuHistory([]);
      setGpuHistory([]);
      setTimeout(() => {
        setIsFetching(false);
        setShowDetails(true);
      }, 1500);
    }
  };

  const status = isActive ? (isFetching ? 'fetching' : 'online') : 'offline';

  return (
    <Card className={cn("bg-slate-900 border-slate-800 transition-all", !isActive && 'opacity-60')}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <ServerIcon status={status} />
            <div>
              <CardTitle className="text-white">Server {serverId}</CardTitle>
              <p className={cn("text-sm",
                status === 'online' && 'text-green-400',
                status === 'offline' && 'text-slate-500',
                status === 'fetching' && 'text-amber-400'
              )}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </p>
            </div>
          </div>
          <Button onClick={handleClick} disabled={isFetching || !isActive} size="sm">
            {isFetching ? 'Fetching...' : showDetails ? 'Hide' : 'Details'}
          </Button>
        </div>
      </CardHeader>
      {showDetails && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <div className="flex justify-between items-center text-slate-400"><span><Cpu className="mr-2 h-4 w-4 inline"/>CPU</span> <span>{cpuHistory.at(-1)?.value || 0}%</span></div>
              <MetricChart data={cpuHistory} color="#38bdf8" />
            </div>
            <div>
              <div className="flex justify-between items-center text-slate-400"><span><Zap className="mr-2 h-4 w-4 inline"/>GPU</span> <span>{gpuHistory.at(-1)?.value || 0}%</span></div>
              <MetricChart data={gpuHistory} color="#a78bfa" />
            </div>
            <div className="flex items-center text-slate-400"><Thermometer className="mr-2 h-4 w-4" /> CPU Temp: {metrics.cpuTemp}°C</div>
            <div className="flex items-center text-slate-400"><Thermometer className="mr-2 h-4 w-4" /> GPU Temp: {metrics.gpuTemp}°C</div>
            <div className="flex items-center text-slate-400"><MemoryStick className="mr-2 h-4 w-4" /> Memory: {metrics.memoryUsage}%</div>
            <div className="flex items-center text-slate-400"><HardDrive className="mr-2 h-4 w-4" /> Disk: {metrics.diskUsage}%</div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-300">Running Processes</h4>
            <div className="mt-2 text-xs space-y-1 font-mono text-slate-400">
              {metrics.processes.map((p, i) => <p key={i} className="truncate">{p}</p>)}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const ServerDetails = () => {
  const totalServers = 8;
  const onlineServers = 6;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Server Cluster Status</h2>
        <p className="text-slate-400">
          Real-time monitoring of your server fleet.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(totalServers)].map((_, i) => (
          <ServerCard key={i + 1} serverId={i + 1} isActive={i < onlineServers} />
        ))}
      </div>
    </div>
  );
};

export default ServerDetails;