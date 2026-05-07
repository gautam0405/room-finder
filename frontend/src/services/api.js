import axios from 'axios';
import { getToken } from '../utils/session';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 🔐 Attach token
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// 🚨 Global error handling (VERY USEFUL)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized → please login again');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;