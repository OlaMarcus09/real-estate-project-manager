import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, 
  Folder, 
  Users, 
  TrendingUp,
  Clock,
  Building,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { api } from '../services/api';

// Simple chart components
const ProgressBar = ({ value, max = 100, color = 'blue', label }) => (
  <div className="mb-3">
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-700">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full bg-${color}-500`}
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  </div>
);

const DonutChart = ({ data, colors }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="relative w-32 h-32">
      <svg width="100%" height="100%" viewBox="0 0 42 42">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const largeArcFlag = percentage > 50 ? 1 : 0;
          
          const x1 = 21 + 16 * Math.cos((currentAngle * Math.PI) / 180);
          const y1 = 21 + 16 * Math.sin((currentAngle * Math.PI) / 180);
          const x2 = 21 + 16 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
          const y2 = 21 + 16 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
          
          const path = `M 21 21 L ${x1} ${y1} A 16 16 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
          
          currentAngle += angle;
          
          return (
            <path
              key={index}
              d={path}
              fill={colors[index % colors.length]}
              stroke="#fff"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/dashboard');
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

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

  const isLoading = analyticsLoading || projectsLoading || workersLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalBudget = analytics?.projects?.totalBudget || 0;
  const totalSpent = analytics?.projects?.totalSpent || 0;
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const activeProjects = analytics?.projects?.byStatus?.Active || 0;
  const planningProjects = analytics?.projects?.byStatus?.Planning || 0;
  const completedProjects = analytics?.projects?.byStatus?.Completed || 0;
  
  // Calculate labor metrics
  const totalLaborCost = workers?.reduce((sum, worker) => {
    return sum + (worker.hourly_rate * 160); // 160 hours = 1 month
  }, 0) || 0;

  const averageHourlyRate = workers?.length > 0 
    ? workers.reduce((sum, worker) => sum + worker.hourly_rate, 0) / workers.length 
    : 0;

  const projectStatusData = [
    { label: 'Active', value: activeProjects, color: '#10B981' },
    { label: 'Planning', value: planningProjects, color: '#3B82F6' },
    { label: 'Completed', value: completedProjects, color: '#6B7280' },
    { label: 'On Hold', value: analytics?.projects?.byStatus?.['On Hold'] || 0, color: '#F59E0B' },
  ].filter(item => item.value > 0);

  const stats = [
    {
      title: 'Total Projects',
      value: analytics?.projects?.total || 0,
      icon: Folder,
      color: 'blue',
      change: `${activeProjects} active`,
      trend: 'up'
    },
    {
      title: 'Team Members',
      value: analytics?.workers?.total || 0,
      icon: Users,
      color: 'green',
      change: `${Object.keys(analytics?.workers?.byRole || {}).length} roles`,
      trend: 'up'
    },
    {
      title: 'Total Budget',
      value: `$${(totalBudget / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'purple',
      change: `$${totalSpent.toLocaleString()} spent`,
      trend: 'neutral'
    },
    {
      title: 'Vendors',
      value: analytics?.vendors?.total || 0,
      icon: Building,
      color: 'orange',
      change: `${analytics?.vendors?.averageRating?.toFixed(1) || 0} avg rating`,
      trend: 'up'
    },
  ];

  const budgetStats = [
    {
      label: 'Total Budget',
      value: `$${totalBudget.toLocaleString()}`,
      subtext: 'Allocated funds'
    },
    {
      label: 'Amount Spent',
      value: `$${totalSpent.toLocaleString()}`,
      subtext: 'Utilized funds'
    },
    {
      label: 'Remaining',
      value: `$${(totalBudget - totalSpent).toLocaleString()}`,
      subtext: 'Available funds'
    },
    {
      label: 'Utilization',
      value: `${budgetUtilization.toFixed(1)}%`,
      subtext: 'Budget used'
    }
  ];

  const recentActivities = analytics?.recentActivities || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Real-time overview of your projects and resources</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center">
                  {stat.trend === 'up' && <ArrowUp size={14} className="text-green-500 mr-1" />}
                  {stat.trend === 'down' && <ArrowDown size={14} className="text-red-500 mr-1" />}
                  <span className="text-xs text-gray-500">{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h2>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {projectStatusData.map((status, index) => (
                <ProgressBar
                  key={index}
                  value={status.value}
                  max={analytics?.projects?.total}
                  color={status.color.replace('#', '')}
                  label={status.label}
                />
              ))}
            </div>
            <div className="ml-6">
              <DonutChart 
                data={projectStatusData} 
                colors={projectStatusData.map(s => s.color)}
              />
            </div>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h2>
          <div className="space-y-4">
            {budgetStats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xs text-gray-500">{stat.subtext}</p>
                </div>
                <div className={`text-lg font-bold ${
                  stat.label === 'Remaining' ? 'text-green-600' : 
                  stat.label === 'Utilization' && budgetUtilization > 80 ? 'text-red-600' : 
                  'text-gray-900'
                }`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
          
          {totalLaborCost > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Monthly Labor Cost</p>
                  <p className="text-2xl font-bold text-blue-600">${totalLaborCost.toLocaleString()}</p>
                  <p className="text-xs text-blue-700">Avg: ${averageHourlyRate.toFixed(2)}/hour</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'project' ? 'bg-blue-100' :
                    activity.type === 'worker' ? 'bg-green-100' :
                    'bg-orange-100'
                  }`}>
                    {activity.type === 'project' && <Folder size={16} className="text-blue-600" />}
                    {activity.type === 'worker' && <Users size={16} className="text-green-600" />}
                    {activity.type === 'vendor' && <Building size={16} className="text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-3 text-gray-400" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{activeProjects}</div>
                <div className="text-sm text-green-800">Active Projects</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics?.vendors?.averageRating?.toFixed(1) || '0.0'}
                </div>
                <div className="text-sm text-blue-800">Vendor Rating</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {Object.keys(analytics?.workers?.byRole || {}).length}
                  </div>
                  <div className="text-sm text-gray-600">Different Roles</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {Object.keys(analytics?.vendors?.byCategory || {}).length}
                  </div>
                  <div className="text-sm text-gray-600">Vendor Categories</div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {budgetUtilization > 80 && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <AlertTriangle size={20} className="text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">High Budget Utilization</p>
                    <p className="text-xs text-yellow-700">{budgetUtilization.toFixed(1)}% of total budget spent</p>
                  </div>
                </div>
              </div>
            )}

            {activeProjects === 0 && projects?.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">No Active Projects</p>
                    <p className="text-xs text-blue-700">Consider activating some projects</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
