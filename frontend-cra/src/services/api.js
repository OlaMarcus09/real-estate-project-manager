import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL + '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to log all API calls
api.interceptors.request.use(
  (config) => {
    console.log('🔄 API Call:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.error || error.message
    });
    
    if (error.response?.status === 404) {
      console.error('🔍 Endpoint not found. Please check your backend routes.');
    } else if (error.response?.status === 500) {
      console.error('⚡ Server error. Please check your backend logs.');
    }
    
    return Promise.reject(error);
  }
);

// Format currency for Nigerian Naira
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₦0';
  return `₦${parseFloat(amount).toLocaleString('en-NG')}`;
};

// API endpoints
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  create: (project) => api.post('/projects', project),
  update: (id, project) => api.put(`/projects/${id}`, project),
  delete: (id) => api.delete(`/projects/${id}`)
};

export const workersAPI = {
  getAll: () => api.get('/workers'),
  create: (worker) => api.post('/workers', worker),
  update: (id, worker) => api.put(`/workers/${id}`, worker),
  delete: (id) => api.delete(`/workers/${id}`)
};

export const vendorsAPI = {
  getAll: () => api.get('/vendors'),
  create: (vendor) => api.post('/vendors', vendor),
  update: (id, vendor) => api.put(`/vendors/${id}`, vendor),
  delete: (id) => api.delete(`/vendors/${id}`)
};

export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  create: (item) => api.post('/inventory', item),
  update: (id, item) => api.put(`/inventory/${id}`, item),
  delete: (id) => api.delete(`/inventory/${id}`)
};

export const analyticsAPI = {
  get: () => api.get('/analytics')
};
