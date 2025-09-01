import axios from 'axios';

// Create a centralized Axios instance for the entire application
const api = axios.create({
  // This URL correctly points to your Spring Boot backend.
  // It also allows for a production URL to be set via environment variables.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Request will time out after 10 seconds
});

// Axios Request Interceptor:
// This function automatically attaches the JWT to the Authorization header
// for every single request that is sent from the frontend.
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

// Axios Response Interceptor:
// This function handles global API errors. If a 401 Unauthorized error
// occurs (e.g., token is expired or invalid), it automatically logs the
// user out and redirects them to the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Organized API endpoints for different parts of the application
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const emailAPI = {
  rewriteEmail: (data) => api.post('/rewrite', data),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
};

export default api;

