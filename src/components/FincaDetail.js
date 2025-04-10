import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaAngleRight, FaCalendarAlt, FaUser, FaExclamationTriangle, FaCalendar, FaClock, FaIdCard, FaUserAlt, FaChartBar } from 'react-icons/fa';
import { Card, CardContent, Typography, Grid, LinearProgress, Box, Chip, Divider, Paper } from '@mui/material';
import {
  FilterPanel,
  EvaluationsPanel,
  DetailPanel,
  DateItem,
  OperatorHeader,
  Navigation,
  LoadingIndicator,
  PanelsContainer,
  OperatorPhotoContainer,
  OperatorNameHeader,
  OperatorTitle,
  PhotoBox,
  PhotoContainer,
  OperatorPhoto,
  PhotoOverlay,
  OverlayText,
  PhotoErrorPlaceholder,
  PhotoPlaceholder,
  ErrorText
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
              {console.log('Datos completos de la evaluación:', selectedEvaluation)}
              {console.log('Campos de imagen disponibles:', {
                fotopach: selectedEvaluation.fotopach,
                fotopath: selectedEvaluation.fotopath,
                firmapach: selectedEvaluation.firmapach,
                firmapath: selectedEvaluation.firmapath
              })}
              <OperatorPhotoContainer>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    <OperatorNameHeader>
                      <OperatorTitle variant="h3" component="h1">
                        {selectedEvaluation.polinizador}
                      </OperatorTitle>
                    </OperatorNameHeader>
                    
                    <Grid container spacing={0}>
                      <Grid item xs={12}>
                        <PhotoBox>
                      {/* Verificar ambos campos posibles para la foto */}
                      {(selectedEvaluation.fotopach || selectedEvaluation.fotopath) ? (
                        <>
                          {console.log('URL de la foto (fotopach):', selectedEvaluation.fotopach)}
                          {console.log('URL de la foto (fotopath):', selectedEvaluation.fotopath)}
                          {console.log('URL que se usará:', selectedEvaluation.fotopach || selectedEvaluation.fotopath)}
                          <PhotoContainer>
                            <OperatorPhoto 
                              src={selectedEvaluation.fotopach || selectedEvaluation.fotopath} 
                              alt="Foto del operario" 
                              onError={(e) => {
                                console.error('Error al cargar la imagen:', e);
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                // Mostrar el placeholder si hay error
                                e.target.parentNode.parentNode.querySelector('.photo-error-placeholder').style.display = 'flex';
                              }}
                            />
                            <PhotoOverlay>
                              <OverlayText variant="h6">
                                {selectedEvaluation.polinizador}
                              </OverlayText>
                            </PhotoOverlay>
                          </PhotoContainer>
                          <PhotoErrorPlaceholder className="photo-error-placeholder">
                            <FaUserAlt size={40} />
                            <ErrorText variant="caption">
                              No se pudo cargar la imagen
                            </ErrorText>
                          </PhotoErrorPlaceholder>
                        </>
                      ) : (
                        <PhotoPlaceholder>
                          <FaUserAlt size={50} />
                        </PhotoPlaceholder>
                      )}
                        </PhotoBox>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ mb: 3 }} />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaIdCard /> Información General
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="subtitle2" color="text.secondary">ID Evaluación</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>EvalGen-{selectedEvaluation.id}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="subtitle2" color="text.secondary">Semana</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>Semana {selectedEvaluation.semana}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FaCalendar size={14} /> Fecha
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{selectedEvaluation.fecha}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FaClock size={14} /> Hora
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{selectedEvaluation.hora}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="subtitle2" color="text.secondary">Evaluador</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{selectedEvaluation.evaluador}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="subtitle2" color="text.secondary">Polinizador</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{selectedEvaluation.polinizador}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" color="text.secondary">Eventos</Typography>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                  {selectedEvaluation.evaluacionesPolinizacion?.length || 0}
                                </Typography>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={Math.min((selectedEvaluation.evaluacionesPolinizacion?.length || 0) * 10, 100)} 
                                  sx={{ 
                                    flexGrow: 1, 
                                    height: 8, 
                                    borderRadius: 5,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: '#4caf50'
                                    }
                                  }} 
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaUserAlt /> Firma
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            height: '180px'
                          }}>
                           {(selectedEvaluation.firmapach || selectedEvaluation.firmapath) ? (
                            <img 
                              src={selectedEvaluation.firmapach || selectedEvaluation.firmapath} 
                              alt="Firma del operario" 
                              style={{
                                maxWidth: '80%',
                                maxHeight: '160px'
                              }}
                              onError={(e) => {
                                console.error('Error al cargar la firma:', e);
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No hay firma disponible
                            </Typography>
                          )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  
                  <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                      </Grid>
                      <Grid item xs={12} md={6}>
                      </Grid>
                    </Grid>
                    
                    {/* Placeholder for spacing */}
                    <Box sx={{ mt: 'auto' }}></Box>
                  </Grid>
                </Grid>
              </OperatorPhotoContainer>
              
              {selectedEvaluation.evaluacionesPolinizacion?.length > 0 && (
                <Card style={{marginTop: '20px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
                <CardContent style={{padding: '16px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center'}}>
                  <div style={{marginRight: '8px', color: '#2e7d32'}}>
                    <FaChartBar />
                  </div>
                  <Typography variant="h5" style={{margin: 0, fontWeight: 'bold', color: '#2e7d32'}}>
                    Métricas de Polinización
                  </Typography>
                </CardContent>
                <CardContent style={{padding: '24px'}}>
                  {(() => {
                    const metricas = calcularMetricasPolinizacion(selectedEvaluation.evaluacionesPolinizacion);
                    
                    // Reorganized according to specified layout with max limits
                    const progressData = [
                      // Line 1: Antesis Dejadas, Post Antesis Dejadas
                      { label: 'Antesis Dejadas', value: metricas.porcentajeAntesisDejadas, maxValue: 15, color: '#4caf50', row: 1, order: 1 },
                      { label: 'Post Antesis Dejadas', value: metricas.porcentajePostAntesisDejadas, maxValue: 10, color: '#2196f3', row: 1, order: 2 },
                      // Line 2: Espate, Aplicación, Marcación
                      { label: 'Espate', value: metricas.porcentajeEspate, maxValue: 30, color: '#ff9800', row: 2, order: 1 },
                      { label: 'Aplicación', value: metricas.porcentajeAplicacion, maxValue: 30, color: '#9c27b0', row: 2, order: 2 },
                      { label: 'Marcación', value: metricas.porcentajeMarcacion, maxValue: 5, color: '#f44336', row: 2, order: 3 },
                      // Line 3: Repaso 1, Repaso 2
                      { label: 'Repaso 1', value: metricas.porcentajeRepaso1, maxValue: 5, color: '#3f51b5', row: 3, order: 1 },
                      { label: 'Repaso 2', value: metricas.porcentajeRepaso2, maxValue: 5, color: '#009688', row: 3, order: 2 }
                    ];
                    
                    return (
                      <>
                        {/* Métricas de Rendimiento */}
                        <Typography variant="h5" style={{marginBottom: '40px', marginTop: '10px', fontWeight: 'bold', color: '#2e7d32', textAlign: 'center'}}>
                          Rendimiento de Polinización
                        </Typography>
                        
                        <Grid container spacing={6} justifyContent="center">
                          {/* Fila de tarjetas de métricas */}
                          <Grid item xs={12}>
                            <Grid container spacing={3} justifyContent="center">
                              {/* Tarjeta de rendimiento total */}
                              <Grid item xs={12} sm={4} md={4} lg={3}>
                                <Box 
                                  sx={{
                                    backgroundColor: '#f5f5f5',
                                    padding: 2,
                                    borderRadius: 2,
                                    textAlign: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '6px',
                                    background: 'linear-gradient(90deg, #4caf50, #2196f3, #ff9800, #f44336)'
                                  }}></div>
                                  <Typography variant="h3" style={{fontWeight: 'bold', color: '#2e7d32', marginBottom: '8px', marginTop: '8px', textAlign: 'center'}}>
                                    {metricas.total.toFixed(2)}%
                                  </Typography>
                                  <Chip 
                                    label="Rendimiento Global"
                                    color="success"
                                    sx={{ 
                                      fontSize: '0.85rem', 
                                      fontWeight: 'bold', 
                                      height: 28, 
                                      background: 'linear-gradient(90deg, #4caf50, #2e7d32)',
                                      margin: '0 auto'
                                    }}
                                  />
                                </Box>
                              </Grid>

                              {/* Proporcionalidad Antesis */}
                              <Grid item xs={12} sm={4} md={4} lg={3}>
                                <Box 
                                  sx={{
                                    backgroundColor: '#f5f5f5',
                                    padding: 2,
                                    borderRadius: 2,
                                    textAlign: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '6px',
                                    background: 'linear-gradient(90deg, #4caf50, #81c784)'
                                  }}></div>
                                  <Typography variant="h3" style={{fontWeight: 'bold', color: '#4caf50', marginBottom: '8px', marginTop: '8px', textAlign: 'center'}}>
                                    {metricas.proporcionalidadAntesis.toFixed(2)}%
                                  </Typography>
                                  <Chip 
                                    label="Proporcionalidad Antesis"
                                    sx={{ 
                                      fontSize: '0.85rem', 
                                      fontWeight: 'bold', 
                                      height: 28, 
                                      background: 'linear-gradient(90deg, #4caf50, #2e7d32)',
                                      color: 'white',
                                      margin: '0 auto'
                                    }}
                                  />
                                </Box>
                              </Grid>
                              
                              {/* Proporcionalidad Post-Antesis */}
                              <Grid item xs={12} sm={4} md={4} lg={3}>
                                <Box 
                                  sx={{
                                    backgroundColor: '#f5f5f5',
                                    padding: 2,
                                    borderRadius: 2,
                                    textAlign: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '6px',
                                    background: 'linear-gradient(90deg, #2196f3, #64b5f6)'
                                  }}></div>
                                  <Typography variant="h3" style={{fontWeight: 'bold', color: '#2196f3', marginBottom: '8px', marginTop: '8px', textAlign: 'center'}}>
                                    {metricas.proporcionalidadPostAntesis.toFixed(2)}%
                                  </Typography>
                                  <Chip 
                                    label="Proporcionalidad Post-Antesis"
                                    sx={{ 
                                      fontSize: '0.85rem', 
                                      fontWeight: 'bold', 
                                      height: 28, 
                                      background: 'linear-gradient(90deg, #2196f3, #1565c0)',
                                      color: 'white',
                                      margin: '0 auto'
                                    }}
                                  />
                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>
                          
                          {/* Indicadores de rendimiento */}
                          <Grid item xs={12} sx={{ mt: 6, mb: 2 }}>
                            <Typography variant="h6" style={{marginBottom: '20px', fontWeight: '500', color: '#424242'}}>
                              Porcentajes por Indicador
                            </Typography>
                            
                            <Grid container spacing={4} sx={{ margin: '0 -8px' }}>
                              {/* First row - Antesis Dejadas, Post Antesis Dejadas */}
                              <Grid item xs={12} sx={{ mb: 2 }}>
                                <Grid container spacing={3} justifyContent="center">
                                  {progressData.filter(item => item.row === 1).sort((a, b) => a.order - b.order).map((item) => {
                                  const value = parseFloat(item.value || 0);
                                  
                                  return (
                                    <Grid item xs={12} sm={6} md={6} key={item.label} sx={{ padding: '12px' }}>
                                    <Box sx={{
                                      backgroundColor: 'white',
                                      padding: '22px',
                                      borderRadius: '12px',
                                      boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
                                      margin: '4px',
                                      border: '1px solid #f0f0f0',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      height: '100%'
                                    }}>
                                      <Box sx={{display: 'flex', flexDirection: 'column', marginBottom: 2}}>
                                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2}}>
                                          <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <span style={{
                                              display: 'inline-block',
                                              width: '12px',
                                              height: '12px',
                                              backgroundColor: item.color,
                                              borderRadius: '50%',
                                              marginRight: '8px'
                                            }}></span>
                                            <Typography variant="body1" sx={{color: '#424242', fontWeight: '500'}}>
                                              {item.label}
                                            </Typography>
                                          </Box>
                                          <Typography variant="body1" sx={{fontWeight: 'bold', marginLeft: '16px'}}>
                                            {value.toFixed(2)} %
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <LinearProgress 
                                        variant="determinate" 
                                        value={Math.min((value / item.maxValue) * 100, 100)} 
                                        sx={{
                                          height: 6, 
                                          borderRadius: 3,
                                          backgroundColor: '#f0f0f0',
                                          '& .MuiLinearProgress-bar': {
                                            backgroundColor: item.color
                                          }
                                        }}
                                      />
                                    </Box>
                                  </Grid>
                                );
                                  })}
                                </Grid>
                              </Grid>
                              
                              {/* Second row - Espate, Aplicación, Marcación */}
                              <Grid item xs={12} sx={{ mt: 4 }}>
                                <Grid container spacing={0}>
                                  {progressData.filter(item => item.row === 2).sort((a, b) => a.order - b.order).map((item) => {
                                  const value = parseFloat(item.value || 0);
                                  
                                  return (
                                      <Grid item xs={12} sm={6} md={6} key={item.label} sx={{ padding: '12px' }}>
                                      <Box sx={{
                                        backgroundColor: 'white',
                                        padding: '22px',
                                        borderRadius: '12px',
                                        boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
                                        margin: 0,
                                        border: '1px solid #f0f0f0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%'
                                      }}>
                                        <Box sx={{display: 'flex', flexDirection: 'column', marginBottom: 2}}>
                                          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2}}>
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                              <span style={{
                                                display: 'inline-block',
                                                width: '12px',
                                                height: '12px',
                                                backgroundColor: item.color,
                                                borderRadius: '50%',
                                                marginRight: '8px'
                                              }}></span>
                                              <Typography variant="body1" sx={{color: '#424242', fontWeight: '500'}}>
                                                {item.label}
                                              </Typography>
                                            </Box>
                                            <Typography variant="body1" sx={{fontWeight: 'bold', marginLeft: '16px'}}>
                                              {value.toFixed(2)} %
                                            </Typography>
                                          </Box>
                                        </Box>
                                        <LinearProgress 
                                          variant="determinate" 
                                          value={Math.min((value / item.maxValue) * 100, 100)} 
                                          sx={{
                                            height: 6, 
                                            borderRadius: 3,
                                            backgroundColor: '#f0f0f0',
                                            '& .MuiLinearProgress-bar': {
                                              backgroundColor: item.color
                                            }
                                          }}
                                        />
                                      </Box>
                                    </Grid>
                                  );
                                  })}
                                </Grid>
                              </Grid>
                              
                              {/* Third row - Repaso 1, Repaso 2 */}
                              <Grid item xs={12} sx={{ mt: 4 }}>
                                <Grid container spacing={0}>
                                  {progressData.filter(item => item.row === 3).sort((a, b) => a.order - b.order).map((item) => {
                                  const value = parseFloat(item.value || 0);
                                  
                                  return (
                                      <Grid item xs={12} sm={6} md={6} key={item.label} sx={{ padding: '12px' }}>
                                      <Box sx={{
                                        backgroundColor: 'white',
                                        padding: '22px',
                                        borderRadius: '12px',
                                        boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
                                        margin: 0,
                                        border: '1px solid #f0f0f0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%'
                                      }}>
                                        <Box sx={{display: 'flex', flexDirection: 'column', marginBottom: 2}}>
                                          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2}}>
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                              <span style={{
                                                display: 'inline-block',
                                                width: '12px',
                                                height: '12px',
                                                backgroundColor: item.color,
                                                borderRadius: '50%',
                                                marginRight: '8px'
                                              }}></span>
                                              <Typography variant="body1" sx={{color: '#424242', fontWeight: '500'}}>
                                                {item.label}
                                              </Typography>
                                            </Box>
                                            <Typography variant="body1" sx={{fontWeight: 'bold', marginLeft: '16px'}}>
                                              {value.toFixed(2)} %
                                            </Typography>
                                          </Box>
                                        </Box>
                                        <LinearProgress 
                                          variant="determinate" 
                                          value={Math.min((value / item.maxValue) * 100, 100)} 
                                          sx={{
                                            height: 6, 
                                            borderRadius: 3,
                                            backgroundColor: '#f0f0f0',
                                            '& .MuiLinearProgress-bar': {
                                              backgroundColor: item.color
                                            }
                                          }}
                                        />
                                      </Box>
                                    </Grid>
                                  );
                                  })}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          
                          {/* Sumas de métricas */}
                          <Grid item xs={12} sx={{ mt: 6, mb: 2 }}>
                            <Typography variant="h6" style={{marginBottom: '20px', fontWeight: '500', color: '#424242'}}>
                              Valores Totales
                            </Typography>
                            
                            <Grid container spacing={4} sx={{ margin: '0 -8px' }}>
                              {[
                                { label: 'Total Eventos', value: metricas.sumaEventos, color: '#4caf50' },
                                { label: 'Suma Antesis', value: metricas.sumaAntesis, color: '#2196f3' },
                                { label: 'Suma Post Antesis', value: metricas.sumaPostAntesis, color: '#3f51b5' },
                                { label: 'Suma Antesis Dejadas', value: metricas.sumaAntesisDejadas, color: '#009688' },
                                { label: 'Suma Post Antesis Dejadas', value: metricas.sumaPostAntesisDejadas, color: '#ff9800' },
                                { label: 'Suma Inflorescencia', value: metricas.sumaInflorescencia, color: '#9c27b0' },
                                { label: 'Suma Aplicación', value: metricas.sumaAplicacion, color: '#f44336' },
                                { label: 'Suma Marcación', value: metricas.sumaMarcacion, color: '#795548' },
                                { label: 'Suma Espate', value: metricas.sumaEspate, color: '#607d8b' },
                                { label: 'Suma Repaso 1', value: metricas.sumaRepaso1, color: '#8bc34a' },
                                { label: 'Suma Repaso 2', value: metricas.sumaRepaso2, color: '#ffc107' }
                              ].map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item.label} sx={{ padding: '12px' }}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      backgroundColor: 'white',
                                      padding: '24px',
                                      borderRadius: 2,
                                      boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
                                      transition: 'transform 0.2s, box-shadow 0.2s',
                                      '&:hover': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                                      },
                                      position: 'relative',
                                      overflow: 'hidden',
                                      border: '1px solid #f0f0f0',
                                      margin: '4px'
                                    }}
                                  >
                                    <div style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '4px',
                                      backgroundColor: item.color
                                    }}></div>
                                    
                                    <Typography variant="h4" style={{color: item.color, fontWeight: 'bold', marginBottom: '10px'}}>
                                      {item.value}
                                    </Typography>
                                    
                                    <Typography variant="body2" style={{color: '#666', textAlign: 'center', padding: '0 5px'}}>
                                      {item.label}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
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