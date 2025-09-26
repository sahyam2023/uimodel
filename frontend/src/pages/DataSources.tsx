import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Settings, Loader2, XCircle } from 'lucide-react';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { initialDataSources, DataSource } from '@/lib/dataSources';

export function DataSources() {
  const [dataSources, setDataSources] = useState<DataSource[]>(() => {
    try {
      const savedDataSources = sessionStorage.getItem('dataSources');
      if (savedDataSources) {
        const parsedSources: Partial<DataSource>[] = JSON.parse(savedDataSources);
        return initialDataSources.map(initialSource => {
          const savedSource = parsedSources.find(s => s.id === initialSource.id);
          return savedSource ? { ...initialSource, ...savedSource } : initialSource;
        });
      }
    } catch (error) {
      console.error("Failed to parse data sources from session storage", error);
    }
    return initialDataSources;
  });

  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState({ host: '', port: '', database: '', username: '', password: '' });

  useEffect(() => {
    try {
      const serializableDataSources = dataSources.map(({ icon, ...rest }) => rest);
      sessionStorage.setItem('dataSources', JSON.stringify(serializableDataSources));
    } catch (error) {
      console.error("Failed to save data sources to session storage", error);
    }
  }, [dataSources]);

  const handleConnectClick = (sourceId: string) => {
    setSelectedSourceId(sourceId);
    setConnectionDetails({ host: '', port: '', database: '', username: '', password: '' });
    setIsDialogOpen(true);
  };

  const handleDisconnectClick = (sourceId: string) => {
    const sourceToDisconnect = dataSources.find(s => s.id === sourceId);
    if (!sourceToDisconnect) return;

    setDataSources(currentSources =>
      currentSources.map(source =>
        source.id === sourceId ? { ...source, status: 'disconnected', connections: 0 } : source
      )
    );
    toast.info(`Disconnected from ${sourceToDisconnect.name}`);
  };

  const handleTestConnection = async () => {
    if (!selectedSourceId) return;

    setIsTesting(true);
    try {
      const response = await apiService.testConnection({ id: selectedSourceId, ...connectionDetails });
      toast.success(response.message);

      // Update status in the UI
      setDataSources(currentSources =>
        currentSources.map(source =>
          source.id === selectedSourceId ? { ...source, status: 'connected', connections: 1 } : source
        )
      );

      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Connection test failed. Please check your details.');
      console.error(error);
    } finally {
      setIsTesting(false);
    }
  };

  const selectedSourceData = dataSources.find(source => source.id === selectedSourceId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Data Sources</h2>
        <p className="text-slate-400">
          Connect and manage your data sources for machine learning workflows.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Databases & Warehouses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataSources.filter(s => s.type === 'database').map((source) => (
              <DataSourceCard key={source.id} source={source} onConnect={handleConnectClick} onDisconnect={handleDisconnectClick} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Streaming Event Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataSources.filter(s => s.type === 'streaming').map((source) => (
              <DataSourceCard key={source.id} source={source} onConnect={handleConnectClick} onDisconnect={handleDisconnectClick} />
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>Connect to {selectedSourceData?.name}</DialogTitle>
            <DialogDescription>
              Enter the connection details for your {selectedSourceData?.name} instance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input id="host" value={connectionDetails.host} placeholder="localhost" className="bg-slate-800 border-slate-700" onChange={e => setConnectionDetails({...connectionDetails, host: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" value={connectionDetails.port} placeholder="5432" className="bg-slate-800 border-slate-700" onChange={e => setConnectionDetails({...connectionDetails, port: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="database">Database</Label>
              <Input id="database" value={connectionDetails.database} placeholder="mydatabase" className="bg-slate-800 border-slate-700" onChange={e => setConnectionDetails({...connectionDetails, database: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={connectionDetails.username} placeholder="admin" className="bg-slate-800 border-slate-700" onChange={e => setConnectionDetails({...connectionDetails, username: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" value={connectionDetails.password} type="password" className="bg-slate-800 border-slate-700" onChange={e => setConnectionDetails({...connectionDetails, password: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-700 hover:bg-slate-800">
              Cancel
            </Button>
            <Button onClick={handleTestConnection} disabled={isTesting} className="bg-indigo-600 hover:bg-indigo-700">
              {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test Connection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface DataSourceCardProps {
  source: DataSource;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({ source, onConnect, onDisconnect }) => {
  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg ${source.bgColor}`}>
            <source.icon className={`h-6 w-6 ${source.color}`} />
          </div>
          <Badge
            className={
              source.status === 'connected'
                ? 'bg-green-600/80 text-white'
                : 'bg-slate-600/80 text-slate-300'
            }
          >
            {source.status === 'connected' ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
        </div>
        <CardTitle className="text-white pt-2">{source.name}</CardTitle>
        <CardDescription className="text-slate-400">
          {source.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
         <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-slate-400">Active Connections</span>
            <span className="text-white font-medium">{source.connections}</span>
          </div>
        <div className="flex space-x-2">
          {source.status === 'connected' ? (
            <Button
              onClick={() => onDisconnect(source.id)}
              variant="destructive"
              className="flex-1"
              size="sm"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={() => onConnect(source.id)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Connect
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
            disabled
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};