import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Database, Server, Activity } from 'lucide-react';
import { KPIData } from '@/types';

interface KPICardsProps {
  data: KPIData;
}

export function KPICards({ data }: KPICardsProps) {
  const kpis = [
    {
      title: 'Active AI Models',
      value: data.activeModels.toString(),
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      description: null,
    },
    {
      title: 'Total Datasets',
      value: data.totalDatasets.toString(),
      icon: Database,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      description: '+12% from last month',
    },
    {
      title: 'Server Load',
      value: `${data.serverLoad}%`,
      icon: Cpu,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      description: null,
    },
    {
      title: 'Server Status',
      value: 'Connected',
      icon: Server,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      description: `${data.serversOnline} / ${data.serversTotal} online`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              {kpi.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
            <p className="text-xs text-slate-400 mt-1">
              {kpi.description || '\u00A0'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}