import api from './api';

const fincaService = {
  // Obtener todas las evaluaciones generales por finca
  getEvaluacionesByFincaId: async (fincaId) => {
    try {
      const evaluacionesResponse = await api.get(`/fincas/${fincaId}/evaluaciones-generales`);
      
      if (!evaluacionesResponse.data || evaluacionesResponse.data.length === 0) {
        return { 
          evaluaciones: [], 
          usandoDatosEjemplo: false,
          finca: {
            id: fincaId,
            nombre: `Finca ${fincaId.toUpperCase()}`
          }
        };
      }
      
      // Transformamos los datos para adaptarlos al formato esperado por la UI
      const evaluacionesFormateadas = evaluacionesResponse.data.map(ev => ({
        id: ev.id,
        fecha: formatearFecha(ev.fecha),
        hora: ev.hora?.substring(0, 5) || 'N/A',
        semana: ev.semana || 'N/A',
        evaluador: ev.evaluador?.nombre || 'N/A',
        polinizador: ev.polinizador?.nombre || 'N/A',
        evaluacionesPolinizacion: ev.evaluacionesPolinizacion || []
      }));
      
      // Agrupar por fecha
      const evaluacionesPorFecha = evaluacionesFormateadas.reduce((acc, ev) => {
        if (!acc[ev.fecha]) {
          acc[ev.fecha] = [];
        }
        acc[ev.fecha].push(ev);
        return acc;
      }, {});
      
      // Agrupar por operario
      const evaluacionesPorOperario = evaluacionesFormateadas.reduce((acc, ev) => {
        if (!acc[ev.polinizador]) {
          acc[ev.polinizador] = [];
        }
        acc[ev.polinizador].push(ev);
        return acc;
      }, {});
      
      return { 
        evaluaciones: evaluacionesFormateadas,
        evaluacionesPorFecha,
        evaluacionesPorOperario,
        usandoDatosEjemplo: false,
        finca: {
          id: fincaId,
          nombre: `Finca ${fincaId.toUpperCase()}`
        }
      };
    } catch (error) {
      console.error('Error obteniendo evaluaciones:', error);
      return {
        evaluaciones: [],
        evaluacionesPorFecha: {},
        evaluacionesPorOperario: {},
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
  }
};

// Formatear fecha de ISO a DD/MM/YYYY
const formatearFecha = (fechaIso) => {
  if (!fechaIso) return 'N/A';
  try {
    const fecha = new Date(fechaIso);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
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

// Generar datos de ejemplo para fallback
const generarDatosEjemplo = () => {
  const evaluaciones = [];
  const años = ['2023', '2024'];
  const evaluadores = ['Juan Pérez', 'María García', 'Carlos López'];
  
  // Generar 15 evaluaciones de ejemplo
  for (let i = 1; i <= 15; i++) {
    const año = años[Math.floor(Math.random() * años.length)];
    const mes = Math.floor(Math.random() * 12) + 1;
    const dia = Math.floor(Math.random() * 28) + 1;
    const evaluador = evaluadores[Math.floor(Math.random() * evaluadores.length)];
    
    evaluaciones.push({
      id: i,
      fecha: `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${año}`,
      horaInicio: `0${Math.floor(Math.random() * 9) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      horaFin: `1${Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      semana: Math.floor(Math.random() * 52) + 1,
      lote: `L-${Math.floor(Math.random() * 10) + 1}`,
      seccion: `S-${Math.floor(Math.random() * 5) + 1}`,
      evaluador: evaluador,
      email: `${evaluador.toLowerCase().replace(' ', '.')}@example.com`,
      porcentaje: `${Math.floor(Math.random() * 41) + 60}%`,
      eventos: {
        palmas: Math.floor(Math.random() * 50) + 10,
        eventos: Math.floor(Math.random() * 30) + 5
      }
    });
  }
  
  // Ordenamos por fecha descendente
  return evaluaciones.sort((a, b) => {
    const [diaA, mesA, añoA] = a.fecha.split('/').map(Number);
    const [diaB, mesB, añoB] = b.fecha.split('/').map(Number);
    
    if (añoA !== añoB) return añoB - añoA;
    if (mesA !== mesB) return mesB - mesA;
    return diaB - diaA;
  });
};

export default fincaService; 