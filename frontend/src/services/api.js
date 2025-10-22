import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
});

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (project) => api.post('/projects', project),
  update: (id, project) => api.put(`/projects/${id}`, project)
};

// Workers API
export const workersAPI = {
  getAll: () => api.get('/workers'),
  create: (worker) => api.post('/workers', worker),
  assignToProject: (projectId, workerData) => 
    api.post(`/projects/${projectId}/workers`, workerData)
};

// Vendors API
export const vendorsAPI = {
  getAll: () => api.get('/vendors'),
  create: (vendor) => api.post('/vendors', vendor)
};

// Expenses API
export const expensesAPI = {
  create: (expense) => api.post('/expenses', expense),
  getByProject: (projectId) => api.get(`/projects/${projectId}/expenses`)
};

// Inventory API
export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  create: (item) => api.post('/inventory', item)
};

// Dashboard API
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary')
};