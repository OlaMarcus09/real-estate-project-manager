import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://real-estate-backend-v2.onrender.com';

console.log('🔗 API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL + '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Unknown error';
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: message
    });
    
    if (error.response?.status === 404) {
      throw new Error(`Endpoint not found: ${error.config?.url}. Check if backend is deployed correctly.`);
    }
    
    throw new Error(message);
  }
);

// Format currency for Nigerian Naira
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₦0';
  return `₦${parseFloat(amount).toLocaleString('en-NG')}`;
};

// SIMPLE API endpoints - just make them work
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
      const error = await res.text();
      throw new Error(error || 'Payment failed');
    }
    return res.json();
  });
};
