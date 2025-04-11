import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaAngleRight, FaCalendarAlt, FaUser, FaExclamationTriangle, FaCalendar, FaClock, FaIdCard, FaUserAlt, FaChartBar, FaTimes, FaListAlt, FaFileExcel } from 'react-icons/fa';
import { Card, CardContent, Typography, Grid, LinearProgress, Box, Chip, Divider, Paper, Button, Modal, Tooltip } from '@mui/material';
import { styles } from '../styles/FincaDetail.styles';
import '../styles/animations.css';
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
  ErrorText,
  SignatureContainer,
  SignatureImage,
  NoSignatureText
} from '../styles/FincaDetail.styles';
import fincaService from '../services/fincaService';
import * as XLSX from 'xlsx';
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
  const [modalAbierto, setModalAbierto] = useState(false);
  
  // Efecto para animar las barras de progreso cuando son visibles
  useEffect(() => {
    if (!isLoading && selectedEvaluation) {
      // Crear un Intersection Observer para detectar cuando las barras son visibles
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            // Cuando la barra entra en el viewport, añadir la clase para animar
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('animate');
              }, 200);
              // Dejar de observar una vez que se ha animado
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 } // Activar cuando al menos el 20% de la barra es visible
      );
      
      // Observar todas las barras de progreso
      const progressBars = document.querySelectorAll('.progress-bar-animated');
      progressBars.forEach(bar => {
        observer.observe(bar);
      });
      
      return () => {
        // Limpiar el observer cuando el componente se desmonte o cambie
        progressBars.forEach(bar => {
          observer.unobserve(bar);
        });
      };
    }
  }, [isLoading, selectedEvaluation]);

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

  const exportToExcel = () => {
    try {
      // Verificar que haya una evaluación seleccionada
      if (!selectedEvaluation) {
        console.error('No hay evaluación seleccionada para exportar');
        alert('Seleccione una evaluación para exportar a Excel');
        return;
      }
      
      console.log('Exportando evaluación seleccionada a Excel:', selectedEvaluation);
      
      // Crear un array para los datos a exportar
      const datosParaExportar = [];
      
      // Verificar si la evaluación seleccionada tiene evaluaciones de polinización
      if (selectedEvaluation.evaluacionesPolinizacion && selectedEvaluation.evaluacionesPolinizacion.length > 0) {
        // Para cada evaluación de polinización, crear una fila en el Excel
        selectedEvaluation.evaluacionesPolinizacion.forEach((evaluacion, index) => {
          // Depuración detallada de los campos problemáticos
          console.log(`Evaluación #${index+1} - Campos importantes:`);
          console.log('antesisDejadas:', evaluacion.antesisDejadas);
          console.log('postantesis:', evaluacion.postantesis);
          console.log('postantesisDejadas:', evaluacion.postantesisDejadas);
          
          // Crear objeto para exportar con verificación de campos
          const filaExcel = {
            'Fecha': selectedEvaluation.fecha || '',
            'Hora': selectedEvaluation.hora || '',
            'Semana': selectedEvaluation.semana || '',
            'Ubicación': evaluacion.ubicacion || '',
            'Lote': evaluacion.lote || selectedEvaluation.lote || '',
            'Sección': evaluacion.seccion || '',
            'Palma': evaluacion.palma || '',
            'Inflorescencia': evaluacion.inflorescencia || '0',
            'Antesis': evaluacion.antesis || '0',
            'Antesis Dejadas': evaluacion.antesisDejadas || '0',
            'Post Antesis': evaluacion.postantesis || '0',
            'Post Antesis Dejadas': evaluacion.postantesisDejadas || '0',
            'Espate': evaluacion.espate || '0',
            'Aplicación': evaluacion.aplicacion || '0',
            'Marcación': evaluacion.marcacion || '0',
            'Repaso 1': evaluacion.repaso1 || '0',
            'Repaso 2': evaluacion.repaso2 || '0',
            'Observaciones': evaluacion.observaciones || '-',
            'Evaluador': selectedEvaluation.evaluador || selectedEvaluation.polinizador || '',
            'Foto URL': selectedEvaluation.fotopach || '',
            'Firma URL': selectedEvaluation.firmapach || ''
          };
          
          // Verificar que los campos problemáticos estén presentes
          console.log('Campos en la fila Excel:', {
            'Antesis Dejadas': filaExcel['Antesis Dejadas'],
            'Post Antesis': filaExcel['Post Antesis'],
            'Post Antesis Dejadas': filaExcel['Post Antesis Dejadas']
          });
          
          datosParaExportar.push(filaExcel);
        });
      } else {
        // Si no tiene evaluaciones de polinización, exportar la evaluación principal
        console.log('Exportando evaluación principal (sin evaluaciones de polinización)');
        console.log('Campos importantes:');
        console.log('antesisDejadas:', selectedEvaluation.antesisDejadas);
        console.log('postantesis:', selectedEvaluation.postantesis);
        console.log('postantesisDejadas:', selectedEvaluation.postantesisDejadas);
        
        datosParaExportar.push({
          'Fecha': selectedEvaluation.fecha || '',
          'Hora': selectedEvaluation.hora || '',
          'Semana': selectedEvaluation.semana || '',
          'Ubicación': selectedEvaluation.ubicacion || '',
          'Lote': selectedEvaluation.lote || '',
          'Sección': selectedEvaluation.seccion || '',
          'Palma': selectedEvaluation.palma || '',
          'Inflorescencia': selectedEvaluation.inflorescencia || '0',
          'Antesis': selectedEvaluation.antesis || '0',
          'Antesis Dejadas': selectedEvaluation.antesisDejadas || '0',
          'Post Antesis': selectedEvaluation.postantesis || '0',
          'Post Antesis Dejadas': selectedEvaluation.postantesisDejadas || '0',
          'Espate': selectedEvaluation.espate || '0',
          'Aplicación': selectedEvaluation.aplicacion || '0',
          'Marcación': selectedEvaluation.marcacion || '0',
          'Repaso 1': selectedEvaluation.repaso1 || '0',
          'Repaso 2': selectedEvaluation.repaso2 || '0',
          'Observaciones': selectedEvaluation.observaciones || '-',
          'Evaluador': selectedEvaluation.evaluador || selectedEvaluation.polinizador || '',
          'Foto URL': selectedEvaluation.fotopach || '',
          'Firma URL': selectedEvaluation.firmapach || ''
        });
      }
      
      console.log('Datos preparados para exportar:', datosParaExportar);
      
      if (datosParaExportar.length === 0) {
        console.error('No hay datos detallados para exportar');
        alert('No hay datos detallados disponibles para exportar');
        return;
      }
      
      const worksheet = XLSX.utils.json_to_sheet(datosParaExportar);
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Evaluaciones');
      
      // Crear nombre del archivo con la fecha de la evaluación
      const nombreArchivo = `evaluacion_${selectedEvaluation.fecha.replace(/\//g, '-')}_${FINCA_ID_MAP[id?.toLowerCase()]}.xlsx`;
      
      console.log('Guardando archivo:', nombreArchivo);
      XLSX.writeFile(workbook, nombreArchivo);
      console.log('Archivo Excel exportado correctamente');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Error al exportar datos: ' + error.message);
    }
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
                    <Grid container spacing={0}>
                      <Grid item xs={12}>
                        <PhotoBox sx={{ marginTop: '20px' }}>
                      {/* Verificar ambos campos posibles para la foto */}
                      {(selectedEvaluation.fotopach || selectedEvaluation.fotopath) ? (
                        <>
                          {console.log('URL de la foto (fotopach):', selectedEvaluation.fotopach)}
                          {console.log('URL de la foto (fotopath):', selectedEvaluation.fotopath)}
                          {console.log('URL que se usará:', selectedEvaluation.fotopach || selectedEvaluation.fotopath)}
                          <PhotoContainer>
                            <OperatorPhoto>
                              <img 
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
                            </OperatorPhoto>
                            <PhotoOverlay>
                              <OverlayText 
                                variant="h4" 
                                sx={styles.overlayText}
                              >
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
                  
                  <Grid item xs={12} md={6} style={{marginLeft: '20px', marginRight: '20px', width: 'calc(100% - 40px)'}}>
                    <Card elevation={2} sx={styles.infoCard}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={styles.infoCardTitle}>
                          <FaIdCard /> Información General
                        </Typography>
                        <Box sx={styles.infoCardContent}>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Tooltip title="Dar click para ver eventos" arrow placement="top">
                                <Button
                                  variant="contained"
                                  onClick={() => setModalAbierto(true)}
                                  sx={{
                                    ...styles.eventosButton,
                                    height: '100%',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    padding: '12px',
                                    background: 'linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                      transform: 'translateY(-2px)'
                                    },
                                    '&::before': {
                                      content: '""',
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '6px',
                                      background: 'linear-gradient(90deg, #4caf50, #81c784)'
                                    }
                                  }}
                                >
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                    <FaListAlt style={{ fontSize: '24px', color: '#4caf50', marginBottom: '8px' }} />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32', marginBottom: '8px', textAlign: 'center' }}>
                                      {selectedEvaluation.evaluacionesPolinizacion?.length || 0}
                                    </Typography>
                                    <Chip 
                                      label="Eventos"
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
                                </Button>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="subtitle2" color="text.secondary">ID Evaluación</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>EvalGen-{selectedEvaluation.id}</Typography>
                              <Typography variant="subtitle2" color="text.secondary">Polinizador</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{selectedEvaluation.polinizador}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="subtitle2" color="text.secondary">Evaluador</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{selectedEvaluation.evaluador}</Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card style={{marginTop: '20px', marginLeft: '20px', marginRight: '20px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: 'calc(100% - 40px)'}}>
                      <CardContent style={{padding: '16px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center'}}>
                        <div style={{marginRight: '8px', color: '#2e7d32'}}>
                          <FaUserAlt />
                        </div>
                        <Typography variant="h5" style={{margin: 0, fontWeight: 'bold', color: '#2e7d32'}}>
                          Firma Del Operario
                        </Typography>
                      </CardContent>
                      <CardContent style={{padding: '24px'}}>
                        <SignatureContainer>
                          {(selectedEvaluation.firmapach || selectedEvaluation.firmapath) ? (
                            <SignatureImage>
                              <img 
                                src={selectedEvaluation.firmapach || selectedEvaluation.firmapath} 
                                alt="Firma del operario" 
                                onError={(e) => {
                                  console.error('Error al cargar la firma:', e);
                                  e.target.style.display = 'none';
                                }}
                              />
                            </SignatureImage>
                          ) : (
                            <NoSignatureText variant="body2">
                              No hay firma disponible
                            </NoSignatureText>
                          )}
                        </SignatureContainer>
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
                <CardContent style={{padding: '16px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center'}}>
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
                                  className="progress-box-animated"
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
                                    justifyContent: 'center',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                      transform: 'translateY(-5px)',
                                      boxShadow: '0 6px 12px rgba(0,0,0,0.12)'
                                    }
                                  }}
                                >
                                  <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '8px',
                                    background: 'linear-gradient(90deg, #4caf50, #81c784)',
                                    boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)'
                                  }}></div>
                                  <Typography 
                                    variant="h3" 
                                    className="percentage-animated"
                                    sx={{
                                      color: '#4caf50', 
                                      fontWeight: 'bold', 
                                      marginBottom: '10px',
                                      position: 'relative',
                                      overflow: 'hidden',
                                      display: 'inline-block',
                                      '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, #ffffff80, transparent)',
                                        animation: 'shimmer 3s infinite',
                                        transform: 'translateX(-100%)'
                                      },
                                      '@keyframes shimmer': {
                                        '100%': {
                                          transform: 'translateX(100%)'
                                        }
                                      }
                                    }}
                                  >
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
                                      margin: '0 auto',
                                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                      '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                      }
                                    }}
                                  />
                                </Box>
                              </Grid>
                              
                              {/* Proporcionalidad Post-Antesis */}
                              <Grid item xs={12} sm={4} md={4} lg={3}>
                                <Box 
                                  className="progress-box-animated"
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
                                    justifyContent: 'center',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                      transform: 'translateY(-5px)',
                                      boxShadow: '0 6px 12px rgba(0,0,0,0.12)'
                                    }
                                  }}
                                >
                                  <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '8px',
                                    background: 'linear-gradient(90deg, #2196f3, #64b5f6)',
                                    boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)'
                                  }}></div>
                                  <Typography 
                                    variant="h3" 
                                    className="percentage-animated"
                                    sx={{
                                      color: '#2196f3', 
                                      fontWeight: 'bold', 
                                      marginBottom: '8px',
                                      marginTop: '8px',
                                      textAlign: 'center',
                                      position: 'relative',
                                      overflow: 'hidden',
                                      display: 'inline-block',
                                      '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, #ffffff80, transparent)',
                                        animation: 'shimmer 3s infinite',
                                        transform: 'translateX(-100%)'
                                      }
                                    }}
                                  >
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
                                      margin: '0 auto',
                                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                      '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                      }
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
                                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                      margin: '0',
                                      border: 'none',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      height: '100%',
                                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                      '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 6px 12px rgba(0,0,0,0.12)'
                                      }
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
                                              marginRight: '8px',
                                              boxShadow: `0 0 0 3px ${item.color}20`,
                                              transition: 'transform 0.3s ease',
                                              animation: 'pulse 3s infinite'
                                            }}></span>
                                            <Typography variant="body1" sx={{color: '#424242', fontWeight: '500'}}>
                                              {item.label}
                                            </Typography>
                                          </Box>
                                          <Typography 
                                            variant="body1" 
                                            sx={{
                                              fontWeight: 'bold', 
                                              marginLeft: '16px',
                                              color: item.color,
                                              transition: 'transform 0.3s ease, color 0.3s ease',
                                              '&:hover': {
                                                transform: 'scale(1.1)',
                                                color: `${item.color}dd`
                                              }
                                            }}
                                          >
                                            {value.toFixed(2)} %
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <LinearProgress 
                                        variant="determinate" 
                                        value={Math.min((value / item.maxValue) * 100, 100)} 
                                        className="progress-bar-animated"
                                        sx={{
                                          height: 8, 
                                          borderRadius: 4,
                                          backgroundColor: '#f0f0f0',
                                          '& .MuiLinearProgress-bar': {
                                            backgroundColor: item.color,
                                            backgroundImage: `linear-gradient(90deg, ${item.color}aa, ${item.color})`,
                                            animation: 'slideIn 4s ease-out',
                                            boxShadow: `0 0 10px ${item.color}80`
                                          },
                                          '@keyframes slideIn': {
                                            '0%': {
                                              width: '0%',
                                              opacity: 0.7
                                            },
                                            '100%': {
                                              width: `${Math.min((value / item.maxValue) * 100, 100)}%`,
                                              opacity: 1
                                            }
                                          },
                                          '@keyframes pulse': {
                                            '0%': {
                                              boxShadow: `0 0 0 0 ${item.color}70`
                                            },
                                            '70%': {
                                              boxShadow: `0 0 0 6px ${item.color}00`
                                            },
                                            '100%': {
                                              boxShadow: `0 0 0 0 ${item.color}00`
                                            }
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
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        margin: 0,
                                        border: 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                          transform: 'translateY(-5px)',
                                          boxShadow: '0 6px 12px rgba(0,0,0,0.12)'
                                        }
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
                                                marginRight: '8px',
                                                boxShadow: `0 0 0 3px ${item.color}20`,
                                                transition: 'transform 0.3s ease',
                                                animation: 'pulse 3s infinite'
                                              }}></span>
                                              <Typography variant="body1" sx={{color: '#424242', fontWeight: '500'}}>
                                                {item.label}
                                              </Typography>
                                            </Box>
                                            <Typography 
                                              variant="body1" 
                                              sx={{
                                                fontWeight: 'bold', 
                                                marginLeft: '16px',
                                                color: item.color,
                                                transition: 'transform 0.3s ease, color 0.3s ease',
                                                '&:hover': {
                                                  transform: 'scale(1.1)',
                                                  color: `${item.color}dd`
                                                }
                                              }}
                                            >
                                              {value.toFixed(2)} %
                                            </Typography>
                                          </Box>
                                        </Box>
                                        <LinearProgress 
                                          variant="determinate" 
                                          value={Math.min((value / item.maxValue) * 100, 100)} 
                                          className="progress-bar-animated"
                                          sx={{
                                            height: 8, 
                                            borderRadius: 4,
                                            backgroundColor: '#f0f0f0',
                                            '& .MuiLinearProgress-bar': {
                                              backgroundColor: item.color,
                                              backgroundImage: `linear-gradient(90deg, ${item.color}aa, ${item.color})`,
                                              animation: 'none',
                                              width: '0%',
                                              boxShadow: `0 0 10px ${item.color}80`,
                                              transition: 'width 2.5s ease-out'
                                            },
                                            '&.animate .MuiLinearProgress-bar': {
                                              width: `${Math.min((value / item.maxValue) * 100, 100)}%`
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
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        margin: 0,
                                        border: 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                          transform: 'translateY(-5px)',
                                          boxShadow: '0 6px 12px rgba(0,0,0,0.12)'
                                        }
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
                                                marginRight: '8px',
                                                boxShadow: `0 0 0 3px ${item.color}20`,
                                                transition: 'transform 0.3s ease',
                                                animation: 'pulse 3s infinite'
                                              }}></span>
                                              <Typography variant="body1" sx={{color: '#424242', fontWeight: '500'}}>
                                                {item.label}
                                              </Typography>
                                            </Box>
                                            <Typography 
                                              variant="body1" 
                                              sx={{
                                                fontWeight: 'bold', 
                                                marginLeft: '16px',
                                                color: item.color,
                                                transition: 'transform 0.3s ease, color 0.3s ease',
                                                '&:hover': {
                                                  transform: 'scale(1.1)',
                                                  color: `${item.color}dd`
                                                }
                                              }}
                                            >
                                              {value.toFixed(2)} %
                                            </Typography>
                                          </Box>
                                        </Box>
                                        <LinearProgress 
                                          variant="determinate" 
                                          value={Math.min((value / item.maxValue) * 100, 100)} 
                                          className="progress-bar-animated"
                                          sx={{
                                            height: 8, 
                                            borderRadius: 4,
                                            backgroundColor: '#f0f0f0',
                                            '& .MuiLinearProgress-bar': {
                                              backgroundColor: item.color,
                                              backgroundImage: `linear-gradient(90deg, ${item.color}aa, ${item.color})`,
                                              animation: 'none',
                                              width: '0%',
                                              boxShadow: `0 0 10px ${item.color}80`,
                                              transition: 'width 2.5s ease-out'
                                            },
                                            '&.animate .MuiLinearProgress-bar': {
                                              width: `${Math.min((value / item.maxValue) * 100, 100)}%`
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
                          <Grid item xs={12} sx={styles.metricsContainer}>
                            <Typography variant="h6" style={styles.sectionTitle}>
                              Valores Totales
                            </Typography>
                            
                            {/* LÍNEA 1: Total Eventos - Suma Inflorescencia - Eventos Repaso 1 - Eventos Repaso 2 */}
                            <Grid container spacing={2} sx={styles.metricsRow}>
                              {[
                                { label: 'Total Eventos', value: metricas.sumaEventos, color: '#4caf50' },
                                { label: 'Inflorescencia', value: metricas.sumaInflorescencia, color: '#9c27b0' },
                                { label: 'Eventos Repaso 1', value: metricas.EventosRepaso1, color: '#3f51b5' },
                                { label: 'Eventos Repaso 2', value: metricas.EventosRepaso2, color: '#009688' }
                              ].map((item) => (
                                <Grid item xs={6} sm={3} md={3} key={item.label} sx={styles.metricsItemContainer}>
                                  <Box
                                    sx={styles.valoresTotalesCard}
                                  >
                                    <div style={{
                                      ...styles.valoresTotalesColorBar,
                                      backgroundColor: item.color
                                    }}></div>
                                    
                                    <Typography variant="h4" style={{
                                      ...styles.valoresTotalesValue,
                                      color: item.color
                                    }}>
                                      {item.value}
                                    </Typography>
                                    
                                    <Typography variant="body2" style={{
                                      ...styles.valoresTotalesLabel,
                                      color: item.color
                                    }}>
                                      {item.label}
                                    </Typography>
                                    

                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                            
                            {/* LÍNEA 2: Suma Antesis - Suma Post Antesis - Suma Antesis Dejadas - Suma Post Antesis Dejadas */}
                            <Grid container spacing={2} sx={styles.metricsRow}>
                              {[
                                { label: 'Antesis', value: metricas.sumaAntesis, color: '#2196f3' },
                                { label: 'Post Antesis', value: metricas.sumaPostAntesis, color: '#3f51b5' },
                                { label: 'Antesis Dejadas', value: metricas.sumaAntesisDejadas, color: '#009688' },
                                { label: 'Post Antesis Dejadas', value: metricas.sumaPostAntesisDejadas, color: '#ff9800' }
                              ].map((item) => (
                                <Grid item xs={6} sm={3} md={3} key={item.label} sx={styles.metricsItemContainer}>
                                  <Box
                                    sx={styles.valoresTotalesCard}
                                  >
                                    <div style={{
                                      ...styles.valoresTotalesColorBar,
                                      backgroundColor: item.color
                                    }}></div>
                                    
                                    <Typography variant="h4" style={{
                                      ...styles.valoresTotalesValue,
                                      color: item.color
                                    }}>
                                      {item.value}
                                    </Typography>
                                    
                                    <Typography variant="body2" style={{
                                      ...styles.valoresTotalesLabel,
                                      color: item.color
                                    }}>
                                      {item.label}
                                    </Typography>
                                    

                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                            
                            {/* LÍNEA 3: Suma Aplicación - Suma Marcación - Suma Espate */}
                            <Grid container spacing={2} sx={styles.metricsRow}>
                              {[
                                { label: 'Aplicación', value: metricas.sumaAplicacion, color: '#f44336' },
                                { label: 'Marcación', value: metricas.sumaMarcacion, color: '#795548' },
                                { label: 'Espate', value: metricas.sumaEspate, color: '#607d8b' }
                              ].map((item) => (
                                <Grid item xs={6} sm={4} md={4} key={item.label} sx={styles.metricsItemContainer}>
                                  <Box
                                    sx={styles.valoresTotalesCard}
                                  >
                                    <div style={{
                                      ...styles.valoresTotalesColorBar,
                                      backgroundColor: item.color
                                    }}></div>
                                    
                                    <Typography variant="h4" style={{
                                      ...styles.valoresTotalesValue,
                                      color: item.color
                                    }}>
                                      {item.value}
                                    </Typography>
                                    
                                    <Typography variant="body2" style={{
                                      ...styles.valoresTotalesLabel,
                                      color: item.color
                                    }}>
                                      {item.label}
                                    </Typography>
                                    

                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                            
                            {/* LÍNEA 4: Suma Repaso 1 - Suma Repaso 2 */}
                            <Grid container spacing={2} sx={styles.metricsRow}>
                              {[
                                { label: 'Repaso 1', value: metricas.sumaRepaso1, color: '#8bc34a' },
                                { label: 'Repaso 2', value: metricas.sumaRepaso2, color: '#ffc107' }
                              ].map((item) => (
                                <Grid item xs={6} sm={6} md={6} key={item.label} sx={styles.metricsItemContainer}>
                                  <Box
                                    sx={styles.valoresTotalesCard}
                                  >
                                    <div style={{
                                      ...styles.valoresTotalesColorBar,
                                      backgroundColor: item.color
                                    }}></div>
                                    
                                    <Typography variant="h4" style={{
                                      ...styles.valoresTotalesValue,
                                      color: item.color
                                    }}>
                                      {item.value}
                                    </Typography>
                                    
                                    <Typography variant="body2" style={{
                                      ...styles.valoresTotalesLabel,
                                      color: item.color
                                    }}>
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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
        <Button 
          variant="contained" 
          onClick={exportToExcel}
          startIcon={<FaFileExcel />}
        >
          Exportar a Excel
        </Button>
      </Box>

      {/* Modal para mostrar la tabla de eventos */}
      <Modal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        aria-labelledby="modal-eventos-titulo"
        aria-describedby="modal-eventos-descripcion"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '80%',
          bgcolor: 'background.paper',
          border: '1px solid #ddd',
          boxShadow: 24,
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Box sx={styles.eventosModalHeader}>
            <Typography variant="h6" sx={styles.eventosModalTitle}>
              Eventos de Evaluación
            </Typography>
            <Button
              onClick={() => setModalAbierto(false)}
              variant="text"
              size="small"
              sx={styles.eventosModalCloseButton}
            >
              <FaTimes style={{ fontSize: '18px' }} />
            </Button>
          </Box>
          
          <Box sx={styles.eventosModalContent}>
            <Box sx={styles.eventosModalTableContainer}>
              <table style={styles.eventosTable}>
                <thead>
                  <tr style={styles.eventosTableHeaderRow}>
                    <th style={styles.eventosTableHeaderCell}>Fecha</th>
                    <th style={styles.eventosTableHeaderCell}>Hora</th>
                    <th style={styles.eventosTableHeaderCell}>Semana</th>
                    <th style={styles.eventosTableHeaderCell}>Ubicación</th>
                    <th style={styles.eventosTableHeaderCellWide}>Lote</th>
                    <th style={styles.eventosTableHeaderCell}>Sección</th>
                    <th style={styles.eventosTableHeaderCell}>Palma</th>
                    <th style={styles.eventosTableHeaderCell}>Inflorescencia</th>
                    <th style={styles.eventosTableHeaderCell}>Antesis</th>
                    <th style={styles.eventosTableHeaderCell}>Antesis Dejadas</th>
                    <th style={styles.eventosTableHeaderCell}>Post Antesis</th>
                    <th style={styles.eventosTableHeaderCell}>Post Antesis Dejadas</th>
                    <th style={styles.eventosTableHeaderCell}>Espate</th>
                    <th style={styles.eventosTableHeaderCell}>Aplicación</th>
                    <th style={styles.eventosTableHeaderCell}>Marcación</th>
                    <th style={styles.eventosTableHeaderCell}>Repaso 1</th>
                    <th style={styles.eventosTableHeaderCell}>Repaso 2</th>
                    <th style={styles.eventosTableHeaderCell}>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEvaluation && selectedEvaluation.evaluacionesPolinizacion && selectedEvaluation.evaluacionesPolinizacion.map((evaluacion, index) => (
                    <tr key={index} style={{ ...styles.eventosTableRowAlternate, backgroundColor: index % 2 === 0 ? 'white' : '#f8f8f8' }}>
                      <td style={styles.eventosTableDataCell}>{selectedEvaluation.fecha}</td>
                      <td style={styles.eventosTableDataCell}>{selectedEvaluation.hora}</td>
                      <td style={styles.eventosTableDataCell}>{selectedEvaluation.semana}</td>
                      <td style={styles.eventosTableDataCell}>{evaluacion.ubicacion || '-'}</td>
                      <td style={styles.eventosTableDataCellWide}>{evaluacion.lote || selectedEvaluation.lote || '-'}</td>
                      <td style={styles.eventosTableDataCell}>{evaluacion.seccion || '-'}</td>
                      <td style={styles.eventosTableDataCell}>{evaluacion.palma || '-'}</td>
                      <td style={{ ...styles.eventosTableDataCell, color: evaluacion.inflorescencia > 0 ? '#2e7d32' : 'inherit' }}>{evaluacion.inflorescencia === 0 ? '0' : evaluacion.inflorescencia || ''}</td>
                      <td style={{ ...styles.eventosTableDataCell, color: evaluacion.antesis > 0 ? '#2e7d32' : 'inherit' }}>{evaluacion.antesis === 0 ? '0' : evaluacion.antesis || ''}</td>
                      <td style={{ ...styles.eventosTableDataCell, color: evaluacion.antesisDejadas > 0 ? '#2e7d32' : 'inherit' }}>{evaluacion.antesisDejadas === 0 ? '0' : evaluacion.antesisDejadas || ''}</td>
                      <td style={{ ...styles.eventosTableDataCell, color: evaluacion.postantesis > 0 ? '#2e7d32' : 'inherit' }}>{evaluacion.postantesis === 0 ? '0' : evaluacion.postantesis || ''}</td>
                      <td style={{ ...styles.eventosTableDataCell, color: evaluacion.postantesisDejadas > 0 ? '#2e7d32' : 'inherit' }}>{evaluacion.postantesisDejadas === 0 ? '0' : evaluacion.postantesisDejadas || ''}</td>
                      <td style={{ ...styles.eventosTableDataCell, color: evaluacion.espate > 0 ? '#2e7d32' : 'inherit' }}>{evaluacion.espate === 0 ? '0' : evaluacion.espate || ''}</td>
                      <td style={{ ...styles.eventosTableDataCell, color: evaluacion.aplicacion > 0 ? '#2e7d32' : 'inherit' }}>{evaluacion.aplicacion === 0 ? '0' : evaluacion.aplicacion || ''}</td>
                      <td style={{ ...styles.eventosTableDataCell, color: evaluacion.marcacion > 0 ? '#2e7d32' : 'inherit' }}>{evaluacion.marcacion === 0 ? '0' : evaluacion.marcacion || ''}</td>
                      <td style={{ ...styles.eventosTableDataCell, color: evaluacion.repaso1 > 0 ? '#2e7d32' : 'inherit' }}>{evaluacion.repaso1 === 0 ? '0' : evaluacion.repaso1 || ''}</td>
                      <td style={{ ...styles.eventosTableDataCell, color: evaluacion.repaso2 > 0 ? '#2e7d32' : 'inherit' }}>{evaluacion.repaso2 === 0 ? '0' : evaluacion.repaso2 || ''}</td>
                      <td style={styles.eventosTableDataCellLeft}>{evaluacion.observaciones || '-'}</td>
                    </tr>
                  ))}
                  {(!selectedEvaluation || !selectedEvaluation.evaluacionesPolinizacion || selectedEvaluation.evaluacionesPolinizacion.length === 0) && (
                    <tr>
                      <td colSpan="18" style={styles.eventosTableNoDataCell}>
                        No hay datos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Box>
          </Box>
          
          {/* Add export button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
            <Button 
              variant="contained" 
              onClick={exportToExcel}
              startIcon={<FaFileExcel />}
              sx={styles.actionButton}
            >
              Exportar a Excel
            </Button>
          </Box>
          
        </Box>
      </Modal>
    </>
  );
};

export default FincaDetail;