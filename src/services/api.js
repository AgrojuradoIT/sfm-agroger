import axios from 'axios';

// URL de la API según los logs
const API_URL = 'https://apis.agrojurado.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Agregar un timeout por defecto
  timeout: 10000
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url} (authenticated)`);
    } else {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url} (no auth token)`);
      console.warn('No se encontró token de autenticación. La solicitud podría ser rechazada.');
    }
    return config;
  },
  (error) => {
    console.error('Error en la solicitud API:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    
    // Log para debug - datos recibidos
    if (response.config.url?.includes('evaluaciones-generales')) {
      console.log('Datos recibidos de la API:', response.data);
      
      // Revisar si la estructura es la esperada
      if (response.data.evaluaciones) {
        console.log(`La API devolvió ${response.data.evaluaciones.length} evaluaciones`);
      } 
      
      if (response.data.evaluacionesPorFecha) {
        console.log(`La API devolvió ${Object.keys(response.data.evaluacionesPorFecha).length} fechas diferentes`);
      }
      
      if (response.data.evaluacionesPorOperario) {
        console.log(`La API devolvió ${Object.keys(response.data.evaluacionesPorOperario).length} operarios diferentes`);
      }
    }
    
    return response;
  },
  (error) => {
    // No redirigir en caso de login fallido
    const isLoginRequest = error.config?.url?.includes('/login');
    
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401 && !isLoginRequest) {
      // Solo redirigir si no es una petición de login
      console.warn('Sesión expirada o no autenticada. Redirigiendo al login...');
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api; 