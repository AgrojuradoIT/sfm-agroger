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
  
  // Cuenta la cantidad de datos que hay en la columna Repaso 1 (los nulos o blancos no se cuentan)
  const EventosRepaso1 = evaluaciones.reduce((count, ev) => {
    return ev.repaso1 !== null && ev.repaso1 !== undefined ? count + 1 : count;
  }, 0);
  
  // Cuenta la cantidad de datos que hay en la columna Repaso 2 (los nulos o blancos no se cuentan)
  const EventosRepaso2 = evaluaciones.reduce((count, ev) => {
    return ev.repaso2 !== null && ev.repaso2 !== undefined ? count + 1 : count;
  }, 0);
  
  // Registrar en consola para depuración
  console.log(`Total de eventos con Repaso 1 válido (incluyendo ceros): ${EventosRepaso1}`);
  console.log(`Total de eventos con Repaso 2 válido (incluyendo ceros): ${EventosRepaso2}`);
  console.log(`Total de evaluaciones: ${evaluaciones.length}`);

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

  const porcentajeRepaso1 = EventosRepaso1 > 0
    ? (5 / EventosRepaso1) * (EventosRepaso1 - sumaRepaso1)
    : 0;

  const porcentajeRepaso2 = EventosRepaso2 > 0
    ? (5 / EventosRepaso2) * (EventosRepaso2 - sumaRepaso2)
    : 0;

  // Nuevos cálculos de proporcionalidad
  const proporcionalidadAntesis = sumaInflorescencia > 0
    ? (sumaAntesis * 100) / sumaInflorescencia
    : 0;

  const proporcionalidadPostAntesis = sumaInflorescencia > 0
    ? (sumaPostAntesis * 100) / sumaInflorescencia
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
