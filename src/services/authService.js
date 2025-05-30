import api from './api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Guardar la información del usuario y permisos en localStorage
        if (response.data.usuario) {
          localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        }
        if (response.data.permisos) {
          localStorage.setItem('permisos', JSON.stringify(response.data.permisos));
        }
        
        return response.data;
      }
      throw new Error('No se recibió un token válido');
    } catch (error) {
      console.error('Error en login:', error);
      // No redirigir en caso de error de login
      if (error.response) {
        // Error del servidor con respuesta
        throw error.response.data || { message: 'Error de autenticación' };
      } else if (error.request) {
        // Error sin respuesta del servidor
        throw { message: 'No se pudo conectar con el servidor' };
      } else {
        // Error de configuración o algo inesperado
        throw { message: error.message || 'Error inesperado' };
      }
    }
  },

  logout: async () => {
    try {
      // Intenta hacer logout en el servidor si la API lo soporta
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/logout');
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Siempre limpia el almacenamiento local
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('usuario');
      localStorage.removeItem('permisos');
      
      // Redireccionar a la ruta raíz
      window.location.href = '/';
    }
  },
  
  // Verifica si el usuario está autenticado
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
  
  // Obtiene información del usuario actual si está disponible
  getCurrentUser: async () => {
    try {
      // Primero intentamos obtener del localStorage para evitar llamadas innecesarias
      const usuarioLocal = localStorage.getItem('usuario');
      const permisosLocal = localStorage.getItem('permisos');
      
      if (usuarioLocal && permisosLocal) {
        return {
          usuario: JSON.parse(usuarioLocal),
          permisos: JSON.parse(permisosLocal)
        };
      }
      
      // Si no está en localStorage, consultamos la API
      const response = await api.get('/user');
      
      // Actualizamos el localStorage con la información más reciente
      if (response.data.usuario) {
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      }
      if (response.data.permisos) {
        localStorage.setItem('permisos', JSON.stringify(response.data.permisos));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }
};

export default authService; 