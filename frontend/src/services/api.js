import axios from 'axios';

// This will use the environment variable set in .env files
const API_BASE_URL = import.meta.env.VITE_API_URL;

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add interceptors for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  create: (project) => api.post('/projects', project),
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
