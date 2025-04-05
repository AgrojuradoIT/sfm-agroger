import api from './api';

const fincaService = {
  // Obtener todas las evaluaciones de polinización por finca
  getEvaluacionesByFincaId: async (fincaId) => {
    try {
      // Obtenemos directamente las evaluaciones de polinización por finca
      const evaluacionesResponse = await api.get(`/fincas/${fincaId}/evaluaciones-polinizacion`);
      
      if (evaluacionesResponse.data.length === 0) {
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
        horaInicio: ev.hora.substring(0, 5),
        horaFin: ev.hora.substring(0, 5),
        semana: ev.semana,
        lote: ev.lote?.descripcion || 'N/A',
        seccion: ev.seccion,
        evaluador: ev.evaluador?.nombres || 'N/A',
        email: ev.evaluador?.correo || 'N/A',
        porcentaje: calcularPorcentaje(ev),
        eventos: {
          palmas: ev.palma || 0,
          eventos: ev.inflorescencia || 0
        }
      }));
      
      return { 
        evaluaciones: evaluacionesFormateadas, 
        usandoDatosEjemplo: false,
        finca: {
          id: fincaId,
          nombre: `Finca ${fincaId.toUpperCase()}`
        }
      };
    } catch (error) {
      console.error('Error obteniendo evaluaciones:', error);
      // Retornamos datos de ejemplo en caso de error
      return {
        evaluaciones: generarDatosEjemplo(),
        usandoDatosEjemplo: true,
        finca: {
          id: fincaId,
          nombre: `Finca ${fincaId.toUpperCase()}`
        }
      };
    }
  },
  
  // Obtener evaluaciones por evaluación general
  getEvaluacionesByEvaluacionGeneralId: async (evaluacionGeneralId) => {
    try {
      // Obtenemos las evaluaciones de polinización por evaluación general
      const evaluacionesResponse = await api.get(`/evaluaciones-generales/${evaluacionGeneralId}/evaluaciones-polinizacion`);
      
      // Transformamos los datos igual que en la función anterior
      const evaluacionesFormateadas = evaluacionesResponse.data.map(ev => ({
        id: ev.id,
        fecha: formatearFecha(ev.fecha),
        horaInicio: ev.hora.substring(0, 5),
        horaFin: ev.hora.substring(0, 5),
        semana: ev.semana,
        lote: ev.lote?.descripcion || 'N/A',
        seccion: ev.seccion,
        evaluador: ev.evaluador?.nombres || 'N/A',
        email: ev.evaluador?.correo || 'N/A',
        porcentaje: calcularPorcentaje(ev),
        eventos: {
          palmas: ev.palma || 0,
          eventos: ev.inflorescencia || 0
        }
      }));
      
      return { evaluaciones: evaluacionesFormateadas, usandoDatosEjemplo: false };
    } catch (error) {
      console.error('Error obteniendo evaluaciones por evaluación general:', error);
      return { evaluaciones: [], usandoDatosEjemplo: true };
    }
  }
};

// Formatear fecha de ISO a DD/MM/YYYY
const formatearFecha = (fechaIso) => {
  if (!fechaIso) return 'N/A';
  const fecha = new Date(fechaIso);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
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