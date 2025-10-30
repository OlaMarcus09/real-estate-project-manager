import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Folder, Users, Truck, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { projectsAPI, workersAPI, vendorsAPI, formatCurrency } from '../services/api';

export default function Dashboard() {
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsAPI.getAll();
      return response.data;
    }
  });

  const { data: workers, isLoading: workersLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const response = await workersAPI.getAll();
      return response.data;
    }
  });

  const { data: vendors, isLoading: vendorsLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const response = await vendorsAPI.getAll();
      return response.data;
    }
  });

  const isLoading = projectsLoading || workersLoading || vendorsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate stats from individual API calls
  const totalProjects = projects?.length || 0;
  const totalWorkers = workers?.length || 0;
  const totalVendors = vendors?.length || 0;
  const totalBudget = projects?.reduce((sum, project) => sum + (parseFloat(project.budget) || 0), 0) || 0;
  const totalSpent = projects?.reduce((sum, project) => sum + (parseFloat(project.spent) || 0), 0) || 0;
  const activeProjects = projects?.filter(p => p.status === 'Active')?.length || 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Overview</h1>
      <p className="text-gray-600 mb-6">Real Estate Management Dashboard • Currency: Nigerian Naira (₦)</p>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
              <p className="text-sm text-green-600">{activeProjects} active</p>
            </div>
            <Folder className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Workers</p>
              <p className="text-2xl font-bold text-gray-900">{totalWorkers}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
            </div>
            <Truck className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalBudget)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Spent: {formatCurrency(totalSpent)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
        </div>
        <div className="p-4">
          {!projects || projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No projects yet. Create your first project!
            </div>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600">
                      Budget: {formatCurrency(project.budget)} • {project.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {project.progress_percent || 0}%
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress_percent || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💰 Budget Management</h3>
          <p className="text-sm text-blue-700">
            Track project budgets and expenses in Nigerian Naira.
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">👥 Team Overview</h3>
          <p className="text-sm text-green-700">
            Manage workers, vendors, and project assignments.
          </p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="font-semibold text-orange-900 mb-2">📦 Inventory</h3>
          <p className="text-sm text-orange-700">
            Track materials and equipment across all projects.
          </p>
        </div>
      </div>
    </div>
  );
}
