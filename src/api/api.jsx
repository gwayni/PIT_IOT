import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',  // Base URL without auth part
});

// Attach Authorization header with token on every request if available
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle 401 errors globally
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '#/login';
    }
    return Promise.reject(error);
  }
);

export default API;
