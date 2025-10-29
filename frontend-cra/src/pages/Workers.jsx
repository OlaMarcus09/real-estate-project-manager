import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, User, DollarSign, Clock, Briefcase, Trash2, CreditCard, History } from 'lucide-react';
import { workersAPI, formatCurrency } from '../services/api';
import PaymentModal from '../components/PaymentModal';

export default function Workers() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    hourly_rate: '',
    contact: ''
  });

  const queryClient = useQueryClient();

  const { data: workers, isLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const response = await workersAPI.getAll();
      return response.data;
    }
  });

  const createWorkerMutation = useMutation({
    mutationFn: (newWorker) => workersAPI.create(newWorker),
    onSuccess: () => {
      queryClient.invalidateQueries(['workers']);
      setIsFormOpen(false);
      setFormData({ name: '', role: '', hourly_rate: '', contact: '' });
    }
  });

  const deleteWorkerMutation = useMutation({
    mutationFn: (id) => workersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['workers']);
    }
  });

  const recordPaymentMutation = useMutation({
    mutationFn: ({ workerId, paymentData }) => 
      fetch(`${process.env.REACT_APP_API_URL}/api/workers/${workerId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['workers']);
      setIsPaymentModalOpen(false);
      setSelectedWorker(null);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createWorkerMutation.mutate({
      ...formData,
      hourly_rate: parseFloat(formData.hourly_rate)
    });
  };

  const handlePaymentSubmit = (paymentData) => {
    if (!selectedWorker) return;
    recordPaymentMutation.mutate({
      workerId: selectedWorker.id,
      paymentData
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      deleteWorkerMutation.mutate(id);
    }
  };

  const openPaymentModal = (worker) => {
    setSelectedWorker(worker);
    setIsPaymentModalOpen(true);
  };

  const calculateMonthlyCost = (worker) => {
    return worker.hourly_rate * 8 * 22;
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
          <h1 className="text-2xl font-bold text-gray-900">Workers</h1>
          <p className="text-gray-600">Manage your team, track payments and labor costs</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Worker</span>
        </button>
      </div>

      {/* Add Worker Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Worker</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
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
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hourly Rate (₦)</label>
                <input
                  type="number"
                  step="0.01"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Info</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Phone or email"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createWorkerMutation.isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {createWorkerMutation.isLoading ? 'Adding...' : 'Add Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handlePaymentSubmit}
        type="worker"
        item={selectedWorker}
      />

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No workers</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first worker.</p>
          </div>
        ) : (
          workers?.map((worker) => (
            <div key={worker.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                    <p className="text-sm text-gray-600">{worker.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(worker.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign size={16} />
                    <span>Hourly Rate</span>
                  </div>
                  <span className="font-medium">{formatCurrency(worker.hourly_rate)}/hr</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <CreditCard size={16} />
                    <span>Total Paid</span>
                  </div>
                  <span className="font-medium text-green-600">
                    {formatCurrency(worker.total_paid || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock size={16} />
                    <span>Monthly Cost</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(calculateMonthlyCost(worker))}
                  </span>
                </div>

                {worker.last_payment_date && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <History size={16} />
                      <span>Last Payment</span>
                    </div>
                    <span className="font-medium text-gray-600">
                      {new Date(worker.last_payment_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {worker.contact && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-1">Contact:</p>
                  <p className="text-sm text-gray-600">{worker.contact}</p>
                </div>
              )}

              <div className="mt-6 flex space-x-2">
                <button
                  onClick={() => openPaymentModal(worker)}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-green-700 flex items-center justify-center space-x-1"
                >
                  <CreditCard size={16} />
                  <span>Record Payment</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
