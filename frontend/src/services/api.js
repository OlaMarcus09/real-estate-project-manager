import axios from 'axios';

// Use environment variable for API URL, fallback to relative path for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for Render
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to backend server. Please check if the backend is running.');
    } else if (error.response?.status >= 500) {
      console.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (project) => api.post('/projects', project),
  update: (id, project) => api.put(`/projects/${id}`, project),
  delete: (id) => api.delete(`/projects/${id}`)
};

export const workersAPI = {
  getAll: () => api.get('/workers'),
  create: (worker) => api.post('/workers', worker),
  delete: (id) => api.delete(`/workers/${id}`)
};

export const vendorsAPI = {
  getAll: () => api.get('/vendors'),
  create: (vendor) => api.post('/vendors', vendor)
};
