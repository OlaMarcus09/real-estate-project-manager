import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, AlertTriangle, DollarSign, Plus, Trash2 } from 'lucide-react';
import { inventoryAPI, formatCurrency } from '../services/api';

export default function Inventory() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit_price: '',
    min_stock: ''
  });

  const queryClient = useQueryClient();

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await inventoryAPI.getAll();
      return response.data;
    }
  });

  const createInventoryMutation = useMutation({
    mutationFn: (newItem) => inventoryAPI.create(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory']);
      setIsFormOpen(false);
      setFormData({ name: '', category: '', quantity: '', unit_price: '', min_stock: '' });
    }
  });

  const deleteInventoryMutation = useMutation({
    mutationFn: (id) => inventoryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createInventoryMutation.mutate({
      ...formData,
      quantity: parseInt(formData.quantity),
      unit_price: parseFloat(formData.unit_price),
      min_stock: parseInt(formData.min_stock)
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      deleteInventoryMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate inventory stats
  const totalItems = inventory?.length || 0;
  const lowStockItems = inventory?.filter(item => item.quantity <= (item.min_stock || 5))?.length || 0;
  const totalValue = inventory?.reduce((sum, item) => sum + (item.quantity * (item.unit_price || 0)), 0) || 0;
  const outOfStockItems = inventory?.filter(item => item.quantity === 0)?.length || 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track materials, equipment, and supplies</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center space-x-3">
            <Package className="text-blue-600" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-red-600" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-900">{lowStockItems}</div>
              <div className="text-sm text-gray-600">Low Stock</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center space-x-3">
            <DollarSign className="text-green-600" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center space-x-3">
            <Package className="text-gray-600" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-900">{outOfStockItems}</div>
              <div className="text-sm text-gray-600">Out of Stock</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Inventory Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Materials, Tools"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Price (₦)</label>
                <input
                  type="number"
                  step="0.01"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Stock Level</label>
                <input
                  type="number"
                  name="min_stock"
                  value={formData.min_stock}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="5"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createInventoryMutation.isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {createInventoryMutation.isLoading ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventory?.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <Package size={48} className="mx-auto mb-4 text-gray-400" />
                  <div className="text-lg font-medium mb-2">No inventory items yet</div>
                  <p className="mb-4">Get started by adding your first inventory item</p>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Item
                  </button>
                </td>
              </tr>
            ) : (
              inventory?.map((item) => {
                const totalValue = item.quantity * (item.unit_price || 0);
                const isLowStock = item.quantity <= (item.min_stock || 5);
                const isOutOfStock = item.quantity === 0;
                
                let status = 'In Stock';
                let statusColor = 'text-green-600 bg-green-100';
                
                if (isOutOfStock) {
                  status = 'Out of Stock';
                  statusColor = 'text-red-600 bg-red-100';
                } else if (isLowStock) {
                  status = 'Low Stock';
                  statusColor = 'text-orange-600 bg-orange-100';
                }

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{item.quantity}</div>
                      {item.min_stock && (
                        <div className="text-xs text-gray-500">Min: {item.min_stock}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatCurrency(item.unit_price || 0)}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{formatCurrency(totalValue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1"
                        disabled={deleteInventoryMutation.isLoading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
