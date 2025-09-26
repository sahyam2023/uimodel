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
          <Label className="text-sm font-medium" htmlFor="file-upload">
            Select Dataset File
          </Label>

          {/* Custom file input container with proper alignment */}
          <div className="relative w-full">
            <div className="flex items-center justify-between w-full px-4 py-3 border rounded-lg bg-slate-800 border-slate-700 min-h-[48px]">
              
              {/* Custom styled button that triggers file input */}
              <Label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-md cursor-pointer hover:bg-slate-600 transition-colors shrink-0"
              >
                <File className="w-4 h-4 mr-2" />
                Choose File
              </Label>

              {/* File name display with proper spacing */}
              <div className="flex-1 px-3 min-w-0">
                <span className="text-sm text-slate-400 truncate block">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
              </div>

              {/* Hidden actual file input */}
              <input
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
                accept=".csv,.json,.xml"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {selectedFile && (
            <div className="text-xs text-slate-500 pl-1 pt-1">
              File size: {(selectedFile.size / 1024).toFixed(1)} KB
            </div>
          )}
        </div>

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
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
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