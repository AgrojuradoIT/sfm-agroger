import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaAngleRight, FaCalendarAlt, FaUser, FaExclamationTriangle } from 'react-icons/fa';
import {
  FilterPanel,
  EvaluationsPanel,
  DetailPanel,
  DateItem,
  OperatorHeader,
  EvaluationTitle,
  DetailTable,
  DetailRow,
  DetailLabel,
  DetailValue,
  Navigation,
  LoadingIndicator,
  PanelsContainer
} from '../styles/FincaDetail.styles';
import fincaService from '../services/fincaService';
import { calcularMetricasPolinizacion } from '../utils/calculosPolinizacion';

// Mapeo de letras a IDs de finca
const FINCA_ID_MAP = {
  'a': '1',
  'b': '2',
  'c': '3',
  'd': '4'
};

const FincaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [evaluacionesPorFecha, setEvaluacionesPorFecha] = useState({});
  const [evaluacionesPorOperario, setEvaluacionesPorOperario] = useState({});
  const [todasLasEvaluaciones, setTodasLasEvaluaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usandoDatosEjemplo, setUsandoDatosEjemplo] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Extraer fetchData fuera del useEffect para poder reutilizarla
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const fincaId = FINCA_ID_MAP[id?.toLowerCase()];
      if (!fincaId) {
        throw new Error('ID de finca no válido');
      }
      
      console.log(`FincaDetail - Obteniendo datos para finca ID: ${fincaId}`);
      
      // Llamar al servicio directamente para depurar
      const apiResponse = await fincaService.getEvaluacionesByFincaId(fincaId);
      console.log('FincaDetail - Respuesta completa:', apiResponse);
      
      // Si hay un mensaje, mostrarlo
      if (apiResponse.mensaje) {
        setMensaje(apiResponse.mensaje);
      }
      
      // Verificar si tenemos evaluaciones
      if (apiResponse.evaluaciones && apiResponse.evaluaciones.length > 0) {
        console.log(`FincaDetail - Se encontraron ${apiResponse.evaluaciones.length} evaluaciones`);
        
        // Guardar las evaluaciones
        setTodasLasEvaluaciones(apiResponse.evaluaciones);
        
        // Guardar las evaluaciones por fecha
        setEvaluacionesPorFecha(apiResponse.evaluacionesPorFecha || {});
        
        // Guardar operarios de todas las evaluaciones
        setEvaluacionesPorOperario(apiResponse.evaluacionesPorOperario || {});
        
        // Ver qué datos estamos guardando
        console.log('Datos a guardar:', {
          evaluaciones: apiResponse.evaluaciones,
          porFecha: apiResponse.evaluacionesPorFecha,
          porOperario: apiResponse.evaluacionesPorOperario
        });
      } else {
        console.log('FincaDetail - No se encontraron evaluaciones');
        setTodasLasEvaluaciones([]);
        setEvaluacionesPorFecha({});
        setEvaluacionesPorOperario({});
      }
      
      setUsandoDatosEjemplo(apiResponse.usandoDatosEjemplo || false);
      setError(null);
      
      // Limpiar selecciones cuando se cargan nuevos datos
      setSelectedDate(null);
      setSelectedOperator(null);
      setSelectedEvaluation(null);
    } catch (err) {
      console.error('FincaDetail - Error al cargar datos:', err);
      setError('Error al cargar los datos de la finca: ' + (err.message || 'Error desconocido'));
      setTodasLasEvaluaciones([]);
      setEvaluacionesPorFecha({});
      setEvaluacionesPorOperario({});
      setMensaje('No se pudieron cargar los datos. Verifique la conexión al servidor.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectDate = (fecha) => {
    console.log(`FincaDetail - Seleccionando fecha: ${fecha}`);
    
    // Si ya está seleccionada, deseleccionar
    if (selectedDate === fecha) {
      console.log('FincaDetail - Deseleccionando fecha, mostrando todos los operarios');
      setSelectedDate(null);
        
      // Reconstruir evaluacionesPorOperario directamente desde todasLasEvaluaciones
      if (todasLasEvaluaciones.length > 0) {
        console.log('Reconstruyendo operarios desde todas las evaluaciones', todasLasEvaluaciones.length);
        const todosOperarios = {};
        todasLasEvaluaciones.forEach(ev => {
          if (ev.polinizador && ev.polinizador !== 'N/A') {
            if (!todosOperarios[ev.polinizador]) {
              todosOperarios[ev.polinizador] = [];
            }
            todosOperarios[ev.polinizador].push(ev);
          }
        });
        
        console.log('Operarios reconstruidos:', Object.keys(todosOperarios));
        setEvaluacionesPorOperario(todosOperarios);
      }
    } else {
      setSelectedDate(fecha);
      
      // Intentar obtener directamente de evaluacionesPorFecha
      if (evaluacionesPorFecha[fecha]) {
        console.log(`FincaDetail - Fecha seleccionada encontrada: ${fecha}`, evaluacionesPorFecha[fecha]);
        
        // Verificar si necesitamos filtrar los operarios o tenemos ya la estructura preparada
        if (evaluacionesPorFecha[fecha].operarios) {
          // Si ya hay una estructura de operarios pre-calculada
          console.log('Usando operarios pre-calculados para esta fecha');
          setEvaluacionesPorOperario(evaluacionesPorFecha[fecha].operarios);
        } else {
          // Filtrar operarios para esta fecha desde todas las evaluaciones
          console.log('Filtrando operarios para la fecha seleccionada');
          const evaluacionesDeFecha = todasLasEvaluaciones.filter(ev => ev.fecha === fecha);
          console.log(`Evaluaciones para fecha ${fecha}:`, evaluacionesDeFecha.length);
          
          // Para cada evaluación de esta fecha, agrupamos por operario
          const operariosFiltrados = {};
          evaluacionesDeFecha.forEach(ev => {
            if (ev.polinizador && ev.polinizador !== 'N/A') {
              if (!operariosFiltrados[ev.polinizador]) {
                operariosFiltrados[ev.polinizador] = [];
              }
              operariosFiltrados[ev.polinizador].push(ev);
            }
          });
          
          console.log('Operarios filtrados para esta fecha:', Object.keys(operariosFiltrados));
          setEvaluacionesPorOperario(operariosFiltrados);
        }
      } else {
        console.warn(`FincaDetail - No hay datos para la fecha ${fecha}`);
        setEvaluacionesPorOperario({});
      }
    }
    
    // Reiniciamos las selecciones de operario y evaluación
    setSelectedOperator(null);
    setSelectedEvaluation(null);
  };

  const selectOperator = (operario) => {
    console.log(`FincaDetail - Seleccionando operario: ${operario}`);
    
    // Si ya está seleccionado, deseleccionar
    if (selectedOperator === operario) {
      console.log('FincaDetail - Deseleccionando operario');
      setSelectedOperator(null);
      setSelectedEvaluation(null);
    } else {
      setSelectedOperator(operario);
      
      // Obtener las evaluaciones del operario seleccionado
      if (evaluacionesPorOperario && evaluacionesPorOperario[operario]) {
        const evaluacionesOperario = evaluacionesPorOperario[operario];
        console.log(`FincaDetail - Operario ${operario} tiene ${evaluacionesOperario.length} evaluaciones`);
        
        if (evaluacionesOperario.length > 0) {
          console.log('FincaDetail - Primera evaluación del operario:', evaluacionesOperario[0]);
          // Mostrar la primera evaluación del operario
          setSelectedEvaluation(evaluacionesOperario[0]);
        } else {
          console.log('FincaDetail - No hay evaluaciones para este operario');
          setSelectedEvaluation(null);
        }
      } else {
        console.log('FincaDetail - No hay datos para este operario:', operario);
        setSelectedEvaluation(null);
      }
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  const reintentar = () => {
    setIsLoading(true);
    setError(null);
    setMensaje('');
    // Volver a cargar los datos
    fetchData();
  };

  if (isLoading) {
    return <LoadingIndicator>Cargando datos de la finca...</LoadingIndicator>;
  }

  const fechasOrdenadas = Object.entries(evaluacionesPorFecha || {})
    .sort(([fechaA], [fechaB]) => {
      try {
        // Convertir las fechas de DD/MM/YYYY a Date para comparar
        const [diaA, mesA, anioA] = fechaA.split('/').map(Number);
        const [diaB, mesB, anioB] = fechaB.split('/').map(Number);
        
        // Crear objetos Date (mes se resta 1 porque en Date los meses van de 0 a 11)
        const dateA = new Date(anioA, mesA - 1, diaA);
        const dateB = new Date(anioB, mesB - 1, diaB);
        
        // Ordenar de más reciente a más antigua
        return dateB - dateA;
      } catch (error) {
        console.error('Error ordenando fechas:', error, fechaA, fechaB);
        return 0;
      }
    });

  const operariosOrdenados = Object.entries(evaluacionesPorOperario || {});
  
  // Logs detallados para depuración
  console.log('FincaDetail - Datos disponibles:', {
    evaluaciones: todasLasEvaluaciones.length,
    fechas: Object.keys(evaluacionesPorFecha || {}).length,
    operarios: Object.keys(evaluacionesPorOperario || {}).length
  });
  
  console.log('FincaDetail - Render - Fechas ordenadas:', fechasOrdenadas);
  console.log('FincaDetail - Fechas originales:', Object.keys(evaluacionesPorFecha || {}));
  console.log('FincaDetail - Render - Operarios ordenados:', operariosOrdenados);

  // Verificar si realmente hay datos disponibles
  const hayDatosDisponibles = todasLasEvaluaciones.length > 0;
  const hayFechasDisponibles = fechasOrdenadas.length > 0;
  const hayOperariosDisponibles = operariosOrdenados.length > 0;
  
  console.log('Hay datos disponibles:', hayDatosDisponibles);
  console.log('Hay fechas disponibles:', hayFechasDisponibles);
  console.log('Hay operarios disponibles:', hayOperariosDisponibles);

  return (
    <>
      <Navigation>
        <div className="nav-item">
          <span className="nav-link" onClick={goToHome}>Menu</span>
        </div>
        <div className="separator">
          <FaAngleRight />
        </div>
        <div className="nav-item">
          <span className="current">Finca {id.toUpperCase()}</span>
        </div>
      </Navigation>
      
      {usandoDatosEjemplo && (
        <div style={{ 
          padding: '10px', 
          background: '#fff3cd', 
          color: '#856404', 
          borderRadius: '4px', 
          margin: '10px', 
          fontSize: '14px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <FaExclamationTriangle />
          Mostrando datos de ejemplo. No se pudo conectar con la API.
        </div>
      )}
      
      {mensaje && (
        <div style={{ 
          padding: '10px', 
          background: '#d4edda', 
          color: '#155724', 
          borderRadius: '4px', 
          margin: '10px', 
          fontSize: '14px',
          textAlign: 'center' 
        }}>
          {mensaje}
        </div>
      )}
      
      {error && (
        <div style={{ 
          padding: '10px', 
          background: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px', 
          margin: '10px', 
          fontSize: '14px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div><FaExclamationTriangle /> {error}</div>
          <button 
            onClick={reintentar}
            style={{
              padding: '5px 10px',
              background: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      )}
      
      {!hayDatosDisponibles && !error && !isLoading && (
        <div style={{ 
          padding: '10px', 
          background: '#f2f2f2', 
          color: '#555', 
          borderRadius: '4px', 
          margin: '10px', 
          fontSize: '14px',
          textAlign: 'center'
        }}>
          No se encontraron evaluaciones para esta finca.
        </div>
      )}

      <PanelsContainer>
        {/* Panel de Fechas */}
        <FilterPanel>
          <div className="panel-header">
            <FaCalendarAlt /> Fechas
          </div>
          {hayFechasDisponibles ? (
            fechasOrdenadas.map(([fecha, evals]) => (
              <DateItem 
                key={fecha}
                onClick={() => selectDate(fecha)}
                selected={selectedDate === fecha}
              >
                <div className="date-info">
                  <div className="date">{fecha}</div>
                  <div className="count">{evals.length} evaluaciones</div>
                </div>
              </DateItem>
            ))
          ) : (
            <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
              No hay evaluaciones disponibles
            </div>
          )}
        </FilterPanel>

        {/* Panel de Operarios */}
        <EvaluationsPanel>
          <div className="panel-header">
            <FaUser /> Operarios
          </div>
          {!selectedDate ? (
            <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
              Selecciona una fecha para ver los operarios
            </div>
          ) : hayOperariosDisponibles ? (
            operariosOrdenados.map(([operario, evals]) => (
              <OperatorHeader 
                key={operario}
                onClick={() => selectOperator(operario)}
                selected={selectedOperator === operario}
              >
                <span className="operator-name">{operario}</span>
                <span className="operator-count">{evals.length} evaluaciones</span>
              </OperatorHeader>
            ))
          ) : (
            <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
              No hay operarios disponibles para esta fecha
            </div>
          )}
        </EvaluationsPanel>

        {/* Panel de Detalles */}
        <DetailPanel>
          {selectedEvaluation ? (
            <>
              <EvaluationTitle>
                {selectedEvaluation.polinizador}
                {selectedEvaluation.evaluacionesPolinizacion?.length > 0 && (
                  <span style={{ 
                    marginLeft: '15px', 
                    fontSize: '0.9em',
                    backgroundColor: '#e9ecef',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: '#495057'
                  }}>
                    {calcularMetricasPolinizacion(selectedEvaluation.evaluacionesPolinizacion).total.toFixed(2)}%
                  </span>
                )}
              </EvaluationTitle>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                {selectedEvaluation.fotopath && (
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: '10px' }}>Foto del Operario</h4>
                    <img 
                      src={selectedEvaluation.fotopath}
                      alt="Foto del operario"
                      style={{ 
                        width: '100%', 
                        maxWidth: '250px', 
                        height: 'auto',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                  </div>
                )}
                
                {selectedEvaluation.firmapath && (
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: '10px' }}>Firma del Operario</h4>
                    <img 
                      src={selectedEvaluation.firmapath}
                      alt="Firma del operario"
                      style={{ 
                        width: '100%', 
                        maxWidth: '250px', 
                        height: 'auto',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                  </div>
                )}
              </div>
              
              <DetailTable>
                <tbody>
                  <DetailRow>
                    <DetailLabel>ID Evaluación</DetailLabel>
                    <DetailValue>EvalGen-{selectedEvaluation.id}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Fecha</DetailLabel>
                    <DetailValue>{selectedEvaluation.fecha}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Hora</DetailLabel>
                    <DetailValue>{selectedEvaluation.hora}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Semana</DetailLabel>
                    <DetailValue>Semana {selectedEvaluation.semana}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Evaluador</DetailLabel>
                    <DetailValue>{selectedEvaluation.evaluador}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Polinizador</DetailLabel>
                    <DetailValue>{selectedEvaluation.polinizador}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Evaluaciones de Polinización</DetailLabel>
                    <DetailValue>{selectedEvaluation.evaluacionesPolinizacion?.length || 0}</DetailValue>
                  </DetailRow>
                </tbody>
              </DetailTable>
              
              {selectedEvaluation.evaluacionesPolinizacion?.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3>Evaluaciones de Polinización</h3>
                  <div style={{ overflowX: 'auto', marginTop: '10px' }}>
                    <table style={{ width: '100%', minWidth: '1200px' }}>
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Hora</th>
                          <th>Semana</th>
                          <th>Ubicación</th>
                          <th>ID Evaluador</th>
                          <th>ID Polinizador</th>
                          <th>ID Lote</th>
                          <th>Sección</th>
                          <th>Palma</th>
                          <th>Inflorescencia</th>
                          <th>Antesis</th>
                          <th>Antesis Dejadas</th>
                          <th>Post-antesis Dejadas</th>
                          <th>Post-antesis</th>
                          <th>Espate</th>
                          <th>Aplicación</th>
                          <th>Marcación</th>
                          <th>Repaso 1</th>
                          <th>Repaso 2</th>
                          <th>Observaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvaluation.evaluacionesPolinizacion.map(ep => (
                          <tr key={ep.id}>
                            <td>{ep.fecha || ''}</td>
                            <td>{ep.hora || ''}</td>
                            <td>{ep.semana || ''}</td>
                            <td>{ep.ubicacion || ''}</td>
                            <td>{ep.idevaluador || ''}</td>
                            <td>{ep.idpolinizador || ''}</td>
                            <td>{ep.idlote || ''}</td>
                            <td>{ep.seccion || ''}</td>
                            <td>{ep.palma || ''}</td>
                            <td>{ep.inflorescencia || ''}</td>
                            <td>{ep.antesis === 0 ? '0' : ep.antesis || ''}</td>
                            <td>{ep.antesisDejadas === 0 ? '0' : ep.antesisDejadas || ''}</td>
                            <td>{ep.postantesisDejadas === 0 ? '0' : ep.postantesisDejadas || ''}</td>
                            <td>{ep.postantesis === 0 ? '0' : ep.postantesis || ''}</td>
                            <td>{ep.espate === 0 ? '0' : ep.espate || ''}</td>
                            <td>{ep.aplicacion || ''}</td>
                            <td>{ep.marcacion || ''}</td>
                            <td>{ep.repaso1 || ''}</td>
                            <td>{ep.repaso2 || ''}</td>
                            <td>{ep.observaciones || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Tabla de Resumen de Métricas */}
                  <div style={{ marginTop: '30px' }}>
                    <h3>Resumen de Métricas de Polinización</h3>
                    <div style={{ overflowX: 'auto', marginTop: '10px' }}>
                      {(() => {
                        const metricas = calcularMetricasPolinizacion(selectedEvaluation.evaluacionesPolinizacion);
                        return (
                          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Métrica</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Valor</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Total Eventos</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.sumaEventos}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Suma Antesis</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.sumaAntesis}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Suma Post Antesis</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.sumaPostAntesis}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Suma Antesis Dejadas</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.sumaAntesisDejadas}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Suma Post Antesis Dejadas</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.sumaPostAntesisDejadas}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Suma Inflorescencia</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.sumaInflorescencia}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Suma Aplicación</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.sumaAplicacion}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Suma Marcación</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.sumaMarcacion}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Suma Espate</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.sumaEspate}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Suma Repaso 1</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.sumaRepaso1}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Suma Repaso 2</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.sumaRepaso2}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>% Antesis Dejadas</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.porcentajeAntesisDejadas.toFixed(2)}%</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>% Post Antesis Dejadas</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.porcentajePostAntesisDejadas.toFixed(2)}%</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>% Espate</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.porcentajeEspate.toFixed(2)}%</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>% Aplicación</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.porcentajeAplicacion.toFixed(2)}%</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>% Marcación</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.porcentajeMarcacion.toFixed(2)}%</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>% Repaso 1</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.porcentajeRepaso1.toFixed(2)}%</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>% Repaso 2</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.porcentajeRepaso2.toFixed(2)}%</td>
                              </tr>
                              <tr style={{ backgroundColor: '#e9ecef', fontWeight: 'bold' }}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Total</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{metricas.total.toFixed(2)}%</td>
                              </tr>
                            </tbody>
                          </table>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
              {!selectedDate ? 'Selecciona una fecha para ver las evaluaciones' :
               !selectedOperator ? 'Selecciona un operario para ver sus evaluaciones' :
               'No hay evaluaciones disponibles'}
            </div>
          )}
        </DetailPanel>
      </PanelsContainer>
    </>
  );
};

export default FincaDetail;