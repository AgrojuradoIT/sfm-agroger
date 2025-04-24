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
  LinearProgress,
  Collapse,
  Tooltip,
  Chip,
  Avatar
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
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaLeaf,
  FaChartPie,
  FaPercentage,
  FaCheckCircle,
  FaTimesCircle,
  FaSeedling
} from 'react-icons/fa';
import { MdRadar } from 'react-icons/md';
import fincaService from '../services/fincaService';
import { calcularMetricasPolinizacion } from '../utils/calculosPolinizacion';
import { Line, Radar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { motion } from 'framer-motion';

const HistorialOperario = () => {
  const { operarioId, nombreOperario } = useParams();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);

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

  // Calcular métricas globales promedio y totales
  const metricasGlobales = React.useMemo(() => {
    let acumuladas = {
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
      total: 0,
      EventosRepaso1: 0,
      EventosRepaso2: 0
    };
    let count = 0;
    historial.forEach(ev => {
      if (ev.evaluacionesPolinizacion && ev.evaluacionesPolinizacion.length > 0) {
        const m = calcularMetricasPolinizacion(ev.evaluacionesPolinizacion);
        Object.keys(acumuladas).forEach(k => {
          acumuladas[k] += parseFloat(m[k] || 0);
        });
        count++;
      }
    });
    if (count > 0) {
      // Promediar los porcentajes y totales
      [
        'porcentajeAntesisDejadas', 'porcentajePostAntesisDejadas', 'porcentajeEspate', 'porcentajeAplicacion',
        'porcentajeMarcacion', 'porcentajeRepaso1', 'porcentajeRepaso2', 'proporcionalidadAntesis',
        'proporcionalidadPostAntesis', 'total'
      ].forEach(k => {
        acumuladas[k] = (acumuladas[k] / count).toFixed(1);
      });
    }
    return { ...acumuladas, count };
  }, [historial]);

  const handleExpandRow = (id) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  };

  // Paleta de colores para las métricas
  const metricColors = {
    porcentajeAntesisDejadas: '#1976d2',
    porcentajePostAntesisDejadas: '#388e3c',
    porcentajeEspate: '#fbc02d',
    porcentajeAplicacion: '#0288d1',
    porcentajeMarcacion: '#8e24aa',
    porcentajeRepaso1: '#009688',
    porcentajeRepaso2: '#e64a19',
    proporcionalidadAntesis: '#43a047',
    proporcionalidadPostAntesis: '#ffa000',
    total: '#1565c0',
  };

  // Función para limitar los porcentajes según su máximo teórico
  const limite = (valor, max) => Math.min(Number(valor), max);

  // Función para obtener color de barra según cercanía al límite
  const barraColor = (valor, max) => {
    const porcentaje = valor / max;
    if (porcentaje >= 0.99) return '#d32f2f'; // Rojo fuerte si está en el límite
    if (porcentaje >= 0.9) return '#fbc02d'; // Amarillo si está cerca del límite
    return undefined; // Color por defecto
  };

  // Datos para la gráfica radar
  const radarData = {
    labels: [
      'Antesis Dejadas',
      'Post-Antesis Dejadas',
      'Espate',
      'Aplicación',
      'Marcación',
      'Repaso 1',
      'Repaso 2',
    ],
    datasets: [
      {
        label: 'Promedio % Actividad',
        data: [
          limite(metricasGlobales.porcentajeAntesisDejadas, 15),
          limite(metricasGlobales.porcentajePostAntesisDejadas, 10),
          limite(metricasGlobales.porcentajeEspate, 30),
          limite(metricasGlobales.porcentajeAplicacion, 30),
          limite(metricasGlobales.porcentajeMarcacion, 5),
          limite(metricasGlobales.porcentajeRepaso1, 5),
          limite(metricasGlobales.porcentajeRepaso2, 5),
        ],
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderColor: '#1976d2',
        pointBackgroundColor: '#1976d2',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#1976d2',
      },
      {
        label: 'Límite',
        data: [15, 10, 30, 30, 5, 5, 5],
        backgroundColor: 'rgba(211,47,47,0.10)',
        borderColor: '#d32f2f',
        borderDash: [2, 2],
        borderWidth: 4,
        pointBackgroundColor: '#d32f2f',
        pointBorderColor: '#fff',
        pointRadius: 7,
      }
    ],
  };
  const radarOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Promedio de Porcentajes por Actividad', color: '#1976d2', font: { size: 16 } },
    },
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 30,
        pointLabels: { color: '#333', font: { size: 13 } },
        ticks: { color: '#1976d2', stepSize: 5 }
      }
    }
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
            <Grid item xs={12} sm={12} md={4}>
              <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2 }, textAlign: 'center', borderRadius: 2 }}>
                <FaTags size={28} color="#1976d2" />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Total Evaluaciones</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{historial.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2 }, textAlign: 'center', borderRadius: 2 }}>
                <FaCalendarCheck size={28} color="#388e3c" />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Última Evaluación</Typography>
                <Typography variant="h6" sx={{ color: '#388e3c' }}>{historial.length > 0 ? formatearFecha(historial[0].fecha) : 'N/A'}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2 }, textAlign: 'center', borderRadius: 2 }}>
                <FaBuilding size={28} color="#5e35b1" />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Finca Principal</Typography>
                <Typography variant="h6" sx={{ color: '#5e35b1' }}>{historial.length > 0 ? historial[0]?.finca?.descripcion || 'N/A' : 'N/A'}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
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

          {/* TARJETAS DE RESUMEN AGRUPADAS */}
          {!loading && !error && historial.length > 0 && (
            <Grid container spacing={1} sx={{ mb: 3 }} alignItems="flex-start">
              <Grid item xs={12} md={4}>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 3, mb: 2, bgcolor: '#e3f2fd' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>Rendimiento y Proporcionalidad</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <Avatar sx={{ bgcolor: metricColors.total, mr: 1 }}><FaChartPie /></Avatar>
                          </motion.div>
                          <Typography variant="subtitle2">Rendimiento Global</Typography>
                        </Box>
                        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                          <Typography variant="h5" sx={{ color: metricColors.total, fontWeight: 'bold' }}>{limite(metricasGlobales.total, 100)}%</Typography>
                        </motion.div>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${100 * (limite(parseFloat(metricasGlobales.total), 100) / 100)}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ overflow: 'hidden' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={100 * (limite(parseFloat(metricasGlobales.total), 100) / 100)} 
                            sx={{ height: 8, borderRadius: 5, bgcolor: '#bbdefb', mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: barraColor(limite(parseFloat(metricasGlobales.total), 100), 100) || metricColors.total } }}
                          />
                        </motion.div>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                              <Avatar sx={{ bgcolor: metricColors.proporcionalidadAntesis, mr: 1 }}><MdRadar /></Avatar>
                            </motion.div>
                            <Typography variant="subtitle2">Proporcionalidad Antesis</Typography>
                          </Box>
                          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <Typography variant="h5" sx={{ color: metricColors.proporcionalidadAntesis, fontWeight: 'bold' }}>{limite(metricasGlobales.proporcionalidadAntesis, 100)}%</Typography>
                          </motion.div>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${100 * (limite(parseFloat(metricasGlobales.proporcionalidadAntesis), 100) / 100)}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ overflow: 'hidden', width: '100%' }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={100 * (limite(parseFloat(metricasGlobales.proporcionalidadAntesis), 100) / 100)} 
                              sx={{ height: 8, borderRadius: 5, bgcolor: '#c8e6c9', mt: 1, width: '100%', '& .MuiLinearProgress-bar': { backgroundColor: barraColor(limite(parseFloat(metricasGlobales.proporcionalidadAntesis), 100), 100) || metricColors.proporcionalidadAntesis } }}
                            />
                          </motion.div>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                              <Avatar sx={{ bgcolor: metricColors.proporcionalidadPostAntesis, mr: 1 }}><MdRadar /></Avatar>
                            </motion.div>
                            <Typography variant="subtitle2">Proporcionalidad Post-Antesis</Typography>
                          </Box>
                          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <Typography variant="h5" sx={{ color: metricColors.proporcionalidadPostAntesis, fontWeight: 'bold' }}>{limite(metricasGlobales.proporcionalidadPostAntesis, 100)}%</Typography>
                          </motion.div>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${100 * (limite(parseFloat(metricasGlobales.proporcionalidadPostAntesis), 100) / 100)}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ overflow: 'hidden', width: '100%' }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={100 * (limite(parseFloat(metricasGlobales.proporcionalidadPostAntesis), 100) / 100)} 
                              sx={{ height: 8, borderRadius: 5, bgcolor: '#ffe0b2', mt: 1, width: '100%', '& .MuiLinearProgress-bar': { backgroundColor: barraColor(limite(parseFloat(metricasGlobales.proporcionalidadPostAntesis), 100), 100) || metricColors.proporcionalidadPostAntesis } }}
                            />
                          </motion.div>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
                {/* Segundo grupo */}
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 3, mb: 2, bgcolor: '#e1f5fe' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#0288d1', mb: 2 }}>Dejadas</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <Avatar sx={{ bgcolor: metricColors.porcentajeAntesisDejadas, mr: 1 }}><FaLeaf /></Avatar>
                          </motion.div>
                          <Typography variant="subtitle2">Antesis Dejadas</Typography>
                        </Box>
                        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                          <Typography variant="h5" sx={{ color: metricColors.porcentajeAntesisDejadas, fontWeight: 'bold' }}>{limite(metricasGlobales.porcentajeAntesisDejadas, 15)}%</Typography>
                        </motion.div>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${100 * (limite(metricasGlobales.porcentajeAntesisDejadas, 15) / 15)}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ overflow: 'hidden' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={100 * (limite(metricasGlobales.porcentajeAntesisDejadas, 15) / 15)} 
                            sx={{ height: 8, borderRadius: 5, bgcolor: '#bbdefb', mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: barraColor(limite(metricasGlobales.porcentajeAntesisDejadas, 15), 15) || metricColors.porcentajeAntesisDejadas } }}
                          />
                        </motion.div>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <Avatar sx={{ bgcolor: metricColors.porcentajePostAntesisDejadas, mr: 1 }}><FaLeaf /></Avatar>
                          </motion.div>
                          <Typography variant="subtitle2">Post Antesis Dejadas</Typography>
                        </Box>
                        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                          <Typography variant="h5" sx={{ color: metricColors.porcentajePostAntesisDejadas, fontWeight: 'bold' }}>{limite(metricasGlobales.porcentajePostAntesisDejadas, 10)}%</Typography>
                        </motion.div>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${100 * (limite(metricasGlobales.porcentajePostAntesisDejadas, 10) / 10)}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ overflow: 'hidden' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={100 * (limite(metricasGlobales.porcentajePostAntesisDejadas, 10) / 10)} 
                            sx={{ height: 8, borderRadius: 5, bgcolor: '#c8e6c9', mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: barraColor(limite(metricasGlobales.porcentajePostAntesisDejadas, 10), 10) || metricColors.porcentajePostAntesisDejadas } }}
                          />
                        </motion.div>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
                {/* Tercer grupo */}
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 3, mb: 2, bgcolor: '#fffde7' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fbc02d', mb: 2 }}>Actividades</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <Avatar sx={{ bgcolor: metricColors.porcentajeEspate, mr: 1 }}><FaSeedling /></Avatar>
                          </motion.div>
                          <Typography variant="subtitle2">Espate</Typography>
                        </Box>
                        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                          <Typography variant="h5" sx={{ color: metricColors.porcentajeEspate, fontWeight: 'bold' }}>{limite(metricasGlobales.porcentajeEspate, 30)}%</Typography>
                        </motion.div>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${100 * (limite(metricasGlobales.porcentajeEspate, 30) / 30)}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ overflow: 'hidden' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={100 * (limite(metricasGlobales.porcentajeEspate, 30) / 30)} 
                            sx={{ height: 8, borderRadius: 5, bgcolor: '#fff9c4', mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: barraColor(limite(metricasGlobales.porcentajeEspate, 30), 30) || metricColors.porcentajeEspate } }}
                          />
                        </motion.div>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <Avatar sx={{ bgcolor: metricColors.porcentajeAplicacion, mr: 1 }}><FaChartPie /></Avatar>
                          </motion.div>
                          <Typography variant="subtitle2">Aplicación</Typography>
                        </Box>
                        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                          <Typography variant="h5" sx={{ color: metricColors.porcentajeAplicacion, fontWeight: 'bold' }}>{limite(metricasGlobales.porcentajeAplicacion, 30)}%</Typography>
                        </motion.div>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${100 * (limite(metricasGlobales.porcentajeAplicacion, 30) / 30)}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ overflow: 'hidden' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={100 * (limite(metricasGlobales.porcentajeAplicacion, 30) / 30)} 
                            sx={{ height: 8, borderRadius: 5, bgcolor: '#b3e5fc', mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: barraColor(limite(metricasGlobales.porcentajeAplicacion, 30), 30) || metricColors.porcentajeAplicacion } }}
                          />
                        </motion.div>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <Avatar sx={{ bgcolor: metricColors.porcentajeMarcacion, mr: 1 }}><FaChartPie /></Avatar>
                          </motion.div>
                          <Typography variant="subtitle2">Marcación</Typography>
                        </Box>
                        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                          <Typography variant="h5" sx={{ color: metricColors.porcentajeMarcacion, fontWeight: 'bold' }}>{limite(metricasGlobales.porcentajeMarcacion, 5)}%</Typography>
                        </motion.div>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${100 * (limite(metricasGlobales.porcentajeMarcacion, 5) / 5)}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ overflow: 'hidden' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={100 * (limite(metricasGlobales.porcentajeMarcacion, 5) / 5)} 
                            sx={{ height: 8, borderRadius: 5, bgcolor: '#ede7f6', mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: barraColor(limite(metricasGlobales.porcentajeMarcacion, 5), 5) || metricColors.porcentajeMarcacion } }}
                          />
                        </motion.div>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
                {/* Cuarto grupo */}
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 3, bgcolor: '#f3e5f5' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#8e24aa', mb: 2 }}>Repasos</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <Avatar sx={{ bgcolor: metricColors.porcentajeRepaso1, mr: 1 }}><FaChartPie /></Avatar>
                          </motion.div>
                          <Typography variant="subtitle2">Repaso 1</Typography>
                        </Box>
                        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                          <Typography variant="h5" sx={{ color: metricColors.porcentajeRepaso1, fontWeight: 'bold' }}>{limite(metricasGlobales.porcentajeRepaso1, 5)}%</Typography>
                        </motion.div>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${100 * (limite(metricasGlobales.porcentajeRepaso1, 5) / 5)}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ overflow: 'hidden' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={100 * (limite(metricasGlobales.porcentajeRepaso1, 5) / 5)} 
                            sx={{ height: 8, borderRadius: 5, bgcolor: '#b2dfdb', mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: barraColor(limite(metricasGlobales.porcentajeRepaso1, 5), 5) || metricColors.porcentajeRepaso1 } }}
                          />
                        </motion.div>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <Avatar sx={{ bgcolor: metricColors.porcentajeRepaso2, mr: 1 }}><FaChartPie /></Avatar>
                          </motion.div>
                          <Typography variant="subtitle2">Repaso 2</Typography>
                        </Box>
                        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                          <Typography variant="h5" sx={{ color: metricColors.porcentajeRepaso2, fontWeight: 'bold' }}>{limite(metricasGlobales.porcentajeRepaso2, 5)}%</Typography>
                        </motion.div>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${100 * (limite(metricasGlobales.porcentajeRepaso2, 5) / 5)}%` }} transition={{ duration: 1, delay: 0.3 }} style={{ overflow: 'hidden' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={100 * (limite(metricasGlobales.porcentajeRepaso2, 5) / 5)} 
                            sx={{ height: 8, borderRadius: 5, bgcolor: '#ffccbc', mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: barraColor(limite(metricasGlobales.porcentajeRepaso2, 5), 5) || metricColors.porcentajeRepaso2 } }}
                          />
                        </motion.div>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={{
                  width: '100%',
                  minHeight: 500,
                  height: 500,
                  maxWidth: { xs: '100%', md: 1200 },
                  p: 0,
                  borderRadius: 3,
                  bgcolor: '#f3e5f5',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Radar data={radarData} options={radarOptions} style={{ width: '100%', height: '100%' }} />
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* RESUMEN GENERAL DE MÉTRICAS */}
          {!loading && !error && historial.length > 0 && (
            <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: 2, background: '#f5f7fa' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                Resumen General de Métricas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Total de Eventos</Typography>
                  <Typography variant="h5">{metricasGlobales.sumaEventos}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Total Inflorescencias</Typography>
                  <Typography variant="h5">{metricasGlobales.sumaInflorescencia}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Proporcionalidad Antesis</Typography>
                  <Typography variant="h5">{limite(metricasGlobales.proporcionalidadAntesis, 100)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Proporcionalidad Post-Antesis</Typography>
                  <Typography variant="h5">{limite(metricasGlobales.proporcionalidadPostAntesis, 100)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">% Antesis Dejadas</Typography>
                  <Typography variant="h5">{limite(metricasGlobales.porcentajeAntesisDejadas, 15)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">% Post-Antesis Dejadas</Typography>
                  <Typography variant="h5">{limite(metricasGlobales.porcentajePostAntesisDejadas, 10)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">% Espate</Typography>
                  <Typography variant="h5">{limite(metricasGlobales.porcentajeEspate, 30)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">% Aplicación</Typography>
                  <Typography variant="h5">{limite(metricasGlobales.porcentajeAplicacion, 30)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">% Marcación</Typography>
                  <Typography variant="h5">{limite(metricasGlobales.porcentajeMarcacion, 5)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">% Repaso 1</Typography>
                  <Typography variant="h5">{limite(metricasGlobales.porcentajeRepaso1, 5)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">% Repaso 2</Typography>
                  <Typography variant="h5">{limite(metricasGlobales.porcentajeRepaso2, 5)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2">Rendimiento Global Promedio</Typography>
                  <Typography variant="h5">{limite(metricasGlobales.total, 100)}%</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

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
            <TableContainer component={Paper} elevation={1} sx={{ border: '1px solid', borderColor: 'divider', width: '100%', overflowX: { xs: 'auto', md: 'visible' }, maxWidth: '100vw', bgcolor: '#f8fafc', minWidth: { xs: 350, md: 650 } }}>
              <Table sx={{ minWidth: { xs: 350, md: 650 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell />
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Fecha
                      <Tooltip title="Fecha de la evaluación"><FaInfoCircle style={{ marginLeft: 4, color: '#888' }} /></Tooltip>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Finca</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Lote</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Sección</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Evaluador</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>Rendimiento Global
                      <Tooltip title="Suma ponderada de todos los porcentajes"><FaInfoCircle style={{ marginLeft: 4, color: '#888' }} /></Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historial.map((evaluacion, idx) => {
                    const metricas = calcularMetricasPolinizacion(evaluacion.evaluacionesPolinizacion || []);
                    const isExpanded = expandedRows.includes(evaluacion.id);
                    // Badge color según rendimiento
                    let badgeColor = 'default';
                    if (metricas.total >= 90) badgeColor = 'success';
                    else if (metricas.total >= 70) badgeColor = 'primary';
                    else if (metricas.total >= 50) badgeColor = 'warning';
                    else badgeColor = 'error';
                    return (
                      <React.Fragment key={evaluacion.id}>
                        <TableRow 
                          sx={{ 
                            backgroundColor: idx % 2 === 0 ? '#f1f8e9' : '#fff',
                            transition: 'background 0.3s',
                            '&:hover': { backgroundColor: '#e3f2fd' },
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell>
                            <IconButton size="small" onClick={() => handleExpandRow(evaluacion.id)}>
                              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </IconButton>
                          </TableCell>
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
                            <Chip
                              label={metricas ? Number(metricas.total).toFixed(2) + '%' : 'N/A'}
                              color={badgeColor}
                              icon={
                                badgeColor === 'success' ? <FaCheckCircle style={{ color: '#43a047' }} /> :
                                badgeColor === 'primary' ? <FaChartPie style={{ color: '#1976d2' }} /> :
                                badgeColor === 'warning' ? <FaPercentage style={{ color: '#fbc02d' }} /> :
                                <FaTimesCircle style={{ color: '#e53935' }} />
                              }
                              sx={{ fontWeight: 'bold', fontSize: '1rem', px: 1.5, bgcolor: '#232323', color: '#fff' }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                            <Collapse in={isExpanded} timeout={400} unmountOnExit>
                              <Box margin={2} sx={{ background: '#f3e5f5', borderRadius: 2, p: 2, boxShadow: 1, transition: 'all 0.4s' }}>
                                <Typography variant="subtitle2" gutterBottom sx={{ color: '#6a1b9a' }}>Métricas detalladas de la evaluación</Typography>
                                <Grid container spacing={2}>
                                  {/* Primer grupo */}
                                  <Grid item xs={12} md={6} lg={3}>
                                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
                                      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd' }}>
                                        <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 1 }}>Rendimiento y Proporcionalidad</Typography>
                                        <div><b>Rendimiento Global:</b> {limite(metricas.total, 100).toFixed(1)}%</div>
                                        <div><b>Proporcionalidad Antesis:</b> {limite(metricas.proporcionalidadAntesis, 100).toFixed(1)}%</div>
                                        <div><b>Proporcionalidad Post-Antesis:</b> {limite(metricas.proporcionalidadPostAntesis, 100).toFixed(1)}%</div>
                                      </Paper>
                                    </motion.div>
                                  </Grid>
                                  {/* Segundo grupo */}
                                  <Grid item xs={12} md={6} lg={3}>
                                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
                                      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: '#e1f5fe' }}>
                                        <Typography variant="subtitle2" sx={{ color: '#0288d1', fontWeight: 'bold', mb: 1 }}>Dejadas</Typography>
                                        <div><b>Antesis Dejadas:</b> {limite(metricas.porcentajeAntesisDejadas, 15).toFixed(1)}%</div>
                                        <div><b>Post Antesis Dejadas:</b> {limite(metricas.porcentajePostAntesisDejadas, 10).toFixed(1)}%</div>
                                      </Paper>
                                    </motion.div>
                                  </Grid>
                                  {/* Tercer grupo */}
                                  <Grid item xs={12} md={6} lg={3}>
                                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
                                      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: '#fffde7' }}>
                                        <Typography variant="subtitle2" sx={{ color: '#fbc02d', fontWeight: 'bold', mb: 1 }}>Actividades</Typography>
                                        <div><b>Espate:</b> {limite(metricas.porcentajeEspate, 30).toFixed(1)}%</div>
                                        <div><b>Aplicación:</b> {limite(metricas.porcentajeAplicacion, 30).toFixed(1)}%</div>
                                        <div><b>Marcación:</b> {limite(metricas.porcentajeMarcacion, 5).toFixed(1)}%</div>
                                      </Paper>
                                    </motion.div>
                                  </Grid>
                                  {/* Cuarto grupo */}
                                  <Grid item xs={12} md={6} lg={3}>
                                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}>
                                      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: '#f3e5f5' }}>
                                        <Typography variant="subtitle2" sx={{ color: '#8e24aa', fontWeight: 'bold', mb: 1 }}>Repasos</Typography>
                                        <div><b>Repaso 1:</b> {limite(metricas.porcentajeRepaso1, 5).toFixed(1)}%</div>
                                        <div><b>Repaso 2:</b> {limite(metricas.porcentajeRepaso2, 5).toFixed(1)}%</div>
                                      </Paper>
                                    </motion.div>
                                  </Grid>
                                </Grid>
                                {/* Otros datos básicos */}
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                  <Grid item xs={12} sm={6} md={3}><b>Total Eventos:</b> {metricas.sumaEventos}</Grid>
                                  <Grid item xs={12} sm={6} md={3}><b>Total Inflorescencias:</b> {metricas.sumaInflorescencia}</Grid>
                                  <Grid item xs={12} sm={6} md={3}><b>Antesis:</b> {metricas.sumaAntesis}</Grid>
                                  <Grid item xs={12} sm={6} md={3}><b>Post-Antesis:</b> {metricas.sumaPostAntesis}</Grid>
                                  <Grid item xs={12} sm={6} md={3}><b>Antesis Dejadas:</b> {metricas.sumaAntesisDejadas}</Grid>
                                  <Grid item xs={12} sm={6} md={3}><b>Post-Antesis Dejadas:</b> {metricas.sumaPostAntesisDejadas}</Grid>
                                  <Grid item xs={12} sm={6} md={3}><b>Aplicación:</b> {metricas.sumaAplicacion}</Grid>
                                  <Grid item xs={12} sm={6} md={3}><b>Marcación:</b> {metricas.sumaMarcacion}</Grid>
                                  <Grid item xs={12} sm={6} md={3}><b>Espate:</b> {metricas.sumaEspate}</Grid>
                                  <Grid item xs={12} sm={6} md={3}><b>Repaso 1:</b> {metricas.sumaRepaso1} / {metricas.EventosRepaso1}</Grid>
                                  <Grid item xs={12} sm={6} md={3}><b>Repaso 2:</b> {metricas.sumaRepaso2} / {metricas.EventosRepaso2}</Grid>
                                </Grid>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
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