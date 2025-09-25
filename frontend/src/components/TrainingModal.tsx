import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiService } from '@/services/api';
import { Terminal } from 'lucide-react';

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  trainingTime: number;
  onTrainingComplete: (accuracy: number) => void;
}

interface AccuracyData {
  time: number;
  accuracy: number;
}

export function TrainingModal({ isOpen, onClose, projectId, trainingTime, onTrainingComplete }: TrainingModalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [accuracyData, setAccuracyData] = useState<AccuracyData[]>([]);
  const [progress, setProgress] = useState(0);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setLogs([]);
      setAccuracyData([]);
      setProgress(0);

      const eventSource = apiService.trainModel(projectId, trainingTime);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.log) {
          setLogs((prev) => [...prev, data.log]);
        }

        if (data.accuracy) {
          const newPoint = { time: accuracyData.length, accuracy: parseFloat(data.accuracy) };
          setAccuracyData((prev) => [...prev, newPoint]);
          setProgress(parseFloat(data.accuracy));
        }

        if (data.final_accuracy) {
          onTrainingComplete(parseFloat(data.final_accuracy));
          eventSource.close();
          onClose();
        }
      };

      eventSource.onerror = () => {
        // Handle error, maybe show a toast
        eventSource.close();
        onClose();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [isOpen, projectId, trainingTime, onTrainingComplete, onClose]);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] bg-slate-900 border-slate-800 text-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Model Training in Progress</DialogTitle>
        </DialogHeader>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden p-4">
          {/* Left side: Logs */}
          <div className="flex flex-col bg-black rounded-lg p-4 h-full">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Terminal className="mr-2 h-5 w-5" />
              Training Logs
            </h3>
            <div ref={logsContainerRef} className="flex-grow overflow-y-auto text-sm font-mono text-slate-300 space-y-1">
              {logs.map((log, index) => (
                <p key={index} className="whitespace-pre-wrap">{`[${new Date().toLocaleTimeString()}] ${log}`}</p>
              ))}
            </div>
          </div>

          {/* Right side: Graph and Progress */}
          <div className="flex flex-col h-full space-y-4">
            <div className="flex-grow bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-white">Training Accuracy</h3>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Line type="monotone" dataKey="accuracy" stroke="#818cf8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">Overall Progress</h3>
                <Progress value={progress} className="w-full [&>div]:bg-indigo-400" />
                <p className="text-center text-slate-400 mt-2">{progress.toFixed(2)}% Complete</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-slate-700 text-slate-300 hover:bg-slate-800">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}