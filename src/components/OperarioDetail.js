import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import operarioService from '../services/operarioService';
import { FaUser, FaIdCard, FaSpinner, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { 
    Container, 
    Card, 
    CardContent, 
    Typography, 
    CircularProgress, 
    Alert, 
    Button, 
    Box, 
    Grid 
} from '@mui/material';

const OperarioDetail = () => {
    const { id } = useParams(); // Obtiene el ID de la URL
    const navigate = useNavigate();
    const [operario, setOperario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOperarioData = async () => {
            if (!id) {
                setError('ID de operario no proporcionado.');
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            setError(null);
            try {
                console.log(`OperarioDetail - Intentando obtener datos para operario ID: ${id}`);
                // Llama al servicio para obtener los datos
                const data = await operarioService.getOperarioById(id);
                console.log(`OperarioDetail - Datos recibidos:`, data);
                // Asume que la API devuelve directamente el objeto del operario
                // Si devuelve { operario: {...} }, ajusta aquí: setOperario(data.operario)
                setOperario(data);
            } catch (err) {
                console.error(`OperarioDetail - Error al cargar datos del operario ${id}:`, err);
                setError(err.message || 'Error al cargar los datos del operario.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOperarioData();
    }, [id]); // Se ejecuta cada vez que cambia el ID

    const handleGoBack = () => {
        navigate(-1); // Navega a la página anterior
    };

    if (isLoading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 5 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Cargando datos del operario...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 3 }}>
                <Alert severity="error" icon={<FaExclamationTriangle />}>
                    {error}
                </Alert>
                <Button 
                    startIcon={<FaArrowLeft />} 
                    onClick={handleGoBack} 
                    variant="outlined"
                    sx={{ mt: 2 }}
                >
                    Volver
                </Button>
            </Container>
        );
    }

    if (!operario) {
        return (
            <Container sx={{ mt: 3 }}>
                <Alert severity="warning">No se encontraron datos para el operario con ID {id}.</Alert>
                <Button 
                    startIcon={<FaArrowLeft />} 
                    onClick={handleGoBack} 
                    variant="outlined"
                    sx={{ mt: 2 }}
                >
                    Volver
                </Button>
            </Container>
        );
    }

    // Renderiza la información del operario
    return (
        <Container sx={{ mt: 3 }}>
            <Button 
                startIcon={<FaArrowLeft />} 
                onClick={handleGoBack} 
                variant="outlined"
                sx={{ mb: 2 }}
            >
                Volver
            </Button>
            <Card elevation={3}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FaIdCard style={{ marginRight: '10px', fontSize: '1.5rem' }} />
                        <Typography variant="h4" component="h1">
                            Detalles del Operario
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom><FaUser style={{ marginRight: '5px' }}/>Nombre:</Typography>
                            <Typography>{operario.nombre || 'No disponible'}</Typography>
                        </Grid>
                        {/* Agrega aquí más campos según la estructura de datos que devuelva tu API */}
                        {/* Ejemplo:
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Cédula:</Typography>
                            <Typography>{operario.cedula || 'No disponible'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Teléfono:</Typography>
                            <Typography>{operario.telefono || 'No disponible'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Dirección:</Typography>
                            <Typography>{operario.direccion || 'No disponible'}</Typography>
                        </Grid>
                        */}
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default OperarioDetail; 