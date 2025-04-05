import axios from 'axios';

// Ajusta esta URL según la ubicación real de tu API Laravel
const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar el token a las peticiones
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

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No redirigir en caso de login fallido
    const isLoginRequest = error.config?.url?.includes('/login');
    
    if (error.response?.status === 401 && !isLoginRequest) {
      // Solo redirigir si no es una petición de login
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api; 