import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaExpand, FaExclamationTriangle, FaChevronUp, FaChevronDown, FaHome, FaAngleRight } from 'react-icons/fa';
import {
  MainContainer,
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
  DetailHeader,
  Breadcrumbs,
  EvaluationTitle,
  MapContainer,
  DetailTable,
  DetailRow,
  DetailLabel,
  DetailValue,
  Navigation
} from '../styles/FincaDetail.styles';

// Datos de ejemplo para evaluaciones
const evaluacionesData = [
  // 2025
  { 
    id: '00134', 
    fecha: '11/2/2025', 
    seccion: 31, 
    evaluador: 'XIMENA GOMEZ', 
    porcentaje: '98%', 
    horaInicio: '11:11:03', 
    horaFin: '13:25:40', 
    semana: 7, 
    lote: '28A', 
    codigo: 'A144', 
    email: 'bloqueajurado@gmail.com',
    eventos: { palmas: 70, eventos: 93 },
    warning: true
  },
  { 
    id: '00142', 
    fecha: '18/2/2025', 
    seccion: 22, 
    evaluador: 'XIMENA GOMEZ', 
    porcentaje: '99%', 
    horaInicio: '10:15:03', 
    horaFin: '12:45:40', 
    semana: 8, 
    lote: '22B', 
    codigo: 'A152', 
    email: 'bloqueajurado@gmail.com',
    eventos: { palmas: 72, eventos: 95 },
    warning: true
  },
  { 
    id: '00143', 
    fecha: '18/2/2025', 
    seccion: 24, 
    evaluador: 'WILDER GONZALEZ LORA', 
    porcentaje: '97%', 
    horaInicio: '09:30:22', 
    horaFin: '11:45:15', 
    semana: 8, 
    lote: '24C', 
    codigo: 'A153', 
    email: 'wilder@gmail.com',
    eventos: { palmas: 65, eventos: 88 },
    warning: true
  },
  { 
    id: '00144', 
    fecha: '18/2/2025', 
    seccion: 26, 
    evaluador: 'VICTOR MEDINA MORENO', 
    porcentaje: '100%', 
    horaInicio: '10:25:33', 
    horaFin: '12:40:51', 
    semana: 8, 
    lote: '26D', 
    codigo: 'A154', 
    email: 'victor@gmail.com',
    eventos: { palmas: 69, eventos: 92 },
    warning: false
  },
  { 
    id: '00145', 
    fecha: '18/2/2025', 
    seccion: 28, 
    evaluador: 'VICTOR MEDINA MORENO', 
    porcentaje: '99%', 
    horaInicio: '11:10:45', 
    horaFin: '13:30:20', 
    semana: 8, 
    lote: '28E', 
    codigo: 'A155', 
    email: 'victor@gmail.com',
    eventos: { palmas: 71, eventos: 94 },
    warning: false
  },
  { 
    id: '00146', 
    fecha: '17/2/2025', 
    seccion: 30, 
    evaluador: 'WILDER GONZALEZ LORA', 
    porcentaje: '98%', 
    horaInicio: '09:15:18', 
    horaFin: '11:35:42', 
    semana: 8, 
    lote: '30A', 
    codigo: 'A156', 
    email: 'wilder@gmail.com',
    eventos: { palmas: 68, eventos: 90 },
    warning: true
  },
  { 
    id: '00147', 
    fecha: '14/2/2025', 
    seccion: 33, 
    evaluador: 'XIMENA GOMEZ', 
    porcentaje: '100%', 
    horaInicio: '10:05:30', 
    horaFin: '12:25:55', 
    semana: 7, 
    lote: '33B', 
    codigo: 'A157', 
    email: 'bloqueajurado@gmail.com',
    eventos: { palmas: 73, eventos: 96 },
    warning: true
  },
  { 
    id: '00148', 
    fecha: '14/2/2025', 
    seccion: 35, 
    evaluador: 'WILDER GONZALEZ LORA', 
    porcentaje: '99%', 
    horaInicio: '09:45:12', 
    horaFin: '12:05:38', 
    semana: 7, 
    lote: '35C', 
    codigo: 'A158', 
    email: 'wilder@gmail.com',
    eventos: { palmas: 67, eventos: 89 },
    warning: true
  },
  { 
    id: '00149', 
    fecha: '14/2/2025', 
    seccion: 37, 
    evaluador: 'VICTOR MEDINA MORENO', 
    porcentaje: '98%', 
    horaInicio: '10:35:27', 
    horaFin: '12:55:59', 
    semana: 7, 
    lote: '37D', 
    codigo: 'A159', 
    email: 'victor@gmail.com',
    eventos: { palmas: 70, eventos: 93 },
    warning: true
  },
  { 
    id: '00150', 
    fecha: '12/2/2025', 
    seccion: 39, 
    evaluador: 'XIMENA GOMEZ', 
    porcentaje: '100%', 
    horaInicio: '09:25:14', 
    horaFin: '11:45:40', 
    semana: 7, 
    lote: '39E', 
    codigo: 'A160', 
    email: 'bloqueajurado@gmail.com',
    eventos: { palmas: 74, eventos: 97 },
    warning: true
  },
  { 
    id: '00151', 
    fecha: '12/2/2025', 
    seccion: 42, 
    evaluador: 'WILDER GONZALEZ LORA', 
    porcentaje: '97%', 
    horaInicio: '10:55:33', 
    horaFin: '13:15:08', 
    semana: 7, 
    lote: '42A', 
    codigo: 'A161', 
    email: 'wilder@gmail.com',
    eventos: { palmas: 66, eventos: 87 },
    warning: true
  },
  { 
    id: '00152', 
    fecha: '12/2/2025', 
    seccion: 45, 
    evaluador: 'VICTOR MEDINA MORENO', 
    porcentaje: '99%', 
    horaInicio: '09:10:22', 
    horaFin: '11:30:47', 
    semana: 7, 
    lote: '45B', 
    codigo: 'A162', 
    email: 'victor@gmail.com',
    eventos: { palmas: 72, eventos: 95 },
    warning: true
  },
  { 
    id: '00153', 
    fecha: '11/2/2025', 
    seccion: 48, 
    evaluador: 'WILDER GONZALEZ LORA', 
    porcentaje: '100%', 
    horaInicio: '10:20:15', 
    horaFin: '12:40:40', 
    semana: 7, 
    lote: '48C', 
    codigo: 'A163', 
    email: 'wilder@gmail.com',
    eventos: { palmas: 69, eventos: 91 },
    warning: true
  },
  { 
    id: '00154', 
    fecha: '10/2/2025', 
    seccion: 50, 
    evaluador: 'XIMENA GOMEZ', 
    porcentaje: '98%', 
    horaInicio: '09:40:05', 
    horaFin: '12:00:30', 
    semana: 6, 
    lote: '50D', 
    codigo: 'A164', 
    email: 'bloqueajurado@gmail.com',
    eventos: { palmas: 71, eventos: 94 },
    warning: true
  },
  { 
    id: '00155', 
    fecha: '10/2/2025', 
    seccion: 52, 
    evaluador: 'VICTOR MEDINA MORENO', 
    porcentaje: '99%', 
    horaInicio: '10:30:25', 
    horaFin: '12:50:50', 
    semana: 6, 
    lote: '52E', 
    codigo: 'A165', 
    email: 'victor@gmail.com',
    eventos: { palmas: 68, eventos: 90 },
    warning: false
  },
  { 
    id: '00139', 
    fecha: '7/2/2025', 
    seccion: null, 
    evaluador: 'WILDER GONZALEZ LORA', 
    porcentaje: '100%', 
    horaInicio: '09:15:40', 
    horaFin: '11:30:12', 
    semana: 6, 
    lote: '22E', 
    codigo: 'A149', 
    email: 'wilder@gmail.com',
    eventos: { palmas: 64, eventos: 85 },
    warning: true
  },
  { 
    id: '00156', 
    fecha: '7/2/2025', 
    seccion: 55, 
    evaluador: 'XIMENA GOMEZ', 
    porcentaje: '97%', 
    horaInicio: '10:05:35', 
    horaFin: '12:25:07', 
    semana: 6, 
    lote: '55A', 
    codigo: 'A166', 
    email: 'bloqueajurado@gmail.com',
    eventos: { palmas: 70, eventos: 93 },
    warning: true
  },
  { 
    id: '00157', 
    fecha: '7/2/2025', 
    seccion: 57, 
    evaluador: 'VICTOR MEDINA MORENO', 
    porcentaje: '100%', 
    horaInicio: '09:25:15', 
    horaFin: '11:45:40', 
    semana: 6, 
    lote: '57B', 
    codigo: 'A167', 
    email: 'victor@gmail.com',
    eventos: { palmas: 73, eventos: 96 },
    warning: true
  },
  { 
    id: '00158', 
    fecha: '6/2/2025', 
    seccion: 59, 
    evaluador: 'XIMENA GOMEZ', 
    porcentaje: '98%', 
    horaInicio: '10:15:30', 
    horaFin: '12:35:55', 
    semana: 6, 
    lote: '59C', 
    codigo: 'A168', 
    email: 'bloqueajurado@gmail.com',
    eventos: { palmas: 67, eventos: 89 },
    warning: true
  },
  { 
    id: '00159', 
    fecha: '6/2/2025', 
    seccion: 61, 
    evaluador: 'WILDER GONZALEZ LORA', 
    porcentaje: '99%', 
    horaInicio: '09:50:20', 
    horaFin: '12:10:45', 
    semana: 6, 
    lote: '61D', 
    codigo: 'A169', 
    email: 'wilder@gmail.com',
    eventos: { palmas: 72, eventos: 95 },
    warning: true
  },
  { 
    id: '00160', 
    fecha: '6/2/2025', 
    seccion: 63, 
    evaluador: 'VICTOR MEDINA MORENO', 
    porcentaje: '100%', 
    horaInicio: '10:40:10', 
    horaFin: '13:00:35', 
    semana: 6, 
    lote: '63E', 
    codigo: 'A170', 
    email: 'victor@gmail.com',
    eventos: { palmas: 69, eventos: 91 },
    warning: false
  },
  { 
    id: '00161', 
    fecha: '5/2/2025', 
    seccion: 65, 
    evaluador: 'XIMENA GOMEZ', 
    porcentaje: '97%', 
    horaInicio: '09:30:25', 
    horaFin: '11:50:50', 
    semana: 6, 
    lote: '65A', 
    codigo: 'A171', 
    email: 'bloqueajurado@gmail.com',
    eventos: { palmas: 71, eventos: 94 },
    warning: true
  },
  { 
    id: '00162', 
    fecha: '5/2/2025', 
    seccion: 67, 
    evaluador: 'VICTOR MEDINA MORENO', 
    porcentaje: '98%', 
    horaInicio: '10:55:15', 
    horaFin: '13:15:40', 
    semana: 6, 
    lote: '67B', 
    codigo: 'A172', 
    email: 'victor@gmail.com',
    eventos: { palmas: 68, eventos: 90 },
    warning: true
  },
  // Evaluaciones restantes
  { 
    id: '00135', 
    fecha: '18/1/2025', 
    seccion: 18, 
    evaluador: 'WILDER GONZALEZ LORA', 
    porcentaje: '100%', 
    horaInicio: '09:30:10', 
    horaFin: '11:45:27', 
    semana: 3, 
    lote: '15B', 
    codigo: 'A145', 
    email: 'wilder@gmail.com',
    eventos: { palmas: 65, eventos: 88 },
    warning: false
  },
  { 
    id: '00136', 
    fecha: '18/1/2025', 
    seccion: 14, 
    evaluador: 'WILDER GONZALEZ LORA', 
    porcentaje: '100%', 
    horaInicio: '12:00:22', 
    horaFin: '14:15:35', 
    semana: 3, 
    lote: '14C', 
    codigo: 'A146', 
    email: 'wilder@gmail.com',
    eventos: { palmas: 60, eventos: 82 },
    warning: true
  },
  { 
    id: '00137', 
    fecha: '22/1/2025', 
    seccion: 18, 
    evaluador: 'WILDER GONZALEZ LORA', 
    porcentaje: '100%', 
    horaInicio: '08:35:19', 
    horaFin: '10:50:42', 
    semana: 4, 
    lote: '18A', 
    codigo: 'A147', 
    email: 'wilder@gmail.com',
    eventos: { palmas: 72, eventos: 95 },
    warning: true
  },
  { 
    id: '00138', 
    fecha: '30/1/2025', 
    seccion: 16, 
    evaluador: 'WILDER GONZALEZ LORA', 
    porcentaje: '100%', 
    horaInicio: '10:05:30', 
    horaFin: '12:20:55', 
    semana: 5, 
    lote: '16D', 
    codigo: 'A148', 
    email: 'wilder@gmail.com',
    eventos: { palmas: 68, eventos: 91 },
    warning: true
  },
  { 
    id: '00140', 
    fecha: '13/1/2025', 
    seccion: 41, 
    evaluador: 'VICTOR MEDINA MORENO', 
    porcentaje: '100%', 
    horaInicio: '08:45:19', 
    horaFin: '11:00:42', 
    semana: 3, 
    lote: '41A', 
    codigo: 'A150', 
    email: 'victor@gmail.com',
    eventos: { palmas: 75, eventos: 98 },
    warning: true
  },
  { 
    id: '00141', 
    fecha: '20/1/2025', 
    seccion: 41, 
    evaluador: 'VICTOR MEDINA MORENO', 
    porcentaje: '100%', 
    horaInicio: '10:25:33', 
    horaFin: '12:40:51', 
    semana: 4, 
    lote: '41B', 
    codigo: 'A151', 
    email: 'victor@gmail.com',
    eventos: { palmas: 69, eventos: 92 },
    warning: true
  }
];

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

  // Al iniciar, seleccionar el año más reciente
  useEffect(() => {
    if (evaluacionesData.length > 0) {
      // Obtener el año más reciente
      const años = [...new Set(evaluacionesData.map(e => e.fecha.split('/')[2]))];
      const añoReciente = años.sort((a, b) => b - a)[0];
      
      setSelectedYear(añoReciente);
      setExpandedYears({ [añoReciente]: true });
    }
  }, []);

  // Agrupar evaluaciones por año
  const evaluacionesPorAño = agruparPorAño(evaluacionesData);
  
  // Agrupar evaluaciones por fecha para el año seleccionado
  const fechasDelAño = selectedYear ? 
    agruparPorFecha(evaluacionesData.filter(e => e.fecha.split('/')[2] === selectedYear)) : 
    {};
  
  // Filtrar evaluaciones por fecha seleccionada
  const evaluacionesPorFecha = selectedDate ? 
    evaluacionesData.filter(e => e.fecha === selectedDate) : 
    (selectedYear ? 
      evaluacionesData.filter(e => e.fecha.split('/')[2] === selectedYear) : 
      evaluacionesData);
  
  // Agrupar por evaluador las evaluaciones filtradas
  const evaluadoresPorFecha = agruparPorEvaluador(evaluacionesPorFecha);
  
  // Evaluaciones del operador seleccionado
  const evaluacionesDelOperador = selectedOperator ? 
    evaluacionesPorFecha.filter(e => e.evaluador === selectedOperator) : 
    [];

  // Todas las evaluaciones del operador seleccionado (sin filtro de fecha)
  const todasEvaluacionesDelOperador = selectedOperator ?
    evaluacionesData.filter(e => e.evaluador === selectedOperator) :
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
      
      <div style={{ display: 'flex', width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
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
        
        <MainContainer>
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
                    
                    {Object.keys(agruparPorEvaluador(evaluacionesData)).map(operador => (
                      <div key={operador}>
                        <OperatorHeader onClick={() => selectOperator(operador)}>
                          <span className="operator-name">{operador}</span>
                          <span className="operator-count">
                            {evaluacionesData.filter(e => e.evaluador === operador).length}
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
                      <DetailValue>Finca La Palma</DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>Evaluador</DetailLabel>
                      <DetailValue>{selectedEvaluation.email}</DetailValue>
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
                      <DetailValue>Palmas: {selectedEvaluation.eventos.palmas} / Eventos: {selectedEvaluation.eventos.eventos}</DetailValue>
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
        </MainContainer>
      </div>
    </>
  );
};

export default FincaDetail;