import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Folder, Users, Truck, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { analyticsAPI, formatCurrency } from '../services/api';

export default function Dashboard() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await analyticsAPI.get();
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Error loading analytics</h3>
        <p className="text-gray-500">Please check your backend connection</p>
      </div>
    );
  }

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
              <p className="text-2xl font-bold text-gray-900">{analytics?.projects || 0}</p>
            </div>
            <Folder className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Workers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.workers || 0}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.vendors || 0}</p>
            </div>
            <Truck className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics?.total_budget)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Spent: {formatCurrency(analytics?.total_spent)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            Track materials and equipment across projects.
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Projects Created</p>
              <p className="text-sm text-gray-600">Total: {analytics?.projects || 0} projects</p>
            </div>
            <Folder className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Team Members</p>
              <p className="text-sm text-gray-600">Total: {analytics?.workers || 0} workers</p>
            </div>
            <Users className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Vendor Partners</p>
              <p className="text-sm text-gray-600">Total: {analytics?.vendors || 0} vendors</p>
            </div>
            <Truck className="h-5 w-5 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
