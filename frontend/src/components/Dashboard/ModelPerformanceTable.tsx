import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const models = [
  {
    name: 'Traffic Flow Predictor',
    accuracy: 94.2,
    status: 'Deployed',
    sparklineData: [65, 70, 75, 80, 85, 90, 94],
  },
  {
    name: 'Waste Collection Optimizer',
    accuracy: 87.8,
    status: 'Training',
    sparklineData: [60, 65, 70, 75, 80, 85, 88],
  },
  {
    name: 'Energy Consumption Forecaster',
    accuracy: 91.5,
    status: 'Deployed',
    sparklineData: [70, 75, 80, 85, 88, 90, 92],
  },
  {
    name: 'Public Safety Risk Assessment',
    accuracy: 89.3,
    status: 'Deployed',
    sparklineData: [75, 78, 82, 85, 87, 88, 89],
  },
  {
    name: 'Water Quality Monitor',
    accuracy: 96.1,
    status: 'Deployed',
    sparklineData: [80, 85, 88, 92, 94, 95, 96],
  },
];

export function ModelPerformanceTable() {
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
                    variant={model.status === 'Deployed' ? 'default' : 'secondary'}
                    className={
                      model.status === 'Deployed' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-yellow-600 hover:bg-yellow-700'
                    }
                  >
                    {model.status}
                  </Badge>
                </div>
              </div>
              <div className="w-24 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={model.sparklineData.map((value, i) => ({ value, index: i }))}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#6366f1" 
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