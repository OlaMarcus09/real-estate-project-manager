import axios from 'axios';

// Create React App uses REACT_APP_ prefix for environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL;

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL + '/api',  // ADD /api HERE
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
    if (error.response?.status === 404) {
      console.error('Backend endpoint not found. Please check your API URL.');
    }
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
