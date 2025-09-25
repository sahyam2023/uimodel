import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, User, Calendar, ArrowLeft } from 'lucide-react';
import { Project } from '@/types';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
        <Link to="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Projects
        </Link>
      </Button>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white">{project.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300 text-lg">{project.description || 'No description provided.'}</p>
          <div className="flex items-center space-x-6 pt-4 text-slate-400">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}