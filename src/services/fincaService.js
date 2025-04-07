import api from './api';

const fincaService = {
  // Obtener todas las evaluaciones generales por finca
  getEvaluacionesByFincaId: async (fincaId) => {
    try {
      console.log(`Realizando petición a: /fincas/${fincaId}/evaluaciones-generales`);
      const evaluacionesResponse = await api.get(`/fincas/${fincaId}/evaluaciones-generales`);
      console.log('Respuesta API:', evaluacionesResponse);
      
      // Extraer datos de la respuesta según la estructura real que vemos en los logs
      // La API devuelve { message, finca_id, total_evaluaciones, data }
      const { message, data, total_evaluaciones } = evaluacionesResponse.data;
      
      // Verificar si hay evaluaciones
      if (data && data.length > 0) {
        // Transformar los datos a un formato estándar si es necesario
        const evaluaciones = data.map(ev => ({
          id: ev.id || `ev-${Math.random().toString(36).substring(2, 9)}`,
          fecha: ev.fecha ? formatearFecha(ev.fecha) : 'N/A',
          hora: ev.hora?.substring(0, 5) || 'N/A',
          semana: ev.semana || 'N/A',
          evaluador: ev.evaluador?.nombre || 'N/A',
          polinizador: ev.polinizador?.nombre || 'N/A',
          lote: ev.lote?.descripcion || 'N/A',
          evaluacionesPolinizacion: ev.evaluacionesPolinizacion || []
        }));
        
        // Agrupar por fecha
        const evaluacionesPorFecha = evaluaciones.reduce((acc, ev) => {
          if (!acc[ev.fecha]) {
            acc[ev.fecha] = [];
          }
          acc[ev.fecha].push(ev);
          return acc;
        }, {});
        
        // Agrupar por operario
        const evaluacionesPorOperario = evaluaciones.reduce((acc, ev) => {
          if (ev.polinizador && ev.polinizador !== 'N/A') {
            if (!acc[ev.polinizador]) {
              acc[ev.polinizador] = [];
            }
            acc[ev.polinizador].push(ev);
          }
          return acc;
        }, {});
        
        console.log('Evaluaciones procesadas:', evaluaciones.length);
        console.log('Fechas procesadas:', Object.keys(evaluacionesPorFecha).length);
        console.log('Operarios procesados:', Object.keys(evaluacionesPorOperario).length);
        
        return { 
          evaluaciones,
          evaluacionesPorFecha,
          evaluacionesPorOperario,
          mensaje: message,
          usandoDatosEjemplo: false,
          finca: {
            id: fincaId,
            nombre: `Finca ${fincaId.toUpperCase()}`
          }
        };
      } else {
        console.log('No se encontraron evaluaciones');
        return {
          evaluaciones: [],
          evaluacionesPorFecha: {},
          evaluacionesPorOperario: {},
          mensaje: message || 'No se encontraron evaluaciones',
          usandoDatosEjemplo: false,
          finca: {
            id: fincaId,
            nombre: `Finca ${fincaId.toUpperCase()}`
          }
        };
      }
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