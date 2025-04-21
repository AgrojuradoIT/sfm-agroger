import api from './api';

const fincaService = {
  // Obtener todas las evaluaciones generales por finca
  getEvaluacionesByFincaId: async (fincaId) => {
    try {
      console.log(`Realizando petición a: /fincas/${fincaId}/evaluaciones-generales`);
      const evaluacionesResponse = await api.get(`/fincas/${fincaId}/evaluaciones-generales`);
      console.log('Respuesta API completa:', evaluacionesResponse);
      
      // Acceder directamente a los datos - según los logs, la API devuelve:
      // data: { evaluaciones: [...], evaluacionesPorFecha: {...}, evaluacionesPorOperario: {...} }
      const { data } = evaluacionesResponse;
      console.log('Datos recibidos de la API:', data);
      
      // Verificar qué propiedades contiene la respuesta
      console.log('Propiedades en la respuesta:', Object.keys(data));
      
      // Extraer directamente las evaluaciones, fechas y operarios de la respuesta
      const evaluaciones = data.evaluaciones || [];
      const evaluacionesPorFecha = data.evaluacionesPorFecha || {};
      const evaluacionesPorOperario = data.evaluacionesPorOperario || {};
      const mensaje = data.message || '';
      
      // Imprimir información detallada para depuración
      console.log(`Encontradas ${evaluaciones.length} evaluaciones`);
      console.log(`Fechas encontradas: ${Object.keys(evaluacionesPorFecha).length}`, Object.keys(evaluacionesPorFecha));
      console.log(`Operarios encontrados: ${Object.keys(evaluacionesPorOperario).length}`, Object.keys(evaluacionesPorOperario));
      
      return { 
        evaluaciones,
        evaluacionesPorFecha,
        evaluacionesPorOperario,
        mensaje,
        usandoDatosEjemplo: false,
        finca: {
          id: fincaId,
          nombre: `Finca ${fincaId.toUpperCase()}`
        }
      };
    } catch (error) {
      console.error('Error obteniendo evaluaciones:', error);
      
      // Si hay un error, devolvemos datos de ejemplo para mostrar la estructura de la UI
      const datosEjemplo = generarDatosEjemplo();
      
      // Agrupar por fecha para datos de ejemplo
      const evaluacionesPorFecha = datosEjemplo.reduce((acc, ev) => {
        if (!acc[ev.fecha]) {
          acc[ev.fecha] = [];
        }
        acc[ev.fecha].push(ev);
        return acc;
      }, {});
      
      // Agrupar por operario para datos de ejemplo
      const operariosEjemplo = ['Luis Pérez', 'María González', 'Carlos Rodríguez'];
      const evaluacionesPorOperario = {};
      operariosEjemplo.forEach(operario => {
        evaluacionesPorOperario[operario] = datosEjemplo.filter((_, idx) => idx % 3 === operariosEjemplo.indexOf(operario));
      });
      
      return {
        evaluaciones: datosEjemplo,
        evaluacionesPorFecha,
        evaluacionesPorOperario,
        mensaje: 'Error al conectar con la API. Mostrando datos de ejemplo.',
        usandoDatosEjemplo: true,
        finca: {
          id: fincaId,
          nombre: `Finca ${fincaId.toUpperCase()}`
        }
      };
    }
  },

  // Obtener evaluaciones por fecha
  getEvaluacionesByFecha: async (fecha) => {
    try {
      const evaluacionesResponse = await api.get(`/evaluaciones-generales/fecha?fecha=${fecha}`);
      return evaluacionesResponse.data || [];
    } catch (error) {
      console.error('Error obteniendo evaluaciones por fecha:', error);
      return [];
    }
  },

  // Obtener evaluaciones por operario
  getEvaluacionesByOperario: async (operarioId) => {
    try {
      const evaluacionesResponse = await api.get(`/evaluaciones-generales/operario/${operarioId}`);
      return evaluacionesResponse.data || [];
    } catch (error) {
      console.error('Error obteniendo evaluaciones por operario:', error);
      return [];
    }
  },

  // Obtener historial de evaluaciones de un operario
  getHistorialOperario: async (nombreOperario) => {
    try {
      const response = await api.get(`/evaluaciones-operario?nombre=${encodeURIComponent(nombreOperario)}`);
      return response.data || { evaluaciones: [], mensaje: '' };
    } catch (error) {
      console.error('Error obteniendo historial del operario:', error);
      
      // Generar datos de ejemplo para mostrar la interfaz
      const evaluacionesEjemplo = [];
      const fechasAleatorias = [];
      
      // Generar fechas aleatorias de los últimos 6 meses
      const hoy = new Date();
      for (let i = 0; i < 10; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() - Math.floor(Math.random() * 180)); // Últimos 6 meses
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        fechasAleatorias.push(`${dia}/${mes}/${año}`);
      }
      
      // Ordenar fechas de más reciente a más antigua
      fechasAleatorias.sort((a, b) => {
        const [diaA, mesA, añoA] = a.split('/').map(Number);
        const [diaB, mesB, añoB] = b.split('/').map(Number);
        
        if (añoA !== añoB) return añoB - añoA;
        if (mesA !== mesB) return mesB - mesA;
        return diaB - diaA;
      });
      
      // Generar evaluaciones de ejemplo
      for (let i = 0; i < 10; i++) {
        evaluacionesEjemplo.push({
          id: i + 1,
          fecha: fechasAleatorias[i],
          finca: `Finca ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`, // A, B, C o D
          lote: `Lote ${Math.floor(Math.random() * 10) + 1}`,
          seccion: `Sección ${Math.floor(Math.random() * 5) + 1}`,
          evaluador: `Evaluador ${Math.floor(Math.random() * 3) + 1}`,
          calificacion: Math.floor(Math.random() * 5) + 1, // Calificación 1-5
          observaciones: `Observación de ejemplo #${i + 1}`,
          polinizador: nombreOperario
        });
      }
      
      return { 
        evaluaciones: evaluacionesEjemplo, 
        mensaje: 'Error al conectar con la API. Mostrando datos de ejemplo.' 
      };
    }
  }
};

