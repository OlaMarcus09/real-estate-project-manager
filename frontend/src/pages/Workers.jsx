import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, User, DollarSign, Clock, Briefcase, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export default function Workers() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    hourly_rate: '',
    contact: ''
  });
  const [assignData, setAssignData] = useState({
    project_id: '',
    hours_worked: ''
  });

  const queryClient = useQueryClient();

  const { data: workers, isLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const { data } = await api.get('/workers');
      return data;
    }
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/projects');
      return data;
    }
  });

  const createWorkerMutation = useMutation({
    mutationFn: (newWorker) => api.post('/workers', newWorker),
    onSuccess: () => {
      queryClient.invalidateQueries(['workers']);
      setIsFormOpen(false);
      setFormData({ name: '', role: '', hourly_rate: '', contact: '' });
    }
  });

  const assignWorkerMutation = useMutation({
    mutationFn: ({ workerId, ...data }) => 
      api.post(`/workers/${workerId}/assign`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['workers']);
      setIsAssignFormOpen(false);
      setAssignData({ project_id: '', hours_worked: '' });
      setSelectedWorker(null);
    }
  });

  const deleteWorkerMutation = useMutation({
    mutationFn: (id) => api.delete(`/workers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['workers']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createWorkerMutation.mutate({
      ...formData,
      hourly_rate: parseFloat(formData.hourly_rate)
    });
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedWorker) return;
    
    assignWorkerMutation.mutate({
      workerId: selectedWorker.id,
      project_id: parseInt(assignData.project_id),
      hours_worked: parseFloat(assignData.hours_worked) || 0
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAssignChange = (e) => {
    setAssignData({
      ...assignData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      deleteWorkerMutation.mutate(id);
    }
  };

  const openAssignForm = (worker) => {
    setSelectedWorker(worker);
    setIsAssignFormOpen(true);
  };

  const calculateLaborCost = (worker) => {
    // In a real app, we'd calculate based on actual hours worked
    // For now, we'll estimate based on hourly rate
    return worker.hourly_rate * 160; // 160 hours = 1 month
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
          <p className="text-gray-600">Manage your team and labor costs</p>
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
                <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
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

      {/* Assign Worker Modal */}
      {isAssignFormOpen && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Assign {selectedWorker.name} to Project
            </h2>
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project</label>
                <select
                  name="project_id"
                  value={assignData.project_id}
                  onChange={handleAssignChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a project</option>
                  {projects?.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hours Worked (optional)
                </label>
                <input
                  type="number"
                  step="0.5"
                  name="hours_worked"
                  value={assignData.hours_worked}
                  onChange={handleAssignChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  Hourly Rate: <strong>${selectedWorker.hourly_rate}/hour</strong>
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAssignFormOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignWorkerMutation.isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {assignWorkerMutation.isLoading ? 'Assigning...' : 'Assign to Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <span className="font-medium">${worker.hourly_rate}/hr</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Briefcase size={16} />
                    <span>Projects</span>
                  </div>
                  <span className="font-medium">
                    {worker.assigned_project_ids?.length || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock size={16} />
                    <span>Monthly Cost</span>
                  </div>
                  <span className="font-medium text-green-600">
                    ${calculateLaborCost(worker).toLocaleString()}
                  </span>
                </div>
              </div>

              {worker.assigned_project_names?.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Assigned to:</p>
                  <div className="space-y-1">
                    {worker.assigned_project_names.map((projectName, index) => (
                      <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {projectName}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex space-x-2">
                <button
                  onClick={() => openAssignForm(worker)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Assign to Project
                </button>
                {worker.contact && (
                  <a
                    href={`tel:${worker.contact}`}
                    className="bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-200"
                  >
                    Contact
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
