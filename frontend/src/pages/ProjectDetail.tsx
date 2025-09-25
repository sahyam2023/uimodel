import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, User, Calendar, ArrowLeft, PlayCircle, BrainCircuit } from 'lucide-react';
import { Project } from '@/types';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { TrainingModal } from '@/components/TrainingModal';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trainingTime, setTrainingTime] = useState(10);
  const [isTraining, setIsTraining] = useState(false);
  const [finalAccuracy, setFinalAccuracy] = useState<number | null>(null);


  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await apiService.getProjectById(id);
        setProject(data);
      } catch (error) {
        toast.error('Failed to fetch project details.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center text-slate-400">
        <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
        <p>The project you are looking for does not exist.</p>
        <Button asChild variant="link" className="mt-4 text-indigo-400">
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  const handleTrainingComplete = (accuracy: number) => {
    setFinalAccuracy(accuracy);
    setIsTraining(false);
    toast.success(`Training complete! Final accuracy: ${accuracy}%`);
  };

  return (
    <>
      <div className="space-y-8">
        <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Projects
          </Link>
        </Button>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">{project.name}</CardTitle>
            <CardDescription className="text-slate-400 pt-1">
              {project.description || 'No description provided.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-6 pt-4 text-slate-400">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="font-medium">{project.owner}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">
                  Created on {new Date(project.createdAt * 1000).toLocaleDateString()}
                </span>
              </div>
          </CardContent>
        </Card>

        {/* Step 3: Train Model */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              <BrainCircuit className="mr-3 h-8 w-8 text-indigo-400" />
              Step 3: Train Model
            </CardTitle>
            <CardDescription className="text-slate-400 pt-2">
              Configure and start the model training process. Longer training times may result in higher accuracy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <label htmlFor="training-time" className="text-slate-300 font-medium">
                Training Time: <span className="text-indigo-400 font-bold">{trainingTime} minutes</span>
              </label>
              <Slider
                id="training-time"
                min={4}
                max={60}
                step={1}
                value={[trainingTime]}
                onValueChange={(value) => setTrainingTime(value[0])}
                className="[&>span:first-child]:h-1 [&>span:first-child]:bg-slate-700 [&>span:first-child>span]:bg-indigo-400"
              />
            </div>
            <Button
              onClick={() => setIsTraining(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Training
            </Button>
          </CardContent>
        </Card>

        {/* Step 4: Deploy & Predict */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Step 4: Deploy & Predict</CardTitle>
          </CardHeader>
          <CardContent>
            {finalAccuracy ? (
              <div className="text-center">
                <p className="text-slate-300 text-lg mb-2">Training Complete!</p>
                <p className="text-5xl font-bold text-green-400">{finalAccuracy}%</p>
                <p className="text-slate-400 mt-1">Final Model Accuracy</p>
              </div>
            ) : (
              <p className="text-slate-400">
                Complete the training step to see the final model accuracy and deployment options.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <TrainingModal
        isOpen={isTraining}
        onClose={() => setIsTraining(false)}
        projectId={id!}
        trainingTime={trainingTime}
        onTrainingComplete={handleTrainingComplete}
      />
    </>
  );
}