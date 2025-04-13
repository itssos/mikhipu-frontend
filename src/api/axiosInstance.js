import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Agrega el token JWT a cada solicitud, si existe
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;