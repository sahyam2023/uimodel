import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Loader as Loader2, Database } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface DataIngestCardProps {
  onUploadSuccess: () => void;
}

export function DataIngestCard({ onUploadSuccess }: DataIngestCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

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
      toast({
        title: "Upload Successful",
        description: response.message,
      });
      onUploadSuccess();
    } catch (error) {
      setUploadStatus('error');
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
            <Label htmlFor="file-upload" className="text-sm font-medium text-slate-300">
              Upload Dataset File
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.json,.xml"
              onChange={handleFileSelect}
              className="cursor-pointer bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {selectedFile && (
            <div className="flex items-center space-x-2 p-3 bg-slate-800 rounded-md border border-slate-700">
              <File className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-300 flex-1">{selectedFile.name}</span>
              <span className="text-xs text-slate-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="flex items-center space-x-2 p-3 bg-green-900/20 border border-green-800 rounded-md">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300">File uploaded successfully!</span>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-800 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-300">Upload failed. Please try again.</span>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </div>

        {/* Data Source Connections */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-300">
            Or Upload to external data sources
          </Label>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto bg-slate-800 border-slate-700 hover:bg-slate-700">
              <Database className="h-6 w-6 text-blue-400 mb-2" />
              <span className="text-xs text-slate-300">PostgreSQL</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto bg-slate-800 border-slate-700 hover:bg-slate-700">
              <Database className="h-6 w-6 text-orange-400 mb-2" />
              <span className="text-xs text-slate-300">S3 Bucket</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto bg-slate-800 border-slate-700 hover:bg-slate-700">
              <Database className="h-6 w-6 text-cyan-400 mb-2" />
              <span className="text-xs text-slate-300">Snowflake</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}