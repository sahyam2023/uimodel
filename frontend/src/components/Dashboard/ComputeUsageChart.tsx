import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

const generateDataPoint = (time: string) => ({
  time,
  usage: Math.floor(Math.random() * 40) + 60, // 60-100% usage
});

export function ComputeUsageChart() {
  const [data, setData] = useState(() => {
    const initialData = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date();
      time.setHours(time.getHours() - i);
      initialData.push(generateDataPoint(time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })));
    }
    return initialData;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)];
        const now = new Date();
        newData.push(generateDataPoint(now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })));
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Live GPU Cluster Utilization</CardTitle>
        <CardDescription className="text-slate-400">
          Real-time monitoring of compute resources across all clusters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="time" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
            />
            <Area
              type="monotone"
              dataKey="usage"
              stroke="#6366f1"
              fill="url(#colorUsage)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}