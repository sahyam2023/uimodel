import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Loader as Loader2, Zap } from 'lucide-react';

interface TrainingCardProps {
  isFileUploaded: boolean;
  isTraining: boolean;
  onStartTraining: () => void;
}

export function TrainingCard({ isFileUploaded, isTraining, onStartTraining }: TrainingCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Zap className="h-5 w-5 text-indigo-400" />
          <span>Step 3: Train & Validate</span>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Execute model training with your configured parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isFileUploaded && (
          <div className="p-4 bg-amber-900/20 border border-amber-800 rounded-md">
            <p className="text-sm text-amber-300">
              Please upload a dataset file first to enable model training.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={onStartTraining}
            disabled={!isFileUploaded || isTraining}
            className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700"
            size="lg"
          >
            {isTraining ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Training Model...
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start Model Training
              </>
            )}
          </Button>

          {isTraining && (
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-400">
                Training in progress. This may take a few minutes...
              </p>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-slate-800 rounded-lg">
            <p className="text-slate-400">Estimated Time</p>
            <p className="text-white font-medium">3-5 minutes</p>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg">
            <p className="text-slate-400">GPU Utilization</p>
            <p className="text-white font-medium">{isTraining ? '85%' : '0%'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}