// Formatear fecha de ISO a DD/MM/YYYY
const formatearFecha = (fechaIso) => {
  if (!fechaIso) return 'N/A';
  try {
    console.log('Formateando fecha:', fechaIso);
    // Si ya tiene formato DD/MM/YYYY, devolverlo como está
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaIso)) {
      return fechaIso;
    }
    
    // Crear fecha a partir de string ISO
    const fecha = new Date(fechaIso);
    
    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
      console.warn('Fecha inválida:', fechaIso);
      return 'N/A';
    }
    
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    
    const fechaFormateada = `${dia}/${mes}/${año}`;
    console.log(`Fecha formateada: ${fechaIso} -> ${fechaFormateada}`);
    return fechaFormateada;
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'N/A';
  }
};

// Calcular porcentaje de efectividad (ejemplo)
const calcularPorcentaje = (evaluacion) => {
  // Aquí puedes implementar la lógica real para calcular el porcentaje
  // Por ahora usamos un valor aleatorio entre 60% y 100%
  const base = Math.floor(Math.random() * 41) + 60;
  return `${base}%`;
};

// Generar datos de ejemplo para fallback (solo se usa cuando hay error)
const generarDatosEjemplo = () => {
  console.log('Generando datos de ejemplo como fallback');
  const evaluaciones = [];
  const años = ['2023', '2024'];
  const meses = Array.from({length: 12}, (_, i) => i + 1);
  const evaluadores = ['Juan Pérez', 'María García', 'Carlos López'];
  const polinizadores = ['Luis Pérez', 'María González', 'Carlos Rodríguez'];
  
  // Fechas más recientes primero (últimos 30 días)
  const fechasRecientes = [];
  const hoy = new Date();
  
  for (let i = 0; i < 5; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i * 3); // Cada 3 días
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    fechasRecientes.push(`${dia}/${mes}/${año}`);
  }
  
  // Generar 15 evaluaciones de ejemplo, distribuidas en fechas recientes
  for (let i = 1; i <= 15; i++) {
    // Usar fechas recientes para que se vean en la UI
    const fechaIndex = Math.floor(Math.random() * fechasRecientes.length);
    const fecha = fechasRecientes[fechaIndex];
    const hora = `${Math.floor(Math.random() * 12 + 7).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
    const evaluador = evaluadores[Math.floor(Math.random() * evaluadores.length)];
    const polinizador = polinizadores[Math.floor(Math.random() * polinizadores.length)];
    
    // Datos más completos
    evaluaciones.push({
      id: i,
      fecha: fecha,
      hora: hora,
      semana: Math.floor(Math.random() * 52) + 1,
      lote: `Lote ${Math.floor(Math.random() * 10) + 1}`,
      seccion: `Sección ${Math.floor(Math.random() * 5) + 1}`,
      evaluador: evaluador,
      polinizador: polinizador,
      evaluacionesPolinizacion: generarEvaluacionesPolinizacion(i)
    });
  }
  
  // Ordenar por fecha reciente primero
  return evaluaciones.sort((a, b) => {
    const [diaA, mesA, añoA] = a.fecha.split('/').map(Number);
    const [diaB, mesB, añoB] = b.fecha.split('/').map(Number);
    
    if (añoA !== añoB) return añoB - añoA;
    if (mesA !== mesB) return mesB - mesA;
    return diaB - diaA;
  });
};

// Generar evaluaciones de polinización de ejemplo
const generarEvaluacionesPolinizacion = (idEvaluacion) => {
  const evaluaciones = [];
  const numEvaluaciones = Math.floor(Math.random() * 3) + 1; // 1-3 evaluaciones
  
  for (let i = 1; i <= numEvaluaciones; i++) {
    evaluaciones.push({
      id: `${idEvaluacion}-${i}`,
      seccion: `S-${Math.floor(Math.random() * 5) + 1}`,
      palma: `P-${Math.floor(Math.random() * 100) + 1}`,
      inflorescencia: `I-${Math.floor(Math.random() * 10) + 1}`,
      antesis: Math.random() > 0.5 ? 'Sí' : 'No',
      postantesis: Math.random() > 0.5 ? 'Completa' : 'Parcial'
    });
  }
  
  return evaluaciones;
};

export default fincaService; 