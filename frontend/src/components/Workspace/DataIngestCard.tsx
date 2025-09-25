import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, CircleCheck, CircleAlert, Loader2, Database } from 'lucide-react';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DataIngestCardProps {
  onUploadSuccess: (isSuccess: boolean) => void;
  isFileUploaded: boolean;
}

interface DataSource {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  color: string;
  isConnecting?: boolean;
  isExternalConnected?: boolean;
}

export function DataIngestCard({ onUploadSuccess, isFileUploaded }: DataIngestCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedDataSources = sessionStorage.getItem('dataSources');
    if (savedDataSources) {
      const parsed = JSON.parse(savedDataSources);
      setDataSources(
        parsed.map((ds: any) => ({
          ...ds,
          isConnecting: false,
          isExternalConnected: false,
        }))
      );
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const response = await apiService.uploadFile(selectedFile);
      setUploadStatus('success');
      toast.success("Upload Successful", { description: response.message });
      onUploadSuccess(true);
    } catch (error) {
      setUploadStatus('error');
      toast.error("Upload Failed", { description: "Failed to upload file. Please try again." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleExternalDataClick = (sourceId: string) => {
    const source = dataSources.find(ds => ds.id === sourceId);
    if (!source) return;

    if (source.status !== 'connected') {
      toast.warning("Please connect to the data source first", {
        description: "You can connect to your data sources in the Data Sources page.",
      });
      return;
    }

    setDataSources(prev =>
      prev.map(ds =>
        ds.id === sourceId ? { ...ds, isConnecting: true } : ds
      )
    );

    setTimeout(() => {
      setDataSources(prev =>
        prev.map(ds =>
          ds.id === sourceId
            ? { ...ds, isConnecting: false, isExternalConnected: true }
            : ds
        )
      );
      toast.success(`Connected to ${source.name}`, {
        description: "Your data can now be uploaded to this external source.",
      });
    }, 2500);
  };

  const showSuccessMessage = uploadStatus === 'success' || (isFileUploaded && !selectedFile);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Upload className="h-5 w-5 text-indigo-400" />
          <span>Step 1: Data Ingest</span>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Upload your dataset or connect to external data sources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">
              Upload Dataset File
            </Label>
            <div className="flex items-center border border-slate-700 rounded-md bg-slate-900 pr-3">
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300 text-sm font-medium h-10 px-4 py-2 flex items-center rounded-l-md border-r border-slate-700"
                >
                  Choose file
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.json,.xml"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <span className="text-sm text-slate-400 truncate ml-3">
                  {selectedFile ? selectedFile.name : 'No file selected'}
                </span>
            </div>
          </div>

          {selectedFile && !showSuccessMessage && (
            <div className="flex items-center space-x-2 p-3 bg-slate-800 rounded-md border border-slate-700">
              <File className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-300 flex-1">{selectedFile.name}</span>
              <span className="text-xs text-slate-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}

          {showSuccessMessage && (
            <div className="flex items-center space-x-2 p-3 bg-green-900/20 border border-green-800 rounded-md">
              <CircleCheck className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300">File uploaded successfully!</span>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-800 rounded-md">
              <CircleAlert className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-300">Upload failed. Please try again.</span>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || showSuccessMessage}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isUploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="mr-2 h-4 w-4" /> Upload File</>
            )}
          </Button>
        </div>

        {/* Data Source Connections */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-300">
            Upload to external data sources (optional)
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {dataSources.map(source => (
              <Button
                key={source.id}
                variant="outline"
                className={cn(
                  "flex flex-col items-center justify-center p-4 h-auto bg-slate-800 border-slate-700 hover:bg-slate-700 transition-all",
                  source.isExternalConnected && "bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                )}
                onClick={() => handleExternalDataClick(source.id)}
                disabled={source.isConnecting || source.isExternalConnected}
              >
                {source.isConnecting ? (
                  <Loader2 className="h-6 w-6 text-slate-400 animate-spin mb-2" />
                ) : source.isExternalConnected ? (
                  <CircleCheck className="h-6 w-6 text-green-400 mb-2" />
                ) : (
                  <Database className={cn("h-6 w-6 mb-2", source.color)} />
                )}
                <span className={cn("text-xs text-slate-300", source.isExternalConnected && "text-green-300")}>
                  {source.isConnecting ? 'Connecting...' : source.isExternalConnected ? 'Connected' : source.name}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}