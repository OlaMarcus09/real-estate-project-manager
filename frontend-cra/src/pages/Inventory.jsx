import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, AlertTriangle, DollarSign, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { inventoryAPI, formatCurrency } from '../services/api';

export default function Inventory() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit_price: '',
    min_stock: ''
  });

  const queryClient = useQueryClient();

  const { data: inventory, isLoading, error } = useQuery({
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

  const updateInventoryMutation = useMutation({
    mutationFn: ({ id, ...item }) => inventoryAPI.update(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory']);
      setEditingItem(null);
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
    if (editingItem) {
      updateInventoryMutation.mutate({
        id: editingItem.id,
        ...formData,
        quantity: parseInt(formData.quantity),
        unit_price: parseFloat(formData.unit_price),
        min_stock: parseInt(formData.min_stock)
      });
    } else {
      createInventoryMutation.mutate({
        ...formData,
        quantity: parseInt(formData.quantity),
        unit_price: parseFloat(formData.unit_price),
        min_stock: parseInt(formData.min_stock)
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit_price: item.unit_price,
      min_stock: item.min_stock
    });
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setIsFormOpen(false);
    setFormData({ name: '', category: '', quantity: '', unit_price: '', min_stock: '' });
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
          <p className="text-gray-600">Manage materials, equipment, and supplies</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Add/Edit Inventory Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </h2>
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
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={createInventoryMutation.isLoading || updateInventoryMutation.isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>
                    {createInventoryMutation.isLoading || updateInventoryMutation.isLoading 
                      ? 'Saving...' 
                      : (editingItem ? 'Update Item' : 'Add Item')
                    }
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-orange-600">{outOfStockItems}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Inventory Items</h2>
        </div>
        
        {error ? (
          <div className="p-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Inventory API Not Available</h3>
            <p className="text-gray-500">The inventory backend endpoint is not yet implemented.</p>
          </div>
        ) : !inventory || inventory.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items</h3>
            <p className="text-gray-500">Get started by adding your first inventory item using the "Add Item" button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(item.unit_price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(item.quantity * item.unit_price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.min_stock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.quantity === 0 
                          ? 'bg-red-100 text-red-800'
                          : item.quantity <= (item.min_stock || 5)
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.quantity === 0 ? 'Out of Stock' : 
                         item.quantity <= (item.min_stock || 5) ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
