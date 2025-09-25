import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, Thermometer, MemoryStick, HardDrive, Zap } from 'lucide-react';

const generateFakeProcess = () => {
  const processes = [
    'python train.py --model=resnet50',
    'jupyter notebook --port=8888',
    'tensorboard --logdir=runs',
    'nvidia-smi -l 1',
    'htop',
    'docker run -it tensorflow/tensorflow:latest-gpu',
  ];
  return processes[Math.floor(Math.random() * processes.length)];
};

const ServerCard = ({ serverId, isActive }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [metrics, setMetrics] = useState({
    cpuUsage: 0,
    gpuUsage: 0,
    cpuTemp: 0,
    gpuTemp: 0,
    memoryUsage: 0,
    diskUsage: 0,
    processes: [],
  });

  useEffect(() => {
    if (showDetails) {
      const interval = setInterval(() => {
        setMetrics({
          cpuUsage: Math.floor(Math.random() * 100),
          gpuUsage: Math.floor(Math.random() * 100),
          cpuTemp: Math.floor(Math.random() * (90 - 40 + 1)) + 40,
          gpuTemp: Math.floor(Math.random() * (95 - 45 + 1)) + 45,
          memoryUsage: Math.floor(Math.random() * 100),
          diskUsage: Math.floor(Math.random() * 100),
          processes: Array.from({ length: 3 }, generateFakeProcess),
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [showDetails]);

  const handleClick = () => {
    if (showDetails) {
      setShowDetails(false);
    } else {
      setIsFetching(true);
      const fetchTime = Math.random() * (5000 - 3000) + 3000;
      setTimeout(() => {
        setIsFetching(false);
        setShowDetails(true);
      }, fetchTime);
    }
  };

  return (
    <Card className={`bg-slate-900 border-slate-800 ${!isActive ? 'opacity-50' : ''}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Server {serverId}</span>
          <Button onClick={handleClick} disabled={isFetching || !isActive}>
            {isFetching ? 'Fetching Data...' : showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </CardTitle>
      </CardHeader>
      {showDetails && (
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center"><Cpu className="mr-2 h-4 w-4" /> CPU Usage: {metrics.cpuUsage}%</div>
            <div className="flex items-center"><Zap className="mr-2 h-4 w-4" /> GPU Usage: {metrics.gpuUsage}%</div>
            <div className="flex items-center"><Thermometer className="mr-2 h-4 w-4" /> CPU Temp: {metrics.cpuTemp}°C</div>
            <div className="flex items-center"><Thermometer className="mr-2 h-4 w-4" /> GPU Temp: {metrics.gpuTemp}°C</div>
            <div className="flex items-center"><MemoryStick className="mr-2 h-4 w-4" /> Memory Usage: {metrics.memoryUsage}%</div>
            <div className="flex items-center"><HardDrive className="mr-2 h-4 w-4" /> Disk Usage: {metrics.diskUsage}%</div>
          </div>
          <div className="mt-4">
            <h4 className="font-bold">Running Processes</h4>
            <ul className="list-disc list-inside mt-2 text-xs">
              {metrics.processes.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
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
        <h2 className="text-2xl font-bold text-white mb-2">Server Details</h2>
        <p className="text-slate-400">
          Monitor your server fleet in real-time.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {[...Array(totalServers)].map((_, i) => (
          <ServerCard key={i + 1} serverId={i + 1} isActive={i < onlineServers} />
        ))}
      </div>
    </div>
  );
};

export default ServerDetails;