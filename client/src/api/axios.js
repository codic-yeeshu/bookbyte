import axios from 'axios';
import { CONFIG } from '../config';

const api = axios.create({
  baseURL: CONFIG.API_URL,
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // Potentially clear local storage or redirect to login
      // localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
