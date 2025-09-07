// src/api/api.js
import axios from 'axios';

// ----------------------
// Axios instance
// ----------------------
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 50000, // 10 seconds
});

// ----------------------
// Request Interceptor
// ----------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    // Skip auth endpoints
    if (
      token &&
      !config.url.includes('/auth/login') &&
      !config.url.includes('/auth/register')
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------
// Response Interceptor
// ----------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid → clear storage and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ----------------------
// API Endpoints
// ----------------------

// Auth endpoints (skip token automatically)
export const authAPI = {
  login: (credentials) =>
    axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/login`,
      credentials,
      { headers: { 'Content-Type': 'application/json' } }
    ),

  register: (userData) =>
    axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/register`,
      userData,
      { headers: { 'Content-Type': 'application/json' } }
    ),
};

// Email endpoints
export const emailAPI = {
  // Rewrite JSON text
  rewriteEmail: ({ text, tone }) => api.post('/rewrite', { text, tone }),

  // Upload file (multipart)
  uploadFile: (file, tone) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tone', tone);
    return api.post('/rewrite/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
};

export default api;
