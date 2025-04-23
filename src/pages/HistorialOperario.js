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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={volver} 
          aria-label="volver"
          sx={{ 
            mr: 2, 
            color: 'text.secondary',
            bgcolor: 'action.hover'
          }}
        >
          <FaArrowLeft />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
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
          <Card sx={{ mb: 4, overflow: 'visible' }}>
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                <FaUserAlt style={{ marginRight: '12px', color: 'primary.main' }} />
                Resumen del Operario
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="stretch">
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <FaTags size={24} color="#64b5f6" />
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
                      Total Evaluaciones
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {historial.length}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <FaRegStar size={24} color="#ffb74d" />
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
                      Calificación Promedio
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f57c00', mr: 0.5 }}>
                        {historial.length > 0 
                          ? (historial.reduce((sum, item) => sum + (item.calificacion || 0), 0) / historial.length).toFixed(1) 
                          : 'N/A'}
                      </Typography>
                      {historial.length > 0 && <FaStar style={{ color: '#ffb74d', fontSize: '1.5rem' }} />}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <FaCalendarCheck size={24} color="#81c784" />
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
                      Última Evaluación
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#388e3c' }}>
                      {historial.length > 0 ? formatearFecha(historial[0].fecha) : 'N/A'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <FaBuilding size={24} color="#9575cd" />
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
                      Finca Principal (Última)
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#5e35b1' }}>
                      {historial.length > 0 ? historial[0]?.finca?.descripcion || 'N/A' : 'N/A'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {historial.length > 0 && historial.some(evaluacion => evaluacion.evaluacionesPolinizacion?.length > 0) && (
            <Card sx={{ mb: 4 }}>
              <Box sx={{ p: 2, bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'divider' }}>
                 <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                    <FaChartBar style={{ marginRight: '12px', color: 'primary.main' }} />
                    Métricas de Polinización (Promedio Histórico)
                  </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                {(() => {
                  const metricasPromedio = calcularMetricasPromedio(historial);
                  
                  if (!metricasPromedio) {
                    return (
                      <Typography variant="body1" sx={{ textAlign: 'center', p: 2, color: 'text.secondary' }}>
                        No hay datos de métricas de polinización disponibles para este operario.
                      </Typography>
                    );
                  }
                  
                  const metricasItems = [
                    { label: 'Rendimiento Total', value: metricasPromedio.rendimientoTotal, maxValue: 100, color: 'success.main' },
                    { label: 'Antesis Dejadas', value: metricasPromedio.porcentajeAntesisDejadas, maxValue: 15, color: 'error.main' },
                    { label: 'Post Antesis Dejadas', value: metricasPromedio.porcentajePostAntesisDejadas, maxValue: 10, color: 'warning.main' },
                    { label: 'Espate', value: metricasPromedio.porcentajeEspate, maxValue: 30, color: 'info.main' },
                    { label: 'Aplicación', value: metricasPromedio.porcentajeAplicacion, maxValue: 30, color: 'secondary.main' },
                    { label: 'Marcación', value: metricasPromedio.porcentajeMarcacion, maxValue: 5, color: '#673ab7' },
                    { label: 'Repaso 1', value: metricasPromedio.porcentajeRepaso1, maxValue: 5, color: '#00bcd4' },
                    { label: 'Repaso 2', value: metricasPromedio.porcentajeRepaso2, maxValue: 5, color: '#795548' }
                  ];
                  
                  return (
                    <Grid container spacing={3}>
                      {metricasItems.map((item, index) => {
                        const porcentajeBarra = Math.min((item.value / item.maxValue) * 100, 100);
                        return (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: item.color }}>{item.value}%</Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={porcentajeBarra}
                              sx={{ 
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: item.color
                                }
                              }}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <FaClipboardList style={{ marginRight: '12px', color: 'primary.main' }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 500 }}>
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
            <TableContainer component={Paper} elevation={1} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Finca</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Lote</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Sección</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Evaluador</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 1 }} align="center">Calificación</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Observaciones</TableCell>
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
                      <TableCell sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaCalendarAlt style={{ color: 'grey.500' }} />
                          {formatearFecha(evaluacion.fecha)}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaMapMarkerAlt style={{ color: 'grey.500' }} />
                          {evaluacion.finca?.descripcion || 'N/A'}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        {evaluacion.lote?.descripcion || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>{evaluacion.seccion || 'N/A'}</TableCell>
                      <TableCell sx={{ py: 1 }}>
                        {evaluacion.evaluador?.nombre || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ py: 1 }} align="center">
                        <Rating 
                          value={evaluacion.calificacion || 0} 
                          readOnly 
                          precision={0.5}
                          size="small"
                          sx={{ verticalAlign: 'middle' }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>{evaluacion.observaciones || '-'}</TableCell>
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