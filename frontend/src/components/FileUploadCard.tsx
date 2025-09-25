import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Loader as Loader2 } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface FileUploadCardProps {
  onUploadSuccess: () => void;
}

export function FileUploadCard({ onUploadSuccess }: FileUploadCardProps) {
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
        variant: "default",
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-indigo-600" />
          <span>Step 1: Upload Data</span>
        </CardTitle>
        <CardDescription>
          Upload your dataset to begin the model generation process. Supported formats: CSV, JSON, XML
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload" className="text-sm font-medium">
            Select Dataset File
          </Label>
          <Input
            id="file-upload"
            type="file"
            accept=".csv,.json,.xml"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
        </div>

        {selectedFile && (
          <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-md">
            <File className="h-4 w-4 text-slate-600" />
            <span className="text-sm text-slate-700 flex-1">{selectedFile.name}</span>
            <span className="text-xs text-slate-500">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </span>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800">File uploaded successfully!</span>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800">Upload failed. Please try again.</span>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full"
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
      </CardContent>
    </Card>
  );
}