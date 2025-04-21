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
  Divider,
  Card,
  CardContent,
  Grid,
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  FaArrowLeft, 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserAlt,
  FaStar,
  FaClipboardList
} from 'react-icons/fa';
import fincaService from '../services/fincaService';

const HistorialOperario = () => {
  const { nombreOperario } = useParams();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setLoading(true);
        const response = await fincaService.getHistorialOperario(nombreOperario);
        setHistorial(response.evaluaciones || []);
        setMensaje(response.mensaje || '');
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar historial:', err);
        setError('No se pudo cargar el historial del operario');
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [nombreOperario]);

  const volver = () => {
    navigate(-1); // Volver a la página anterior
  };

  const formatearFecha = (fecha) => {
    return fecha || 'N/A';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={volver} 
          sx={{ mr: 2, backgroundColor: '#f5f5f5' }}
          aria-label="volver"
        >
          <FaArrowLeft />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Hoja de Vida - {nombreOperario}
        </Typography>
      </Box>

      {mensaje && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: '#fff9c4', 
            border: '1px solid #fbc02d'
          }}
        >
          <Typography>{mensaje}</Typography>
        </Paper>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            backgroundColor: '#ffebee',
            border: '1px solid #ef5350'
          }}
        >
          <Typography color="error">{error}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </Paper>
      ) : (
        <>
          <Card sx={{ mb: 4, overflow: 'hidden' }}>
            <Box sx={{ 
              p: 2, 
              backgroundColor: '#2e7d32', 
              color: 'white',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FaUserAlt style={{ marginRight: '8px' }} />
              <Typography variant="h6">
                Resumen del Operario
              </Typography>
            </Box>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Evaluaciones
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                      {historial.length}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Calificación Promedio
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32', mr: 1 }}>
                        {historial.length > 0 
                          ? (historial.reduce((sum, item) => sum + (item.calificacion || 0), 0) / historial.length).toFixed(1) 
                          : 'N/A'}
                      </Typography>
                      <FaStar style={{ color: '#ffc107' }} />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Última Evaluación
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#2e7d32' }}>
                      {historial.length > 0 ? formatearFecha(historial[0].fecha) : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Finca Principal
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#2e7d32' }}>
                      {historial.length > 0 ? historial[0].finca : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <FaClipboardList style={{ marginRight: '8px', color: '#2e7d32' }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              Historial de Evaluaciones
            </Typography>
          </Box>

          {historial.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
              <Typography variant="h6">
                No hay evaluaciones registradas para este operario
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Finca</TableCell>
                    <TableCell>Lote</TableCell>
                    <TableCell>Sección</TableCell>
                    <TableCell>Evaluador</TableCell>
                    <TableCell>Calificación</TableCell>
                    <TableCell>Observaciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historial.map((evaluacion) => (
                    <TableRow 
                      key={evaluacion.id}
                      sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FaCalendarAlt style={{ color: '#2e7d32', marginRight: '8px' }} />
                          {formatearFecha(evaluacion.fecha)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FaMapMarkerAlt style={{ color: '#2e7d32', marginRight: '8px' }} />
                          {evaluacion.finca || 'N/A'}
                        </Box>
                      </TableCell>
                      <TableCell>{evaluacion.lote || 'N/A'}</TableCell>
                      <TableCell>{evaluacion.seccion || 'N/A'}</TableCell>
                      <TableCell>{evaluacion.evaluador || 'N/A'}</TableCell>
                      <TableCell>
                        <Rating 
                          value={evaluacion.calificacion || 0} 
                          readOnly 
                          precision={0.5}
                        />
                      </TableCell>
                      <TableCell>{evaluacion.observaciones || '-'}</TableCell>
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