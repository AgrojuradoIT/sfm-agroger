import axios from 'axios';

// Define la URL base de tu API. Ajusta si es diferente.
const API_URL = '/api'; // Asume que tienes un proxy o usas una URL relativa

/**
 * Obtiene los detalles de un operario específico por su ID.
 * @param {number|string} id El ID del operario.
 * @returns {Promise<object>} La promesa con los datos del operario.
 */
const getOperarioById = async (id) => {
  try {
    console.log(`operarioService - Solicitando operario con ID: ${id}`);
    // Asegúrate de que la ruta coincida exactamente con tu definición en Laravel
    const response = await axios.get(`${API_URL}/operarios/${id}`);
    console.log(`operarioService - Respuesta recibida para ID ${id}:`, response.data);
    return response.data; // Devuelve directamente los datos del operario
  } catch (error) {
    console.error(`Error al obtener el operario con ID ${id}:`, error.response || error.message || error);
    // Lanza un error más específico si es posible
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido al obtener el operario.';
    throw new Error(errorMessage);
  }
};

const operarioService = {
  getOperarioById
};

export default operarioService; 