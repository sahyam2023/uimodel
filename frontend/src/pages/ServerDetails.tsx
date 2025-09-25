import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, Thermometer, MemoryStick, HardDrive, Zap, Server, Globe } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '@/lib/utils';

// --- Static Server Data ---
const generateRandomHistory = (length = 20, min = 20, max = 80) => 
  Array.from({ length }, () => ({ value: Math.floor(Math.random() * (max - min + 1)) + min }));

const serversData = [
  {
    id: 1,
    ip: '192.168.3.14',
    status: 'online',
    cpuTemp: 92, // Hot server
    gpuTemp: 85,
    memoryUsage: 88,
    diskUsage: 75,
    cpuHistory: generateRandomHistory(20, 80, 95),
    gpuHistory: generateRandomHistory(20, 70, 90),
    processes: ['python train.py --model=transformer-xl', 'tensorboard --logdir=runs/hot-server', 'htop'],
  },
  {
    id: 2,
    ip: '192.168.3.25',
    status: 'online',
    cpuTemp: 76, // Yellow server
    gpuTemp: 72,
    memoryUsage: 60,
    diskUsage: 45,
    cpuHistory: generateRandomHistory(20, 60, 80),
    gpuHistory: generateRandomHistory(20, 60, 75),
    processes: ['jupyter-notebook --port=8888', 'nvidia-smi -l 1', 'data-preprocessor.sh'],
  },
  {
    id: 3,
    ip: '192.168.3.10',
    status: 'online',
    cpuTemp: 68, // Green server
    gpuTemp: 65,
    memoryUsage: 45,
    diskUsage: 30,
    cpuHistory: generateRandomHistory(20, 50, 70),
    gpuHistory: generateRandomHistory(20, 50, 70),
    processes: ['inference_server --model=resnet50', 'redis-server', 'monitoring_agent'],
  },
  {
    id: 4,
    ip: '192.168.3.33',
    status: 'online',
    cpuTemp: 65, // Green server
    gpuTemp: 62,
    memoryUsage: 50,
    diskUsage: 55,
    cpuHistory: generateRandomHistory(20, 40, 65),
    gpuHistory: generateRandomHistory(20, 50, 65),
    processes: ['data_caching_service', 'cron -f', 'sshd'],
  },
  {
    id: 5,
    ip: '192.168.3.48',
    status: 'online',
    cpuTemp: 71, // Yellow server
    gpuTemp: 68,
    memoryUsage: 70,
    diskUsage: 80,
    cpuHistory: generateRandomHistory(20, 65, 75),
    gpuHistory: generateRandomHistory(20, 60, 70),
    processes: ['docker exec -it data-etl bash', 'spark-worker', 'zookeeper'],
  },
  {
    id: 6,
    ip: '192.168.3.19',
    status: 'online',
    cpuTemp: 69, // Green server
    gpuTemp: 66,
    memoryUsage: 55,
    diskUsage: 40,
    cpuHistory: generateRandomHistory(20, 55, 70),
    gpuHistory: generateRandomHistory(20, 60, 70),
    processes: ['beam_pipeline --runner=flink', 'kafka_consumer.py', 'postgres'],
  },
  {
    id: 7,
    ip: '192.168.3.22',
    status: 'offline',
    cpuTemp: 0,
    gpuTemp: 0,
    memoryUsage: 0,
    diskUsage: 0,
    cpuHistory: [],
    gpuHistory: [],
    processes: [],
  },
  {
    id: 8,
    ip: '192.168.3.50',
    status: 'offline',
    cpuTemp: 0,
    gpuTemp: 0,
    memoryUsage: 0,
    diskUsage: 0,
    cpuHistory: [],
    gpuHistory: [],
    processes: [],
  },
];
// --- End Static Server Data ---

const ServerIcon = ({ status }: { status: 'online' | 'offline' }) => (
  <div className="relative">
    <Server
      className={cn(
        'h-10 w-10',
        status === 'online' ? 'text-green-500' : 'text-slate-600'
      )}
    />
    {status === 'online' && (
      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-slate-900" />
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

const TemperatureDisplay = ({ label, temp }) => {
  const tempColor =
    temp > 90 ? 'text-red-500' :
    temp > 70 ? 'text-yellow-400' :
    'text-green-400';

  return (
    <div className="flex items-center text-slate-400">
        <Thermometer className={cn("mr-2 h-4 w-4", tempColor)} /> 
        {label}: <span className={cn("font-bold ml-1", tempColor)}>{temp}°C</span>
    </div>
  )
};

const ServerCard = ({ server }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    if (server.status === 'online') {
      setShowDetails(prev => !prev);
    }
  };

  return (
    <Card className={cn("bg-slate-900 border-slate-800 transition-all", server.status === 'offline' && 'opacity-60')}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <ServerIcon status={server.status} />
            <div>
              <CardTitle className="text-white">Server {server.id}</CardTitle>
              <p className={cn("text-sm", server.status === 'online' ? 'text-green-400' : 'text-slate-500')}>
                {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
              </p>
               <p className="text-xs text-slate-500 flex items-center pt-1">
                <Globe className="h-3 w-3 mr-1.5"/>{server.ip}
              </p>
            </div>
          </div>
          <Button onClick={handleClick} disabled={server.status === 'offline'} size="sm">
            {showDetails ? 'Hide' : 'Details'}
          </Button>
        </div>
      </CardHeader>
      {showDetails && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <div className="flex justify-between items-center text-slate-400"><span><Cpu className="mr-2 h-4 w-4 inline"/>CPU</span> <span>{server.cpuHistory.at(-1)?.value || 0}%</span></div>
              <MetricChart data={server.cpuHistory} color="#38bdf8" />
            </div>
            <div>
              <div className="flex justify-between items-center text-slate-400"><span><Zap className="mr-2 h-4 w-4 inline"/>GPU</span> <span>{server.gpuHistory.at(-1)?.value || 0}%</span></div>
              <MetricChart data={server.gpuHistory} color="#a78bfa" />
            </div>
            <TemperatureDisplay label="CPU Temp" temp={server.cpuTemp} />
            <TemperatureDisplay label="GPU Temp" temp={server.gpuTemp} />
            <div className="flex items-center text-slate-400"><MemoryStick className="mr-2 h-4 w-4" /> Memory: {server.memoryUsage}%</div>
            <div className="flex items-center text-slate-400"><HardDrive className="mr-2 h-4 w-4" /> Disk: {server.diskUsage}%</div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-300">Running Processes</h4>
            <div className="mt-2 text-xs space-y-1 font-mono text-slate-400">
              {server.processes.map((p, i) => <p key={i} className="truncate">{p}</p>)}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const ServerDetails = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Server Cluster Status</h2>
        <p className="text-slate-400">
          Real-time monitoring of your server fleet.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {serversData.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
    </div>
  );
};

export default ServerDetails;