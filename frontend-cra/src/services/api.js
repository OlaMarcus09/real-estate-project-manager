import axios from 'axios';

// Use the NEW backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL;

console.log('🔗 Connecting to backend:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL + '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🔄 API Call:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.config.url);
    return response;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'Unknown error';
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: message
    });
    
    // Provide user-friendly error messages
    let userMessage = message;
    if (error.response?.status === 404) {
      userMessage = `Endpoint not found: ${error.config?.url}. Please check backend deployment.`;
    } else if (error.code === 'NETWORK_ERROR') {
      userMessage = 'Network error. Please check your internet connection and backend URL.';
    }
    
    throw new Error(userMessage);
  }
);

// Format currency for Nigerian Naira
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₦0';
  return `₦${parseFloat(amount).toLocaleString('en-NG')}`;
};

// API endpoints - ALL POINTING TO NEW BACKEND
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

// Direct fetch for payments (more reliable)
export const recordWorkerPayment = (workerId, paymentData) => {
  return fetch(`${API_BASE_URL}/api/workers/${workerId}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  }).then(async (res) => {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Payment failed with status ${res.status}`);
    }
    return res.json();
  });
};
