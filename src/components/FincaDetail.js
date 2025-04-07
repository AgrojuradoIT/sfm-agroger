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
        const todosOperarios = {};
        todasLasEvaluaciones.forEach(ev => {
          if (ev.polinizador && ev.polinizador !== 'N/A') {
            if (!todosOperarios[ev.polinizador]) {
              todosOperarios[ev.polinizador] = [];
            }
            todosOperarios[ev.polinizador].push(ev);
          }
        });
        
        setEvaluacionesPorOperario(todosOperarios);
      }
    } else {
      setSelectedDate(fecha);
      
      // Utilizamos directamente las evaluaciones por fecha que tenemos de la API
      if (evaluacionesPorFecha[fecha]) {
        console.log(`FincaDetail - Usando datos de API: ${evaluacionesPorFecha[fecha].length} evaluaciones para fecha ${fecha}`);
        
        // Filtrar operarios para esta fecha
        const porOperario = {};
        evaluacionesPorFecha[fecha].forEach(ev => {
          if (ev.polinizador && ev.polinizador !== 'N/A') {
            if (!porOperario[ev.polinizador]) {
              porOperario[ev.polinizador] = [];
            }
            porOperario[ev.polinizador].push(ev);
          }
        });
        
        console.log(`FincaDetail - Filtrado ${Object.keys(porOperario).length} operarios para la fecha ${fecha}`);
        setEvaluacionesPorOperario(porOperario);
      } else {
        console.log(`FincaDetail - No hay datos para la fecha ${fecha}`);
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
        console.error('Error ordenando fechas:', error);
        return 0;
      }
    });

  const operariosOrdenados = Object.entries(evaluacionesPorOperario || {});
  
  console.log('FincaDetail - Render - Fechas ordenadas:', fechasOrdenadas);
  console.log('FincaDetail - Render - Operarios ordenados:', operariosOrdenados);

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

      <PanelsContainer>
        {/* Panel de Fechas */}
        <FilterPanel>
          <div className="panel-header">
            <FaCalendarAlt /> Fechas
          </div>
          {fechasOrdenadas.length > 0 ? (
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
          ) : operariosOrdenados.length > 0 ? (
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
                Evaluación General #{selectedEvaluation.id}
              </EvaluationTitle>
              
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
                  <table style={{ width: '100%', marginTop: '10px' }}>
                    <thead>
                      <tr>
                        <th>Sección</th>
                        <th>Palma</th>
                        <th>Inflorescencia</th>
                        <th>Antesis</th>
                        <th>Post-antesis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEvaluation.evaluacionesPolinizacion.map(ep => (
                        <tr key={ep.id}>
                          <td>{ep.seccion}</td>
                          <td>{ep.palma}</td>
                          <td>{ep.inflorescencia}</td>
                          <td>{ep.antesis}</td>
                          <td>{ep.postantesis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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