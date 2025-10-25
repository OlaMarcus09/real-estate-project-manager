import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Star, Phone, Mail, Building, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export default function Vendors() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    contact: '',
    rating: 5
  });

  const queryClient = useQueryClient();

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data } = await api.get('/vendors');
      return data;
    }
  });

  const createVendorMutation = useMutation({
    mutationFn: (newVendor) => api.post('/vendors', newVendor),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']);
      setIsFormOpen(false);
      setFormData({ name: '', category: '', contact: '', rating: 5 });
    }
  });

  const deleteVendorMutation = useMutation({
    mutationFn: (id) => api.delete(`/vendors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createVendorMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete vendor "${name}"?`)) {
      deleteVendorMutation.mutate(id);
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Materials': 'bg-blue-100 text-blue-800',
      'Equipment': 'bg-green-100 text-green-800',
      'Services': 'bg-purple-100 text-purple-800',
      'Labor': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.default;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600 mt-1">Manage your suppliers and service providers</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Add Vendor Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Vendor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter vendor name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="Materials">Materials</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Services">Services</option>
                  <option value="Labor">Labor</option>
                  <option value="Transportation">Transportation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Info</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email or phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex items-center space-x-2 mt-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={rating <= formData.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{formData.rating}/5</span>
                </div>
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
                  disabled={createVendorMutation.isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {createVendorMutation.isLoading ? 'Adding...' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first vendor</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Vendor
            </button>
          </div>
        ) : (
          vendors?.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{vendor.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(vendor.category)}`}>
                    {vendor.category || 'Uncategorized'}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(vendor.id, vendor.name)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating:</span>
                  <div className="flex items-center space-x-1">
                    {getRatingStars(vendor.rating)}
                  </div>
                </div>
                
                {vendor.contact && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    {vendor.contact.includes('@') ? (
                      <>
                        <Mail size={16} />
                        <span>{vendor.contact}</span>
                      </>
                    ) : (
                      <>
                        <Phone size={16} />
                        <span>{vendor.contact}</span>
                      </>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 pt-2 border-t">
                  Added: {new Date(vendor.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics Bar */}
      {vendors && vendors.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-gray-900">{vendors.length}</div>
            <div className="text-sm text-gray-600">Total Vendors</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-gray-900">
              {(vendors.reduce((acc, vendor) => acc + vendor.rating, 0) / vendors.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-gray-900">
              {new Set(vendors.map(v => v.category)).size}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-gray-900">
              {vendors.filter(v => v.rating >= 4).length}
            </div>
            <div className="text-sm text-gray-600">Top Rated (4+ stars)</div>
          </div>
        </div>
      )}
    </div>
  );
}
