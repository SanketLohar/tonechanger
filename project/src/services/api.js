import axios from 'axios';

// Create a centralized Axios instance for the entire application
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Request will time out after 10 seconds
});

// Axios Request Interceptor
// Attach JWT token automatically for protected routes (not auth/login/register)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    // Skip attaching token for auth endpoints
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

// Axios Response Interceptor
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

// Auth endpoints → explicitly avoid token
export const authAPI = {
  login: async (credentials) => {
    // Always clear old token before trying login
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/login`,
      credentials,
      { headers: { 'Content-Type': 'application/json' } }
    );
  },

  register: (userData) => {
    return axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/register`,
      userData,
      { headers: { 'Content-Type': 'application/json' } }
    );
  },
};

// Protected endpoints → go through api (JWT auto-attached)
export const emailAPI = {
  rewriteEmail: (data) => api.post('/rewrite', data),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
};

export default api;
