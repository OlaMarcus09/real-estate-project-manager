import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, 
  Folder, 
  Users, 
  TrendingUp 
} from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/projects');
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalBudget = projects?.reduce((sum, project) => sum + (project.budget || 0), 0) || 0;
  const activeProjects = projects?.filter(p => p.status === 'Active').length || 0;

  const stats = [
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      icon: Folder,
      color: 'blue'
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Total Budget',
      value: `$${totalBudget.toLocaleString()}`,
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Team Members',
      value: '0', // We'll update this later
      icon: Users,
      color: 'orange'
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
        <div className="space-y-3">
          {projects?.slice(0, 5).map((project) => (
            <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-600">{project.status} • ${project.budget?.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{project.progress_percent}%</div>
                <div className="text-xs text-gray-500">Progress</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
