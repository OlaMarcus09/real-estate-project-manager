import axios from 'axios';

// Use environment variable for API URL, fallback to relative path for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// Add better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      alert('Cannot connect to server. Please check if the backend is running.');
    }
    return Promise.reject(error);
  }
);
