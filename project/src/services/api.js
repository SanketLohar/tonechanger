import axios from 'axios';

// Create axios instance with environment-based URL
const api = axios.create({
  // ✅ FIX: Changed the default port from 3001 to 8080 to match your backend server.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user'); // Also remove user on auth error
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
};

export const emailAPI = {
  rewriteEmail: (data) => api.post('/email/rewrite', data),
  uploadFile: (formData) => api.post('/email/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getHistory: () => api.get('/email/history'),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
};

export default api;

