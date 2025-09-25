import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, MoveHorizontal as MoreHorizontal, Calendar, User } from 'lucide-react';
import { Project } from '@/types';

const projects: Project[] = [
  {
    id: '1',
    name: 'Smart Traffic Management',
    status: 'Active',
    owner: 'John Doe',
    created: '2024-01-15',
    accuracy: 94.2,
  },
  {
    id: '2',
    name: 'Waste Collection Optimization',
    status: 'Completed',
    owner: 'Jane Smith',
    created: '2024-01-10',
    accuracy: 87.8,
  },
  {
    id: '3',
    name: 'Energy Consumption Forecasting',
    status: 'Active',
    owner: 'Mike Johnson',
    created: '2024-01-08',
    accuracy: 91.5,
  },
  {
    id: '4',
    name: 'Public Safety Analytics',
    status: 'Draft',
    owner: 'Sarah Wilson',
    created: '2024-01-05',
  },
  {
    id: '5',
    name: 'Water Quality Monitoring',
    status: 'Active',
    owner: 'David Brown',
    created: '2024-01-03',
    accuracy: 96.1,
  },
];

export function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-600 hover:bg-green-700';
      case 'Completed':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'Draft':
        return 'bg-gray-600 hover:bg-gray-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Project Management</h2>
          <p className="text-slate-400">
            Manage and organize your machine learning projects
          </p>
        </div>
        <Button 
          onClick={() => navigate('/workspace')}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-800 border-slate-700 text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Projects ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-white hover:text-indigo-400 transition-colors">
                      {project.name}
                    </h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    {project.accuracy && (
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {project.accuracy}% accuracy
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{project.owner}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(project.created).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle menu actions
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}