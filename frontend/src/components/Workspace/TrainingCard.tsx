import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Play, Loader2, Zap, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrainingCardProps {
  isFileUploaded: boolean;
  isTraining: boolean;
  onStartTraining: () => void;
  onStopTraining: () => void;
}

const stopMessages = [
  'Stopping all training processes...',
  'Disconnecting from compute nodes...',
  'Saving final model checkpoint...',
  'Releasing GPU resources...',
  'Cleaning up workspace...',
  'Finalizing stop sequence...',
];

export function TrainingCard({
  isFileUploaded,
  isTraining,
  onStartTraining,
  onStopTraining,
}: TrainingCardProps) {
  const [gpuUtilization, setGpuUtilization] = useState(0);
  const [isStopConfirmOpen, setIsStopConfirmOpen] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [stoppingProgress, setStoppingProgress] = useState(0);
  const [currentStopMessage, setCurrentStopMessage] = useState(stopMessages[0]);

  useEffect(() => {
    let utilizationInterval: NodeJS.Timeout;
    if (isTraining) {
      utilizationInterval = setInterval(() => {
        setGpuUtilization(Math.floor(Math.random() * (98 - 70 + 1)) + 70);
      }, 2000);
    } else {
      setGpuUtilization(0);
    }
    return () => clearInterval(utilizationInterval);
  }, [isTraining]);

  const handleStopClick = () => {
    setIsStopConfirmOpen(true);
  };

  const handleConfirmStop = () => {
    setIsStopping(true);
    let progress = 0;
    let messageIndex = 0;

    const stopInterval = setInterval(() => {
      progress += 10;
      setStoppingProgress(progress);

      if (progress % 20 === 0 && messageIndex < stopMessages.length - 1) {
        messageIndex++;
        setCurrentStopMessage(stopMessages[messageIndex]);
      }

      if (progress >= 100) {
        clearInterval(stopInterval);
        setTimeout(() => {
          setIsStopping(false);
          setIsStopConfirmOpen(false);
          onStopTraining();
          setStoppingProgress(0);
          setCurrentStopMessage(stopMessages[0]);
        }, 1000);
      }
    }, 300);
  };

  return (
    <>
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Zap className={cn("h-5 w-5 text-indigo-400", isTraining && "animate-pulse")} />
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
            {!isTraining ? (
              <Button
                onClick={onStartTraining}
                disabled={!isFileUploaded}
                className="w-full h-12 text-base bg-indigo-600 hover:bg-indigo-700"
                size="lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Model Training
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" className="w-full h-12 text-base" disabled>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Training Model...
                </Button>
                <Button
                  onClick={handleStopClick}
                  variant="destructive"
                  className="h-12"
                  size="lg"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Stop
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="p-3 bg-slate-800 rounded-lg">
              <p className="text-slate-400">GPU Utilization</p>
              <p className="text-white font-medium">{gpuUtilization}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isStopConfirmOpen} onOpenChange={setIsStopConfirmOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {isStopping ? 'Stopping Training...' : 'Are you sure?'}
            </DialogTitle>
            {!isStopping && (
              <DialogDescription>
                This will halt the current training process. Any unsaved progress may be lost.
              </DialogDescription>
            )}
          </DialogHeader>
          {isStopping ? (
            <div className="space-y-4 py-4">
              <Progress value={stoppingProgress} className="w-full [&>*]:bg-red-600" />
              <p className="text-center text-sm text-slate-400">{currentStopMessage}</p>
            </div>
          ) : (
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStopConfirmOpen(false)} className="border-slate-700 hover:bg-slate-800">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmStop}>
                Confirm Stop
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}