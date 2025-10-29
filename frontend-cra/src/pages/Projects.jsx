import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Calendar, DollarSign, Save, X } from 'lucide-react';
import { projectsAPI, formatCurrency } from '../services/api';

export default function Projects() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    start_date: '',
    status: 'Planning'
  });

  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsAPI.getAll();
      return response.data;
    }
  });

  const createProjectMutation = useMutation({
    mutationFn: (newProject) => projectsAPI.create(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      setIsFormOpen(false);
      setFormData({ name: '', budget: '', start_date: '', status: 'Planning' });
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, ...project }) => projectsAPI.update(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      setEditingProject(null);
      setIsFormOpen(false);
      setFormData({ name: '', budget: '', start_date: '', status: 'Planning' });
    },
    onError: (error) => {
      console.error('Update error:', error);
      alert('Error updating project: ' + error.message);
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id) => projectsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form:', formData);
    
    if (editingProject) {
      console.log('Updating project:', editingProject.id);
      updateProjectMutation.mutate({
        id: editingProject.id,
        ...formData,
        budget: parseFloat(formData.budget)
      });
    } else {
      console.log('Creating new project');
      createProjectMutation.mutate({
        ...formData,
        budget: parseFloat(formData.budget)
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (project) => {
    console.log('Editing project:', project);
    setEditingProject(project);
    setFormData({
      name: project.name || '',
      budget: project.budget || '',
      start_date: project.start_date || '',
      status: project.status || 'Planning'
    });
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setIsFormOpen(false);
    setFormData({ name: '', budget: '', start_date: '', status: 'Planning' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      {/* Create/Edit Project Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
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
                <label className="block text-sm font-medium text-gray-700">Budget (₦)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
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
                  disabled={createProjectMutation.isLoading || updateProjectMutation.isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>
                    {createProjectMutation.isLoading || updateProjectMutation.isLoading 
                      ? 'Saving...' 
                      : (editingProject ? 'Update Project' : 'Create Project')
                    }
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {projects?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No projects yet. Create your first project!</p>
          </div>
        ) : (
          <div className="divide-y">
            {projects?.map((project) => (
              <div key={project.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <DollarSign size={16} />
                        <span>{formatCurrency(project.budget)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{project.start_date || 'No start date'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(project)}
                        className="p-2 text-gray-400 hover:text-blue-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                {project.progress_percent > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.progress_percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress_percent}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
