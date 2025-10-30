import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building, Users, Truck, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { projectsAPI, workersAPI, vendorsAPI, inventoryAPI, formatCurrency } from '../services/api';

export default function Dashboard() {
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsAPI.getAll();
      return response.data;
    }
  });

  const { data: workers } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const response = await workersAPI.getAll();
      return response.data;
    }
  });

  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const response = await vendorsAPI.getAll();
      return response.data;
    }
  });

  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await inventoryAPI.getAll();
      return response.data;
    }
  });

  // Calculate stats
  const activeProjects = projects?.filter(p => p.status === 'In Progress')?.length || 0;
  const totalWorkers = workers?.length || 0;
  const totalVendors = vendors?.length || 0;
  const lowStockItems = inventory?.filter(item => item.quantity <= (item.min_stock || 5))?.length || 0;
  const totalBudget = projects?.reduce((sum, project) => sum + (project.budget || 0), 0) || 0;
  const totalInventoryValue = inventory?.reduce((sum, item) => sum + (item.quantity * (item.unit_price || 0)), 0) || 0;

  const recentProjects = projects?.slice(0, 5) || [];
  const lowInventoryItems = inventory?.filter(item => item.quantity <= (item.min_stock || 5))?.slice(0, 5) || [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Project Management Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your construction project management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeProjects}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Workers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalWorkers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendor Partners</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalVendors}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Truck className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{lowStockItems}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Project Budget</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalBudget)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Inventory Value</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalInventoryValue)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors text-center">
              <Building className="mx-auto mb-2" size={20} />
              <div className="text-sm font-medium">New Project</div>
            </button>
            <button className="p-4 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors text-center">
              <Users className="mx-auto mb-2" size={20} />
              <div className="text-sm font-medium">Add Worker</div>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors text-center">
              <Truck className="mx-auto mb-2" size={20} />
              <div className="text-sm font-medium">Add Vendor</div>
            </button>
            <button className="p-4 bg-orange-50 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors text-center">
              <Package className="mx-auto mb-2" size={20} />
              <div className="text-sm font-medium">Add Inventory</div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Projects & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
          </div>
          <div className="p-6">
            {recentProjects.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No projects yet</p>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-600">{project.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(project.budget || 0)}</p>
                      <p className="text-sm text-gray-600">{project.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
          </div>
          <div className="p-6">
            {lowInventoryItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">All items are well stocked</p>
            ) : (
              <div className="space-y-4">
                {lowInventoryItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">{item.quantity} left</p>
                      <p className="text-sm text-gray-600">Min: {item.min_stock || 5}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
