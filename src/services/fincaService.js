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
  getHistorialOperario: async (operarioId) => {
    // Verificar si el ID es válido antes de llamar a la API
    if (!operarioId || isNaN(parseInt(operarioId))) {
      console.error('ID de operario inválido recibido en getHistorialOperario:', operarioId);
      // Devolver estructura estándar en caso de ID inválido
      return { 
        evaluaciones: [], 
        mensaje: 'ID de operario inválido proporcionado.', 
        usandoDatosEjemplo: true // Tratar como si la API fallara
      };
    }

    try {
      console.log(`Intentando obtener historial para ID: ${operarioId} usando /evaluaciones-generales/operario/`);
      // Modificación aquí: Usar operarioId (numérico) en la URL
      const response = await api.get(`/evaluaciones-generales/operario/${operarioId}`); 
      
      // Estandarizar la respuesta al formato objeto
      return {
        evaluaciones: response.data || [],
        mensaje: '',
        usandoDatosEjemplo: false 
      };

    } catch (error) {
      console.error(`Error obteniendo historial del operario con ID: ${operarioId}`, error);
      
      // --- El bloque CATCH para generar datos de ejemplo se mantiene igual que la última vez --- 
      const evaluacionesEjemplo = [];
      const fechasAleatorias = [];
      const hoy = new Date();
      for (let i = 0; i < 10; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() - Math.floor(Math.random() * 180));
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        fechasAleatorias.push(`${dia}/${mes}/${año}`);
      }
      fechasAleatorias.sort((a, b) => {
        const [diaA, mesA, añoA] = a.split('/').map(Number);
        const [diaB, mesB, añoB] = b.split('/').map(Number);
        if (añoA !== añoB) return añoB - añoA;
        if (mesA !== mesB) return mesB - mesA;
        return diaB - diaA;
      });

      for (let i = 0; i < 10; i++) {
        const evaluacionesPolinizacion = [];
        const numEvaluacionesPolinizacion = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numEvaluacionesPolinizacion; j++) {
          evaluacionesPolinizacion.push({
            id: `${i+1}-${j+1}`, fecha: fechasAleatorias[i], seccion: `S-${Math.floor(Math.random() * 5) + 1}`,
            palma: `P-${Math.floor(Math.random() * 100) + 1}`, inflorescencia: Math.floor(Math.random() * 10) + 1,
            antesis: Math.floor(Math.random() * 15), antesisDejadas: Math.floor(Math.random() * 15),
            postantesis: Math.floor(Math.random() * 20), postantesisDejadas: Math.floor(Math.random() * 10),
            espate: Math.floor(Math.random() * 30), aplicacion: Math.floor(Math.random() * 30),
            marcacion: Math.floor(Math.random() * 5), repaso1: Math.floor(Math.random() * 5),
            repaso2: Math.floor(Math.random() * 5)
          });
        }
        evaluacionesEjemplo.push({
          id: i + 1, fecha: fechasAleatorias[i], finca: `Finca ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
          lote: `Lote ${Math.floor(Math.random() * 10) + 1}`, seccion: `Sección ${Math.floor(Math.random() * 5) + 1}`,
          evaluador: `Evaluador ${Math.floor(Math.random() * 3) + 1}`, calificacion: Math.floor(Math.random() * 5) + 1,
          observaciones: `Observación de ejemplo #${i + 1}`, polinizador: `OperarioEjemplo (ID: ${operarioId})`, // Actualizar nombre de ejemplo si se desea
          evaluacionesPolinizacion: evaluacionesPolinizacion 
        });
      }
      
      // Estandarizar la respuesta de error
      return { 
        evaluaciones: evaluacionesEjemplo, 
        mensaje: 'Error al conectar con la API. Mostrando datos de ejemplo.',
        usandoDatosEjemplo: true 
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