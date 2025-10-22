import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, 
  Folder, 
  Users, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard() {
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/projects');
      return data;
    }
  });

  const { data: workers, isLoading: workersLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const { data } = await api.get('/workers');
      return data;
    }
  });

  const isLoading = projectsLoading || workersLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalBudget = projects?.reduce((sum, project) => sum + (project.budget || 0), 0) || 0;
  const activeProjects = projects?.filter(p => p.status === 'Active').length || 0;
  const totalWorkers = workers?.length || 0;
  
  // Calculate total monthly labor cost (estimate)
  const totalLaborCost = workers?.reduce((sum, worker) => {
    return sum + (worker.hourly_rate * 160); // 160 hours = 1 month
  }, 0) || 0;

  const stats = [
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      icon: Folder,
      color: 'blue',
      change: '+2 this month'
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: TrendingUp,
      color: 'green',
      change: `${Math.round((activeProjects / (projects?.length || 1)) * 100)}% active`
    },
    {
      title: 'Total Budget',
      value: `$${totalBudget.toLocaleString()}`,
      icon: DollarSign,
      color: 'purple',
      change: 'Across all projects'
    },
    {
      title: 'Team Members',
      value: totalWorkers,
      icon: Users,
      color: 'orange',
      change: `${totalWorkers} workers`
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
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Labor Cost Card */}
      {totalWorkers > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Labor Cost</h3>
              <p className="text-2xl font-bold text-green-600">${totalLaborCost.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Estimated based on hourly rates</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      )}

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
