import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, 
  Folder, 
  Users, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await dashboardAPI.getSummary();
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

  const stats = [
    {
      title: 'Total Projects',
      value: summary?.totalProjects || 0,
      icon: Folder,
      color: 'blue'
    },
    {
      title: 'Active Projects',
      value: summary?.activeProjects || 0,
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Total Budget',
      value: `$${(summary?.totalBudget || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Total Workers',
      value: summary?.totalWorkers || 0,
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

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {summary?.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-600">{activity.action}</span>
              <span className="text-gray-400">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}