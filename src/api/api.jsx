import axios from 'axios';

const API = axios.create({
  baseURL: 'https://pit-iot.onrender.com/api',  
  withCredentials: true,  // Important for session/cookie-based auth if needed
  timeout: 10000,  // 10 second timeout
});

// Request interceptor for auth token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';
  config.headers['Accept'] = 'application/json';
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor
API.interceptors.response.use(
  response => {
    // Handle successful responses
    if (response.data?.auth_token) {
      localStorage.setItem('token', response.data.auth_token);
    }
    return response;
  },
  error => {
    // Handle errors globally
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          window.location.href = '/forbidden';
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          window.location.href = '/server-error';
          break;
        default:
          console.error('Unhandled error:', error.response.status);
      }
      
      // Format Djoser error messages
      if (error.response.data) {
        const djoserErrors = [];
        for (const [key, value] of Object.entries(error.response.data)) {
          if (Array.isArray(value)) {
            djoserErrors.push(`${key}: ${value.join(', ')}`);
          } else {
            djoserErrors.push(value);
          }
        }
        error.formattedMessage = djoserErrors.join('\n');
      }
    }
    return Promise.reject(error);
  }
);

// Helper functions for auth endpoints
export const authAPI = {
  register: (userData) => API.post('/auth/users/', userData),
  login: (credentials) => API.post('/auth/token/login/', credentials),
  logout: () => API.post('/auth/token/logout/'),
  getUser: () => API.get('/auth/users/me/'),
};

export default API;