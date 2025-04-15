/**
 * Calcula las métricas de polinización basadas en las evaluaciones
 * @param {Array} evaluaciones - Array de evaluaciones de polinización
 * @returns {Object} Objeto con todas las métricas calculadas
 */
export const calcularMetricasPolinizacion = (evaluaciones) => {
  if (!evaluaciones || !Array.isArray(evaluaciones)) {
    return {
      sumaEventos: 0,
      sumaAntesis: 0,
      sumaPostAntesis: 0,
      sumaAntesisDejadas: 0,
      sumaPostAntesisDejadas: 0,
      sumaInflorescencia: 0,
      sumaAplicacion: 0,
      sumaMarcacion: 0,
      sumaEspate: 0,
      sumaRepaso1: 0,
      sumaRepaso2: 0,
      porcentajeAntesisDejadas: 0,
      porcentajePostAntesisDejadas: 0,
      porcentajeEspate: 0,
      porcentajeAplicacion: 0,
      porcentajeMarcacion: 0,
      porcentajeRepaso1: 0,
      porcentajeRepaso2: 0,
      proporcionalidadAntesis: 0,
      proporcionalidadPostAntesis: 0,
      total: 0
    };
  }

  // 1. Suma de eventos (evaluaciones)
  const sumaEventos = evaluaciones.length;

  // 2-5. Sumas individuales
  const sumaAntesis = evaluaciones.reduce((sum, ev) => sum + (ev.antesis || 0), 0);
  const sumaPostAntesis = evaluaciones.reduce((sum, ev) => sum + (ev.postantesis || 0), 0);
  const sumaAntesisDejadas = evaluaciones.reduce((sum, ev) => sum + (ev.antesisDejadas || 0), 0);
  const sumaPostAntesisDejadas = evaluaciones.reduce((sum, ev) => sum + (ev.postantesisDejadas || 0), 0);

  // 6. Suma de inflorescencia
  const sumaInflorescencia = sumaAntesis + sumaPostAntesis + sumaAntesisDejadas + sumaPostAntesisDejadas;

  // 7-11. Sumas de actividades
  const sumaAplicacion = evaluaciones.reduce((sum, ev) => sum + (ev.aplicacion || 0), 0);
  const sumaMarcacion = evaluaciones.reduce((sum, ev) => sum + (ev.marcacion || 0), 0);
  const sumaEspate = evaluaciones.reduce((sum, ev) => sum + (ev.espate || 0), 0);
  const sumaRepaso1 = evaluaciones.reduce((sum, ev) => sum + (ev.repaso1 || 0), 0);
  const sumaRepaso2 = evaluaciones.reduce((sum, ev) => sum + (ev.repaso2 || 0), 0);
  
  // Función para verificar si un valor no está vacío, nulo o undefined
  // Los ceros sí cuentan como valores válidos
  const esValorValido = (valor) => {
    if (valor === null || valor === undefined) return false;
    if (valor === '' || valor === ' ') return false;
    // El valor 0 es considerado válido
    if (valor === 0 || valor === '0') return true;
    return true;
  };

  // Cuenta la cantidad de datos que hay en la columna Repaso 1 (los nulos o blancos no se cuentan)
  // Los ceros sí cuentan como eventos válidos
  const EventosRepaso1 = evaluaciones.reduce((count, ev) => {
    // Si el valor es 0 o existe y no es nulo/undefined/vacío, lo contamos
    return (ev.repaso1 === 0 || esValorValido(ev.repaso1)) ? count + 1 : count;
  }, 0);
  
  // Cuenta la cantidad de datos que hay en la columna Repaso 2 (los nulos o blancos no se cuentan)
  // Los ceros sí cuentan como eventos válidos
  const EventosRepaso2 = evaluaciones.reduce((count, ev) => {
    // Si el valor es 0 o existe y no es nulo/undefined/vacío, lo contamos
    return (ev.repaso2 === 0 || esValorValido(ev.repaso2)) ? count + 1 : count;
  }, 0);
  
  // Registrar en consola para depuración
  console.log(`Total de eventos con Repaso 1 válido (incluyendo ceros): ${EventosRepaso1}`);
  console.log(`Total de eventos con Repaso 2 válido (incluyendo ceros): ${EventosRepaso2}`);
  console.log(`Total de evaluaciones: ${evaluaciones.length}`);
  console.log(`Suma Repaso 1: ${sumaRepaso1}`);
  console.log(`Suma Repaso 2: ${sumaRepaso2}`);
  
  // Depuración detallada de los valores de repaso1 y repaso2
  evaluaciones.forEach((ev, index) => {
    console.log(`Evaluación ${index}: repaso1=${ev.repaso1} (${typeof ev.repaso1}), repaso2=${ev.repaso2} (${typeof ev.repaso2})`);
  });

  // 12-13. Porcentajes de antesis y post-antesis dejadas
  const porcentajeAntesisDejadas = sumaInflorescencia > 0 
    ? (15 / sumaInflorescencia) * (sumaInflorescencia - sumaAntesisDejadas)
    : 0;

  const porcentajePostAntesisDejadas = sumaInflorescencia > 0
    ? (10 / sumaInflorescencia) * (sumaInflorescencia - sumaPostAntesisDejadas)
    : 0;

  // 14-18. Porcentajes de actividades
  const porcentajeEspate = sumaEventos > 0
    ? (30 / sumaEventos) * (sumaEventos - sumaEspate)
    : 0;

  const porcentajeAplicacion = sumaEventos > 0
    ? (30 / sumaEventos) * (sumaEventos - sumaAplicacion)
    : 0;

  const porcentajeMarcacion = sumaEventos > 0
    ? (5 / sumaEventos) * (sumaEventos - sumaMarcacion)
    : 0;

  // Cálculo de porcentajeRepaso1 con depuración
  console.log(`Valores para cálculo de porcentajeRepaso1: EventosRepaso1=${EventosRepaso1}, sumaRepaso1=${sumaRepaso1}`);
  
  // Verificamos si todos los eventos tienen valor 1 (o equivalente)
  const todosCompletosRepaso1 = EventosRepaso1 === sumaRepaso1;
  console.log(`¿Todos los eventos de Repaso1 están completos? ${todosCompletosRepaso1}`);
  
  // Si todos los eventos están completos, asignamos 5 puntos (100% de 5)
  // Si no hay eventos, asignamos 0
  // Si hay eventos pero no todos están completos, calculamos el porcentaje de cumplimiento
  const porcentajeRepaso1 = EventosRepaso1 > 0
    ? todosCompletosRepaso1 
      ? 5 // 100% de 5 puntos
      : (5 * sumaRepaso1) / EventosRepaso1 // Porcentaje de cumplimiento sobre 5 puntos
    : 0;
  console.log(`porcentajeRepaso1 calculado: ${porcentajeRepaso1}`);

  // Cálculo de porcentajeRepaso2 con depuración
  console.log(`Valores para cálculo de porcentajeRepaso2: EventosRepaso2=${EventosRepaso2}, sumaRepaso2=${sumaRepaso2}`);
  
  // Verificamos si todos los eventos tienen valor 1 (o equivalente)
  const todosCompletosRepaso2 = EventosRepaso2 === sumaRepaso2;
  console.log(`¿Todos los eventos de Repaso2 están completos? ${todosCompletosRepaso2}`);
  
  // Si todos los eventos están completos, asignamos 5 puntos (100% de 5)
  // Si no hay eventos, asignamos 0
  // Si hay eventos pero no todos están completos, calculamos el porcentaje de cumplimiento
  const porcentajeRepaso2 = EventosRepaso2 > 0
    ? todosCompletosRepaso2
      ? 5 // 100% de 5 puntos
      : (5 * sumaRepaso2) / EventosRepaso2 // Porcentaje de cumplimiento sobre 5 puntos
    : 0;
  console.log(`porcentajeRepaso2 calculado: ${porcentajeRepaso2}`);

  // Nuevos cálculos de proporcionalidad
  const proporcionalidadAntesis = sumaInflorescencia > 0
    ? ((sumaAntesis + sumaAntesisDejadas) * 100 / sumaInflorescencia)
    : 0;

  const proporcionalidadPostAntesis = sumaInflorescencia > 0
    ? ((sumaPostAntesis + sumaPostAntesisDejadas) * 100 / sumaInflorescencia)
    : 0;
    

  

  // 19. Total
  const total = porcentajeAntesisDejadas + porcentajePostAntesisDejadas + porcentajeEspate + porcentajeAplicacion + porcentajeMarcacion + 
                porcentajeRepaso1 + porcentajeRepaso2;

  return {
    sumaEventos,
    sumaAntesis,
    sumaPostAntesis,
    sumaAntesisDejadas,
    sumaPostAntesisDejadas,
    sumaInflorescencia,
    sumaAplicacion,
    sumaMarcacion,
    sumaEspate,
    sumaRepaso1,
    sumaRepaso2,
    porcentajeAntesisDejadas,
    porcentajePostAntesisDejadas,
    porcentajeEspate,
    porcentajeAplicacion,
    porcentajeMarcacion,
    porcentajeRepaso1,
    porcentajeRepaso2,
    proporcionalidadAntesis,
    proporcionalidadPostAntesis,
    EventosRepaso1,
    EventosRepaso2,
    total
  };
};
