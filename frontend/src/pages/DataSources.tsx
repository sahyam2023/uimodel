import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Database, Plus, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Settings } from 'lucide-react';

const dataSources = [
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Connect to PostgreSQL databases for structured data',
    icon: Database,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    status: 'connected',
    connections: 3,
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    description: 'Access data stored in Amazon S3 buckets',
    icon: Database,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    status: 'connected',
    connections: 7,
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    description: 'Connect to Snowflake data warehouse',
    icon: Database,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    status: 'disconnected',
    connections: 0,
  },
  {
    id: 'kafka',
    name: 'Apache Kafka',
    description: 'Stream real-time data from Kafka topics',
    icon: Database,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    status: 'connected',
    connections: 2,
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'Connect to MongoDB for document-based data',
    icon: Database,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    status: 'disconnected',
    connections: 0,
  },
  {
    id: 'bigquery',
    name: 'Google BigQuery',
    description: 'Access Google Cloud BigQuery datasets',
    icon: Database,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    status: 'connected',
    connections: 1,
  },
];

export function DataSources() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConnect = (sourceId: string) => {
    setSelectedSource(sourceId);
    setIsDialogOpen(true);
  };

  const selectedSourceData = dataSources.find(source => source.id === selectedSource);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Data Sources</h2>
        <p className="text-slate-400">
          Connect and manage your data sources for machine learning workflows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataSources.map((source) => (
          <Card key={source.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${source.bgColor}`}>
                  <source.icon className={`h-6 w-6 ${source.color}`} />
                </div>
                <Badge 
                  variant={source.status === 'connected' ? 'default' : 'secondary'}
                  className={
                    source.status === 'connected' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-slate-600 hover:bg-slate-700'
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
              <CardTitle className="text-white">{source.name}</CardTitle>
              <CardDescription className="text-slate-400">
                {source.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Active Connections</span>
                  <span className="text-white font-medium">{source.connections}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleConnect(source.id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedSourceData && (
                <>
                  <div className={`p-2 rounded-lg ${selectedSourceData.bgColor}`}>
                    <selectedSourceData.icon className={`h-5 w-5 ${selectedSourceData.color}`} />
                  </div>
                  <span>Connect to {selectedSourceData.name}</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure your connection settings for {selectedSourceData?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="host" className="text-slate-300">Host</Label>
              <Input
                id="host"
                placeholder="localhost"
                className="bg-slate-800 border-slate-700 text-white"
                disabled
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="port" className="text-slate-300">Port</Label>
                <Input
                  id="port"
                  placeholder="5432"
                  className="bg-slate-800 border-slate-700 text-white"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="database" className="text-slate-300">Database</Label>
                <Input
                  id="database"
                  placeholder="smartcity"
                  className="bg-slate-800 border-slate-700 text-white"
                  disabled
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">Username</Label>
              <Input
                id="username"
                placeholder="admin"
                className="bg-slate-800 border-slate-700 text-white"
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-slate-800 border-slate-700 text-white"
                disabled
              />
            </div>
            
            <div className="p-3 bg-amber-900/20 border border-amber-800 rounded-md">
              <p className="text-sm text-amber-300">
                This is a demo interface. Connection functionality is disabled.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              disabled
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Test Connection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}