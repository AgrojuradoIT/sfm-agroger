import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Rating,
  Card,
  CardContent,
  Grid,
  IconButton,
  CircularProgress,
  Divider,
  LinearProgress
} from '@mui/material';
import { 
  FaArrowLeft, 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserAlt,
  FaStar,
  FaClipboardList,
  FaChartBar,
  FaTags,
  FaRegStar,
  FaCalendarCheck,
  FaBuilding
} from 'react-icons/fa';
import fincaService from '../services/fincaService';
import { calcularMetricasPolinizacion } from '../utils/calculosPolinizacion';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const HistorialOperario = () => {
  const { operarioId, nombreOperario } = useParams();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setLoading(true);
        const response = await fincaService.getHistorialOperario(operarioId);
        const historialOrdenado = (response.evaluaciones || []).sort((a, b) => {
          try {
            const [diaA, mesA, anioA] = a.fecha.split('/').map(Number);
            const [diaB, mesB, anioB] = b.fecha.split('/').map(Number);
            const dateA = new Date(anioA, mesA - 1, diaA);
            const dateB = new Date(anioB, mesB - 1, diaB);
            return dateB - dateA;
          } catch (e) {
            return 0;
          }
        });
        setHistorial(historialOrdenado);
        setMensaje(response.mensaje || '');
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar historial:', err);
        setError('No se pudo cargar el historial del operario');
        setLoading(false);
      }
    };

    if (operarioId) {
      cargarHistorial();
    } else {
      setError('ID de operario no encontrado en la URL.');
      setLoading(false);
    }
  }, [operarioId]);

  const volver = () => {
    navigate(-1);
  };

  const formatearFecha = (fecha) => {
    return fecha || 'N/A';
  };

  const calcularMetricasPromedio = (evaluaciones) => {
    if (!evaluaciones || evaluaciones.length === 0) return null;
    
    let metricasAcumuladas = {
      porcentajeAntesisDejadas: 0,
      porcentajePostAntesisDejadas: 0,
      porcentajeEspate: 0,
      porcentajeAplicacion: 0,
      porcentajeMarcacion: 0,
      porcentajeRepaso1: 0,
      porcentajeRepaso2: 0,
      rendimientoTotal: 0
    };
    
    let evaluacionesConMetricas = 0;
    
    evaluaciones.forEach(evaluacion => {
      if (evaluacion.evaluacionesPolinizacion && evaluacion.evaluacionesPolinizacion.length > 0) {
        const metricas = calcularMetricasPolinizacion(evaluacion.evaluacionesPolinizacion);
        
        if (metricas) {
          metricasAcumuladas.porcentajeAntesisDejadas += parseFloat(metricas.porcentajeAntesisDejadas || 0);
          metricasAcumuladas.porcentajePostAntesisDejadas += parseFloat(metricas.porcentajePostAntesisDejadas || 0);
          metricasAcumuladas.porcentajeEspate += parseFloat(metricas.porcentajeEspate || 0);
          metricasAcumuladas.porcentajeAplicacion += parseFloat(metricas.porcentajeAplicacion || 0);
          metricasAcumuladas.porcentajeMarcacion += parseFloat(metricas.porcentajeMarcacion || 0);
          metricasAcumuladas.porcentajeRepaso1 += parseFloat(metricas.porcentajeRepaso1 || 0);
          metricasAcumuladas.porcentajeRepaso2 += parseFloat(metricas.porcentajeRepaso2 || 0);
          metricasAcumuladas.rendimientoTotal += parseFloat(metricas.total || 0); 
          evaluacionesConMetricas++;
        }
      }
    });
    
    if (evaluacionesConMetricas > 0) {
      Object.keys(metricasAcumuladas).forEach(key => {
        metricasAcumuladas[key] = (metricasAcumuladas[key] / evaluacionesConMetricas).toFixed(1);
      });
      return metricasAcumuladas;
    }
    
    return null;
  };

  // Función auxiliar para obtener la sección de una evaluación
  const getSeccion = (evaluacion) => {
    if (!evaluacion) return null;
    if (evaluacion.seccion) return evaluacion.seccion;
    if (evaluacion.evaluacionesPolinizacion && 
        evaluacion.evaluacionesPolinizacion.length > 0 &&
        evaluacion.evaluacionesPolinizacion[0].seccion) {
      return evaluacion.evaluacionesPolinizacion[0].seccion;
    }
    return null;
  };

  // Función para obtener la sección más frecuente
  const getSeccionFrecuente = (evaluaciones) => {
    const conteo = {};
    evaluaciones.forEach(ev => {
      const seccion = getSeccion(ev);
      if (seccion) conteo[seccion] = (conteo[seccion] || 0) + 1;
    });
    const max = Object.entries(conteo).reduce((a, b) => (a[1] > b[1] ? a : b), [null, 0]);
    return max[0] || 'N/A';
  };

  // Calcular los rendimientos globales para todas las evaluaciones
  const rendimientos = historial.map(ev => {
    const metricas = calcularMetricasPolinizacion(ev.evaluacionesPolinizacion || []);
    return metricas ? parseFloat(metricas.total) : 0;
  });
  const tieneMenorA50 = rendimientos.some(r => r < 50);

  // Datos para la gráfica de barras de rendimiento global por fecha
  const chartData = {
    labels: historial.map(ev => formatearFecha(ev.fecha)),
    datasets: [
      {
        label: 'Rendimiento Global',
        data: historial.map(ev => {
          const metricas = calcularMetricasPolinizacion(ev.evaluacionesPolinizacion || []);
          return metricas ? parseFloat(metricas.total) : 0;
        }),
        backgroundColor: 'rgba(33, 150, 243, 0.6)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Rendimiento Global por Fecha' },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      x: {
        type: 'number',
        easing: 'linear',
        duration: 2000,
        from: NaN,
        delay(ctx) {
          return ctx.index * 150;
        }
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: 2000,
        from: NaN,
        delay(ctx) {
          return ctx.index * 150;
        }
      }
    },
    scales: {
      y: {
        min: tieneMenorA50 ? 0 : 50,
        max: 110,
        ticks: {
          stepSize: 10,
          callback: function(value) {
            return value <= 100 ? value : '';
          }
        },
        grace: 0
      },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 4 } }}>
        <IconButton 
          onClick={volver} 
          aria-label="volver"
          sx={{ 
            mr: { xs: 1, md: 2 }, 
            color: 'text.secondary',
            bgcolor: 'action.hover',
            p: { xs: 1, md: 2 }
          }}
        >
          <FaArrowLeft />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '1.3rem', sm: '2rem' } }}>
          Hoja de Vida - {nombreOperario}
        </Typography>
      </Box>

      {mensaje && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: 'warning.light', 
            border: '1px solid',
            borderColor: 'warning.main',
            color: 'warning.dark',
            borderRadius: 1
          }}
        >
          <Typography variant="body2">{mensaje}</Typography>
        </Paper>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            backgroundColor: 'error.light',
            border: '1px solid',
            borderColor: 'error.main',
            color: 'error.dark',
            borderRadius: 1
          }}
        >
          <Typography variant="h6" gutterBottom>Error</Typography>
          <Typography>{error}</Typography>
          <Button 
            variant="contained" 
            color="error" 
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </Paper>
      )}

      {!loading && !error && (
        <>
          {/* DASHBOARD CARDS */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2 }, textAlign: 'center', borderRadius: 2 }}>
                <FaTags size={28} color="#1976d2" />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Total Evaluaciones</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{historial.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2 }, textAlign: 'center', borderRadius: 2 }}>
                <FaCalendarCheck size={28} color="#388e3c" />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Última Evaluación</Typography>
                <Typography variant="h6" sx={{ color: '#388e3c' }}>{historial.length > 0 ? formatearFecha(historial[0].fecha) : 'N/A'}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2 }, textAlign: 'center', borderRadius: 2 }}>
                <FaBuilding size={28} color="#5e35b1" />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Finca Principal</Typography>
                <Typography variant="h6" sx={{ color: '#5e35b1' }}>{historial.length > 0 ? historial[0]?.finca?.descripcion || 'N/A' : 'N/A'}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2 }, textAlign: 'center', borderRadius: 2 }}>
                <FaClipboardList size={28} color="#009688" />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Sección más frecuente</Typography>
                <Typography variant="h6" sx={{ color: '#009688' }}>{getSeccionFrecuente(historial)}</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* GRÁFICA DE RENDIMIENTO GLOBAL POR FECHA */}
          <Paper elevation={2} sx={{ p: { xs: 1, md: 3 }, mb: 4, borderRadius: 2, width: '100%', overflowX: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', md: '1.25rem' }, textAlign: { xs: 'center', md: 'left' } }}>Rendimiento Global (Línea de Tiempo)</Typography>
            <Box sx={{ width: '100%', minWidth: { xs: 220, sm: 350, md: 500 }, maxWidth: '100vw' }}>
              <Line data={chartData} options={chartOptions} style={{ width: '100%', height: 'auto', maxWidth: '100vw' }} />
            </Box>
          </Paper>

          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <FaClipboardList style={{ marginRight: '12px', color: 'primary.main' }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 500, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
              Historial de Evaluaciones
            </Typography>
          </Box>

          {historial.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50', border: '1px dashed', borderColor: 'divider' }}>
              <Typography variant="h6" color="text.secondary">
                No hay evaluaciones registradas para este operario
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} elevation={1} sx={{ border: '1px solid', borderColor: 'divider', width: '100%', overflowX: 'auto', maxWidth: '100vw' }}>
              <Table sx={{ minWidth: { xs: 400, sm: 650 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Finca</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Lote</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Sección</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Evaluador</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Rendimiento Global</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Observaciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historial.map((evaluacion) => (
                    <TableRow 
                      key={evaluacion.id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'action.hover' },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaCalendarAlt style={{ color: 'grey.500' }} />
                          {formatearFecha(evaluacion.fecha)}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaMapMarkerAlt style={{ color: 'grey.500' }} />
                          {evaluacion.finca?.descripcion || 'N/A'}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                        {evaluacion.lote?.descripcion || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>{getSeccion(evaluacion) || 'N/A'}</TableCell>
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                        {evaluacion.evaluador?.nombre || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>
                        {(() => {
                          const metricas = calcularMetricasPolinizacion(evaluacion.evaluacionesPolinizacion || []);
                          return metricas ? metricas.total + '%' : 'N/A';
                        })()}
                      </TableCell>
                      <TableCell sx={{ py: { xs: 0.5, sm: 1 } }}>{evaluacion.observaciones || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Container>
  );
};

export default HistorialOperario; 