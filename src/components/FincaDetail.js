import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';
import {
  FilterPanel,
  EvaluationsPanel,
  DetailPanel,
  AllButton,
  YearSection,
  DateItem,
  DateBadge,
  OperatorHeader,
  EvaluationItem,
  EvaluationDetails,
  EvaluationPercentage,
  EvaluationTitle,
  MapContainer,
  DetailTable,
  DetailRow,
  DetailLabel,
  DetailValue,
  Navigation,
  LoadingIndicator,
  ErrorMessage,
  PanelsContainer
} from '../styles/FincaDetail.styles';
import fincaService from '../services/fincaService';

// Función para agrupar evaluaciones por año
const agruparPorAño = (evaluaciones) => {
  return evaluaciones.reduce((acc, evaluacion) => {
    const año = evaluacion.fecha.split('/')[2];
    if (!acc[año]) {
      acc[año] = [];
    }
    acc[año].push(evaluacion);
    return acc;
  }, {});
};

// Función para agrupar evaluaciones por fecha
const agruparPorFecha = (evaluaciones) => {
  return evaluaciones.reduce((acc, evaluacion) => {
    const fecha = evaluacion.fecha;
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(evaluacion);
    return acc;
  }, {});
};

// Función para agrupar evaluaciones por evaluador
const agruparPorEvaluador = (evaluaciones) => {
  return evaluaciones.reduce((acc, evaluacion) => {
    if (!acc[evaluacion.evaluador]) {
      acc[evaluacion.evaluador] = [];
    }
    acc[evaluacion.evaluador].push(evaluacion);
    return acc;
  }, {});
};

const FincaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [expandedYears, setExpandedYears] = useState({});
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usandoDatosEjemplo, setUsandoDatosEjemplo] = useState(false);

  // Cargar datos de la finca al iniciar
  useEffect(() => {
    const cargarEvaluaciones = async () => {
      try {
        setIsLoading(true);
        const resultado = await fincaService.getEvaluacionesByFincaId(id);
        setEvaluaciones(resultado.evaluaciones);
        setUsandoDatosEjemplo(resultado.usandoDatosEjemplo);
        
        // Si hay evaluaciones, seleccionar el año más reciente
        if (resultado.evaluaciones.length > 0) {
          const años = [...new Set(resultado.evaluaciones.map(e => e.fecha.split('/')[2]))];
          const añoReciente = años.sort((a, b) => b - a)[0];
          
          setSelectedYear(añoReciente);
          setExpandedYears({ [añoReciente]: true });
        }
      } catch (err) {
        console.error('Error al cargar evaluaciones:', err);
        setError('No se pudieron cargar las evaluaciones. Por favor, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    cargarEvaluaciones();
  }, [id]);

  // Agrupar evaluaciones por año
  const evaluacionesPorAño = agruparPorAño(evaluaciones);
  
  // Agrupar evaluaciones por fecha para el año seleccionado
  const fechasDelAño = selectedYear ? 
    agruparPorFecha(evaluaciones.filter(e => e.fecha.split('/')[2] === selectedYear)) : 
    {};
  
  // Filtrar evaluaciones por fecha seleccionada
  const evaluacionesPorFecha = selectedDate ? 
    evaluaciones.filter(e => e.fecha === selectedDate) : 
    (selectedYear ? 
      evaluaciones.filter(e => e.fecha.split('/')[2] === selectedYear) : 
      evaluaciones);
  
  // Agrupar por evaluador las evaluaciones filtradas
  const evaluadoresPorFecha = agruparPorEvaluador(evaluacionesPorFecha);
  
  // Evaluaciones del operador seleccionado
  const evaluacionesDelOperador = selectedOperator ? 
    evaluacionesPorFecha.filter(e => e.evaluador === selectedOperator) : 
    [];

  // Todas las evaluaciones del operador seleccionado (sin filtro de fecha)
  const todasEvaluacionesDelOperador = selectedOperator ?
    evaluaciones.filter(e => e.evaluador === selectedOperator) :
    [];

  const toggleYearExpand = (year) => {
    setExpandedYears(prev => ({...prev, [year]: !prev[year]}));
    setSelectedYear(year);
    setSelectedDate(null);
    setSelectedOperator(null);
    setSelectedEvaluation(null);
  };

  const selectDate = (date) => {
    setSelectedDate(date);
    setSelectedOperator(null);
    setSelectedEvaluation(null);
  };

  const selectOperator = (operator) => {
    // Si ya está seleccionado, deseleccionarlo para volver a la lista
    if (selectedOperator === operator) {
      setSelectedOperator(null);
      setSelectedEvaluation(null);
    } else {
      setSelectedOperator(operator);
      setSelectedEvaluation(null);
    }
  };

  const selectEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
  };

  // Formatear fecha para mostrar (día/mes)
  const formatearFecha = (fecha) => {
    const [dia, mes] = fecha.split('/');
    return `${dia}/${mes}`;
  };

  // Función para volver a la página principal
  const goToHome = () => {
    navigate('/');
  };

  // Función para mostrar todos los operarios
  const showAllOperators = () => {
    setSelectedDate(null);
    setSelectedYear(null);
    setSelectedOperator(null);
    setSelectedEvaluation(null);
    // Colapsar todos los años
    setExpandedYears({});
  };

  // Mostrar indicador de carga mientras se cargan los datos
  if (isLoading) {
    return <LoadingIndicator>Cargando datos de la finca...</LoadingIndicator>;
  }
  
  // Mostrar mensaje de error si ocurrió alguno y no hay datos de ejemplo
  if (error && evaluaciones.length === 0) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

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
          <span className="nav-link" onClick={goToHome}>Finca {id.toUpperCase()}</span>
        </div>
        <div className="separator">
          <FaAngleRight />
        </div>
        <div className="nav-item">
          <span className="current">Evaluacion Polen FA</span>
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
          textAlign: 'center' 
        }}>
          Mostrando datos de ejemplo. No se pudo conectar con la API.
        </div>
      )}
      
      <PanelsContainer>
        {/* Sidebar Negro (izquierda) - Filtro por fechas */}
        <FilterPanel>
          <AllButton 
            onClick={showAllOperators} 
            selected={!selectedYear && !selectedDate}
          >
            All
          </AllButton>
          
          {Object.keys(evaluacionesPorAño).sort((a, b) => b - a).map(año => (
            <div key={año}>
              <YearSection onClick={() => toggleYearExpand(año)}>
                <span className="year-icon">📆</span>
                <span className="year-text">{año}</span>
                <span className="year-count">{evaluacionesPorAño[año].length}</span>
              </YearSection>
              
              {expandedYears[año] && Object.keys(fechasDelAño)
                .sort((a, b) => {
                  const [diaA, mesA] = a.split('/').map(Number);
                  const [diaB, mesB] = b.split('/').map(Number);
                  if (mesA !== mesB) return mesB - mesA;
                  return diaB - diaA;
                })
                .map(fecha => (
                  <DateItem 
                    key={fecha} 
                    selected={fecha === selectedDate}
                    onClick={() => selectDate(fecha)}
                  >
                    {formatearFecha(fecha)} 
                    <DateBadge selected={fecha === selectedDate}>
                      {fechasDelAño[fecha].length}
                    </DateBadge>
                  </DateItem>
                ))}
            </div>
          ))}
        </FilterPanel>
          
        {/* Panel Amarillo (centro) - Listado de evaluaciones por operario */}
        <EvaluationsPanel>
          {selectedDate ? (
            // Si hay una fecha seleccionada, mostrar los operarios de esa fecha
            <>
              {/* Mostrar todos los operarios de la fecha seleccionada */}
              {!selectedOperator && Object.keys(evaluadoresPorFecha).map(operador => (
                <div key={operador}>
                  <OperatorHeader onClick={() => selectOperator(operador)}>
                    <span className="operator-name">{operador}</span>
                    <span className="operator-count">{evaluadoresPorFecha[operador].length}</span>
                  </OperatorHeader>
                </div>
              ))}

              {/* Si se seleccionó un operario, mostrar sus evaluaciones */}
              {selectedOperator && (
                <>
                  <OperatorHeader onClick={() => selectOperator(selectedOperator)} style={{ cursor: 'pointer' }}>
                    <span className="operator-name">{selectedOperator}</span>
                    <span className="operator-count">{evaluacionesDelOperador.length}</span>
                  </OperatorHeader>
                  
                  {evaluacionesDelOperador.map(evaluacion => (
                    <EvaluationItem 
                      key={evaluacion.id}
                      selected={selectedEvaluation && selectedEvaluation.id === evaluacion.id}
                      onClick={() => selectEvaluation(evaluacion)}
                    >
                      <EvaluationDetails>
                        <div className="section">
                          Sección {evaluacion.seccion || 'N/A'}
                        </div>
                        <div className="date">{evaluacion.fecha}</div>
                      </EvaluationDetails>
                      <EvaluationPercentage value={evaluacion.porcentaje}>
                        {evaluacion.porcentaje}
                      </EvaluationPercentage>
                    </EvaluationItem>
                  ))}
                </>
              )}
            </>
          ) : selectedYear ? (
            // Si no hay fecha pero hay año seleccionado, mostrar mensaje de selección
            <div style={{ padding: '15px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
              Selecciona una fecha para ver las evaluaciones
            </div>
          ) : (
            // Si no hay fecha ni año seleccionado (All), mostrar todos los operarios
            <>
              {!selectedOperator ? (
                // Mostrar lista de todos los operarios
                <>
                  <div style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    fontWeight: 'bold', 
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#f2f2f2',
                    color: '#333'
                  }}>
                    Vista Global: Todos los operarios
                  </div>
                  
                  {Object.keys(agruparPorEvaluador(evaluaciones)).map(operador => (
                    <div key={operador}>
                      <OperatorHeader onClick={() => selectOperator(operador)}>
                        <span className="operator-name">{operador}</span>
                        <span className="operator-count">
                          {evaluaciones.filter(e => e.evaluador === operador).length}
                        </span>
                      </OperatorHeader>
                    </div>
                  ))}
                </>
              ) : (
                // Mostrar evaluaciones del operario seleccionado
                <>
                  <OperatorHeader onClick={() => selectOperator(selectedOperator)} style={{ cursor: 'pointer' }}>
                    <span className="operator-name">{selectedOperator}</span>
                    <span className="operator-count">{todasEvaluacionesDelOperador.length}</span>
                  </OperatorHeader>
                  
                  {todasEvaluacionesDelOperador
                    .sort((a, b) => {
                      // Ordenar por fecha descendente
                      const [diaA, mesA, añoA] = a.fecha.split('/').map(Number);
                      const [diaB, mesB, añoB] = b.fecha.split('/').map(Number);
                      if (añoA !== añoB) return añoB - añoA;
                      if (mesA !== mesB) return mesB - mesA;
                      return diaB - diaA;
                    })
                    .map(evaluacion => (
                      <EvaluationItem 
                        key={evaluacion.id}
                        selected={selectedEvaluation && selectedEvaluation.id === evaluacion.id}
                        onClick={() => selectEvaluation(evaluacion)}
                      >
                        <EvaluationDetails>
                          <div className="section">
                            Sección {evaluacion.seccion || 'N/A'}
                          </div>
                          <div className="date">{evaluacion.fecha}</div>
                        </EvaluationDetails>
                        <EvaluationPercentage value={evaluacion.porcentaje}>
                          {evaluacion.porcentaje}
                        </EvaluationPercentage>
                      </EvaluationItem>
                    ))}
                </>
              )}
            </>
          )}
        </EvaluationsPanel>

        {/* Panel Azul (derecha) - Detalle de la evaluación seleccionada */}
        <DetailPanel>
          {selectedEvaluation ? (
            <>
              <EvaluationTitle>
                Evaluación de Polen #{selectedEvaluation.id}
              </EvaluationTitle>
              
              <MapContainer>
                <img src="/images/evaluation_map.jpg" alt="Mapa de evaluación" />
                <div className="overlay">
                  <div className="evaluator">{selectedEvaluation.evaluador}</div>
                  <div className="percentage">{selectedEvaluation.porcentaje}</div>
                </div>
              </MapContainer>
              
              <DetailTable>
                <tbody>
                  <DetailRow>
                    <DetailLabel>ID Evaluación</DetailLabel>
                    <DetailValue>EvalPol-{selectedEvaluation.id}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>FechaInicio</DetailLabel>
                    <DetailValue>{selectedEvaluation.fecha}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>HoraInicio</DetailLabel>
                    <DetailValue>{selectedEvaluation.horaInicio}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Semana</DetailLabel>
                    <DetailValue>Semana {selectedEvaluation.semana}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Ubicación</DetailLabel>
                    <DetailValue>Finca {id.toUpperCase()}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Evaluador</DetailLabel>
                    <DetailValue>{selectedEvaluation.email || selectedEvaluation.evaluador}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Lote</DetailLabel>
                    <DetailValue>Lote {selectedEvaluation.lote}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Sección</DetailLabel>
                    <DetailValue>{selectedEvaluation.seccion}</DetailValue>
                  </DetailRow>
                  <DetailRow>
                    <DetailLabel>Palmas y Eventos</DetailLabel>
                    <DetailValue>Palmas: {selectedEvaluation.eventos?.palmas} / Eventos: {selectedEvaluation.eventos?.eventos}</DetailValue>
                  </DetailRow>
                </tbody>
              </DetailTable>
              
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', fontSize: '16px' }}>
                  Related EvaluacionPolinizacion_FAs <span style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '10px', fontSize: '11px' }}>93</span>
                </h3>
              </div>
            </>
          ) : (
            // Si no hay evaluación seleccionada, mostrar un mensaje
            <div style={{ padding: '15px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
              Selecciona una evaluación para ver los detalles
            </div>
          )}
        </DetailPanel>
      </PanelsContainer>
    </>
  );
};

export default FincaDetail;