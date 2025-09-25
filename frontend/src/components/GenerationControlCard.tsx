import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Loader as Loader2 } from 'lucide-react';

interface GenerationControlCardProps {
  isFileUploaded: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function GenerationControlCard({ isFileUploaded, isGenerating, onGenerate }: GenerationControlCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-5 w-5 text-indigo-600" />
          <span>Step 3: Generate Your Model</span>
        </CardTitle>
        <CardDescription>
          Execute the model generation process with your configured parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isFileUploaded && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                Please upload a dataset file first to enable model generation.
              </p>
            </div>
          )}
          
          <Button
            onClick={onGenerate}
            disabled={!isFileUploaded || isGenerating}
            className="w-full h-12 text-base"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Model...
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Generate Model
              </>
            )}
          </Button>
          
          {isGenerating && (
            <div className="text-center text-sm text-slate-600">
              <p>This process may take a few moments. Please wait...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}