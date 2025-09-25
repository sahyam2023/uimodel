import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Archive, MoveHorizontal as MoreHorizontal, Download, Rocket, RotateCcw } from 'lucide-react';
import { Model } from '@/types';

const models: Model[] = [
  {
    id: 'model-001',
    name: 'Traffic Flow Predictor',
    version: 'v2.1.0',
    status: 'Production',
    accuracy: 94.2,
    created: '2024-01-15',
  },
  {
    id: 'model-002',
    name: 'Waste Collection Optimizer',
    version: 'v1.3.2',
    status: 'Staging',
    accuracy: 87.8,
    created: '2024-01-12',
  },
  {
    id: 'model-003',
    name: 'Energy Consumption Forecaster',
    version: 'v3.0.1',
    status: 'Production',
    accuracy: 91.5,
    created: '2024-01-10',
  },
  {
    id: 'model-004',
    name: 'Public Safety Risk Assessment',
    version: 'v1.0.0',
    status: 'Development',
    accuracy: 89.3,
    created: '2024-01-08',
  },
  {
    id: 'model-005',
    name: 'Water Quality Monitor',
    version: 'v2.2.1',
    status: 'Production',
    accuracy: 96.1,
    created: '2024-01-05',
  },
];

export function Registry() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Production':
        return 'bg-green-600 hover:bg-green-700';
      case 'Staging':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'Development':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Model Registry</h2>
        <p className="text-slate-400">
          Version control and deployment management for your trained models
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Archive className="h-5 w-5 text-indigo-400" />
            <span>Registered Models ({models.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {models.map((model) => (
              <div
                key={model.id}
                className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-white">{model.name}</h3>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {model.version}
                    </Badge>
                    <Badge className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <span>Accuracy: {model.accuracy}%</span>
                    <span>Created: {new Date(model.created).toLocaleDateString()}</span>
                    <span>Model ID: {model.id}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300 hover:bg-slate-700"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800 border-slate-700" align="end">
                      <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                        <Rocket className="mr-2 h-4 w-4" />
                        Promote to Production
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Rollback Version
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                        <Archive className="mr-2 h-4 w-4" />
                        Archive Model
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}