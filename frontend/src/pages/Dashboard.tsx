import { useState, useEffect } from 'react';
import { KPICards } from '@/components/Dashboard/KPICards';
import { ComputeUsageChart } from '@/components/Dashboard/ComputeUsageChart';
import { ModelPerformanceTable } from '@/components/Dashboard/ModelPerformanceTable';
import { KPIData } from '@/types';

const initialKpiData: KPIData = {
  activeModels: 12,
  totalDatasets: 87,
  serverLoad: 76,
  serversOnline: 6,
  serversTotal: 8,
};

export function Dashboard() {
  const [kpiData, setKpiData] = useState<KPIData>(initialKpiData);
  const [isUpdating, setIsUpdating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isUpdating) {
        setKpiData((prevData) => ({
          ...prevData,
          serverLoad: Math.floor(Math.random() * (96 - 70 + 1)) + 70,
          activeModels: prevData.activeModels === 12 ? 'Running...' : 12,
        }));
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isUpdating]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Platform Overview</h2>
        <p className="text-slate-400">
          Monitor your AI infrastructure, model performance, and system metrics in real-time
        </p>
      </div>

      <KPICards data={kpiData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComputeUsageChart />
        <ModelPerformanceTable />
      </div>
    </div>
  );
}