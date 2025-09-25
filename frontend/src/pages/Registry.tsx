import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archive, Download, HardDrive, Calendar, Loader2 } from 'lucide-react';
import { Model } from '@/types';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

export function Registry() {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getModels();
        setModels(data);
      } catch (error) {
        toast.error('Failed to fetch models.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModels();
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Model Registry</h2>
        <p className="text-slate-400">
          Browse and manage the machine learning models available in your organization.
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
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {models.map((model) => (
                <div
                  key={model.fileName}
                  className="flex items-center justify-between p-4 bg-slate-800 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-white">{model.fileName}</h3>
                      <Badge variant="outline" className="border-indigo-500 text-indigo-400">
                        Model File
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <HardDrive className="h-3 w-3" />
                        <span>{formatBytes(model.fileSize)}</span>
                      </div>
                       <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created: {new Date(model.createdAt * 1000).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <a href={apiService.getDownloadUrl(model.fileName)} download>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}