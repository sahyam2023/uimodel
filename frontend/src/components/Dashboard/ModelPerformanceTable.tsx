import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

const initialModels = [
  {
    name: 'Traffic Flow Predictor',
    accuracy: 94.2,
    status: 'Deployed',
    sparklineData: [65, 70, 75, 80, 85, 90, 94, 94.2, 94.1, 94.3, 94.2, 94.2],
  },
  {
    name: 'Waste Collection Optimizer',
    accuracy: 87.8,
    status: 'Training',
    sparklineData: [60, 65, 70, 75, 80, 85, 88, 87.5, 87.9, 88.1, 87.8],
  },
  {
    name: 'Energy Consumption Forecaster',
    accuracy: 91.5,
    status: 'Deployed',
    sparklineData: [70, 75, 80, 85, 88, 90, 92, 91.8, 91.5, 91.6, 91.5, 91.5],
  },
  {
    name: 'Public Safety Risk Assessment',
    accuracy: 89.3,
    status: 'Deployed',
    sparklineData: [75, 78, 82, 85, 87, 88, 89, 89.1, 89.3, 89.2, 89.4, 89.3],
  },
  {
    name: 'Water Quality Monitor',
    accuracy: 96.1,
    status: 'Deployed',
    sparklineData: [80, 85, 88, 92, 94, 95, 96, 96.2, 96.1, 96.3, 96.0, 96.1],
  },
];

export function ModelPerformanceTable() {
  const [models, setModels] = useState(initialModels);

  useEffect(() => {
    const interval = setInterval(() => {
      setModels(currentModels =>
        currentModels.map(model => {
          if (model.status === 'Training') {
            const lastDataPoint = model.sparklineData[model.sparklineData.length - 1];
            const newDataPoint = Math.min(99, lastDataPoint + (Math.random() * 1.5 - 0.5));
            const newSparklineData = [...model.sparklineData.slice(1), newDataPoint];
            return {
              ...model,
              accuracy: parseFloat(newDataPoint.toFixed(1)),
              sparklineData: newSparklineData,
            };
          } else { // 'Deployed'
            const newSparklineData = [...model.sparklineData.slice(1), model.sparklineData[0]];
            return {
              ...model,
              sparklineData: newSparklineData,
            };
          }
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Model Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {models.map((model, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-white">{model.name}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-slate-400">
                    Accuracy: {model.accuracy}%
                  </span>
                  <Badge
                    className={
                      model.status === 'Deployed'
                        ? 'bg-green-600/80 text-white'
                        : 'bg-yellow-500/80 text-white animate-pulse'
                    }
                  >
                    {model.status}
                  </Badge>
                </div>
              </div>
              <div className="w-32 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={model.sparklineData.map((value) => ({ value }))}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={model.status === 'Training' ? "#f59e0b" : "#4ade80"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}