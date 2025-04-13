import styled from 'styled-components';
import { Box, Paper, Typography } from '@mui/material';

// Estilos de Material UI para el componente FincaDetail
export const styles = {
  // Estilos para la tarjeta de información general
  infoCard: {
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: '100%',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      marginBottom: '16px'
    }
  },
  
  // Estilos para el overlay de la foto
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
    padding: '20px 10px 10px',
    display: 'flex',
    alignItems: 'flex-end',  /* Alinea el contenido en la parte inferior */
    justifyContent: 'center',
    paddingBottom: '15px',
    borderRadius: '0 0 8px 8px'
  },
  
  overlayText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.8rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0px 0px 10px rgba(0,0,0,0.8), 0px 0px 15px rgba(0,0,0,0.7)',
    margin: 0,
    textAlign: 'center',
    width: '100%',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    WebkitTextStroke: '1.5px rgba(0,0,0,0.5)',
    padding: '8px 16px'
  },
  
  // Estilos para el botón de eventos
  eventosButton: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    color: '#424242',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#f1f3f4',
      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
      transform: 'translateY(-2px)'
    }
  },
  
  // Estilos adicionales para el botón de eventos detallado
  eventosButtonDetailed: {
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
  },
  
  // Estilos para el chip de eventos
  eventosChip: {
    fontSize: '0.85rem', 
    fontWeight: 'bold', 
    height: 28, 
    background: 'linear-gradient(90deg, #4caf50, #2e7d32)',
    margin: '0 auto'
  },
  
  // Estilos para el icono de eventos
  eventosIcon: {
    fontSize: '24px', 
    color: '#4caf50', 
    marginBottom: '8px'
  },
  
  // Estilos para el texto del contador de eventos
  eventosCount: {
    fontWeight: 'bold', 
    color: '#2e7d32', 
    marginBottom: '8px', 
    textAlign: 'center'
  },
  
  // Estilos para el icono de eventos en botones pequeños
  eventosIconSmall: {
    fontSize: '20px',
    color: '#4caf50',
    marginRight: '8px'
  },
  
  // Estilos para la barra de progreso
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    width: '80%',
    marginTop: '4px',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#4caf50'
    }
  },
  
  // Estilos para el modal
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    padding: '24px',
    width: '90vw',
    maxWidth: '1200px',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      padding: '16px',
      width: '95vw'
    }
  },
  
  // Estilos para el contenedor del modal de eventos
  modalEventosContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  
  modalHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16px',
    borderBottom: '1px solid #eee',
    paddingBottom: '16px',
    position: 'relative'
  },
  
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#424242',
    textAlign: 'center',
    width: '100%'
  },
  
  closeButton: {
    color: '#757575',
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 10,
    '&:hover': {
      color: '#424242',
      backgroundColor: '#f5f5f5'
    }
  },
  
  // Estilos para la tabla
  tableContainer: {
    maxHeight: '70vh',
    overflow: 'auto',
    overflowX: 'auto',
    marginTop: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    backgroundColor: 'white'
  },
  
  table: {
    minWidth: '1000px',
    borderCollapse: 'separate',
    borderSpacing: 0,
    backgroundColor: 'white',
    margin: '0 auto',
    width: '100%'
  },
  
  tableHeaderCell: {
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    padding: '14px 16px',
    borderBottom: '2px solid #4caf50',
    textAlign: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    color: '#2c3e50',
    fontSize: '0.95rem',
    minWidth: '100px',
    letterSpacing: '0.3px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#eef2f7'
    }
  },
  
  tableHeaderCellLeft: {
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    padding: '14px 16px',
    borderBottom: '2px solid #4caf50',
    textAlign: 'left',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    color: '#2c3e50',
    fontSize: '0.95rem',
    minWidth: '100px',
    letterSpacing: '0.3px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#eef2f7'
    }
  },
  
  tableDataCell: {
    padding: '12px 16px',
    borderBottom: '1px solid #e9ecef',
    textAlign: 'center',
    fontSize: '0.9rem',
    minWidth: '100px',
    color: '#495057',
    transition: 'background-color 0.2s'
  },
  
  // Estilos para las tarjetas de valores totales
  valoresTotalesCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '8px',
    borderRadius: 2,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    border: 'none',
    margin: '0',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      cursor: 'pointer'
    }
  },
  
  valoresTotalesColorBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px'
  },
  
  valoresTotalesValue: {
    fontWeight: 'bold',
    marginBottom: '10px',
    animation: 'countUp 1.5s ease-out forwards'
  },
  
  valoresTotalesLabel: {
    textAlign: 'center',
    padding: '5px 10px',
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
    animation: 'fadeIn 0.5s'
  },
  
  // Estilos para títulos y encabezados
  sectionTitle: {
    marginBottom: '20px',
    fontWeight: '500',
    color: '#424242'
  },
  
  // Estilos para contenedores y grids
  metricsContainer: {
    marginTop: '6rem',
    marginBottom: '2rem'
  },
  
  metricsRow: {
    marginBottom: '3rem'
  },
  
  metricsItemContainer: {
    padding: '4px'
  },
  
  // Estilos para botones
  actionButton: {
    marginTop: '16px'
  },
  
  // Estilos adicionales para modales
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '800px',
    backgroundColor: 'white',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    borderRadius: '8px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  
  modalHeaderAlt: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  
  modalCloseButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: '#757575',
    '&:hover': {
      color: '#424242',
      backgroundColor: '#f5f5f5'
    }
  },
  
  // Estilos para el modal de eventos
  eventosModalContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  
  eventosModalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd'
  },
  
  eventosModalTitle: {
    fontWeight: 'bold',
    fontSize: '1.25rem',
    margin: 0
  },
  
  eventosModalCloseButton: {
    minWidth: '36px',
    padding: '4px 8px'
  },
  
  // Estilo para el icono de cierre del modal
  closeIcon: {
    fontSize: '18px'
  },
  
  eventosModalContent: {
    overflowX: 'auto',
    overflowY: 'auto',
    flex: 1,
    padding: '16px'
  },
  
  eventosModalTableContainer: {
    minWidth: '1000px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  
  // Estilo para el contenedor del botón de exportar a Excel
  exportButtonContainer: {
    display: 'flex', 
    justifyContent: 'flex-end', 
    padding: '8px'
  },
  
  // Estilos para los mensajes de alerta
  alertMessage: {
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
  },
  
  // Estilos para los mensajes de éxito
  successMessage: {
    padding: '10px', 
    background: '#d4edda', 
    color: '#155724', 
    borderRadius: '4px', 
    margin: '10px', 
    fontSize: '14px',
    textAlign: 'center' 
  },
  
  // Estilos para la tabla de eventos
  eventosTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem'
  },
  
  eventosTableHeaderRow: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #4caf50'
  },
  
  eventosTableHeaderCell: {
    padding: '12px 8px',
    textAlign: 'center',
    position: 'sticky',
    top: 0,
    backgroundColor: '#f8f9fa',
    zIndex: 2
  },
  
  eventosTableHeaderCellWide: {
    padding: '6px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
    borderRight: '1px solid #ddd',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
    backgroundColor: '#f5f5f5',
    zIndex: 1,
    minWidth: '120px'
  },
  
  eventosTableCell: {
    padding: '6px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
    borderRight: '1px solid #ddd',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap'
  },
  
  eventosTableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f9f9f9'
    },
    '&:hover': {
      backgroundColor: '#f0f7ff'
    }
  },
  
  eventosTableRowAlternate: {
    borderBottom: '1px solid #eee'
  },
  
  eventosTableDataCell: {
    padding: '8px',
    textAlign: 'center'
  },
  
  eventosTableDataCellWide: {
    padding: '6px',
    textAlign: 'center',
    borderBottom: '1px solid #eee',
    borderRight: '1px solid #eee',
    fontSize: '0.8rem',
    minWidth: '120px'
  },
  
  eventosTableDataCellHighlighted: {
    padding: '6px',
    textAlign: 'center',
    borderBottom: '1px solid #eee',
    borderRight: '1px solid #eee',
    fontSize: '0.8rem',
    color: (value) => value > 0 ? '#2e7d32' : 'inherit'
  },
  
  eventosTableDataCellLeft: {
    padding: '6px',
    textAlign: 'left',
    borderBottom: '1px solid #eee',
    fontSize: '0.8rem'
  },
  
  eventosTableNoDataCell: {
    padding: '20px',
    textAlign: 'center',
    color: '#999',
    fontSize: '0.9rem',
    border: '1px solid #eee'
  },
  
  tableDataCellLeft: {
    padding: '12px 16px',
    borderBottom: '1px solid #e9ecef',
    textAlign: 'left',
    fontSize: '0.9rem',
    minWidth: '100px',
    color: '#495057',
    transition: 'background-color 0.2s'
  },
  
  tableRowEven: {
    backgroundColor: '#ffffff',
    '&:hover': {
      backgroundColor: '#f5f9ff'
    }
  },
  
  tableRowOdd: {
    backgroundColor: '#f8fafb',
    '&:hover': {
      backgroundColor: '#f5f9ff'
    }
  },
  
  noDataMessage: {
    padding: '16px',
    textAlign: 'center',
    color: '#666'
  }
};

// Estructura de tres paneles
export const MainContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: calc(100vh - 110px);
  max-height: calc(100vh - 110px);
  background-color: #f5f5f5;
  position: relative;
  margin-top: 0;
  overflow: hidden;
  box-sizing: border-box;
`;

export const PanelsContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  background-color: #f5f5f7;
  
  @media (max-width: 992px) {
    height: auto;
    flex-direction: column;
  }
`;

// Filtro por fechas
export const FilterPanel = styled.div`
  width: 250px;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  
  .panel-header {
    padding: 15px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    color: #333;
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      color: #4caf50;
    }
  }
  
  @media (max-width: 992px) {
    width: 100%;
    max-height: 250px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  @media (max-width: 768px) {
    max-height: 200px;
  }
`;

// Listado de evaluaciones por operario
export const EvaluationsPanel = styled.div`
  width: 350px;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  
  .panel-header {
    padding: 15px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    color: #333;
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      color: #4caf50;
    }
  }
  
  .panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 0;
    
    .operator-list {
      padding: 10px 0;
    }
  }
  
  @media (max-width: 992px) {
    width: 100%;
    max-height: 300px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  @media (max-width: 768px) {
    max-height: 250px;
  }
`;

// Detalle de la evaluación seleccionada
export const DetailPanel = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  overflow-y: auto;
  
  @media (max-width: 992px) {
    height: auto;
    min-height: 500px;
  }
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

// Estilos para el panel de filtros 
export const AllButton = styled.div`
  padding: 10px 15px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  background-color: ${props => props.selected ? '#f2f2f2' : '#f9f9f9'};
  color: ${props => props.selected ? '#333' : 'inherit'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border-left: ${props => props.selected ? '4px solid #d9d9d9' : '0'};
  box-shadow: ${props => props.selected ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};
  
  &:hover {
    background-color: ${props => props.selected ? '#e8e8e8' : '#f0f0f0'};
  }
`;

export const YearSection = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f5f5;
  cursor: pointer;
  
  .year-icon {
    color: #4CAF50;
    margin-right: 10px;
  }
  
  .year-text {
    flex: 1;
  }
  
  .year-count {
    background-color: #e0e0e0;
    color: #333;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
  }
`;

export const DateItem = styled.div`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  background-color: ${props => props.selected ? '#e8f0fe' : 'white'};
  
  &:hover {
    background-color: ${props => props.selected ? '#e8f0fe' : '#f8f9fa'};
  }
  
  .date-info {
    .date {
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .count {
      font-size: 12px;
      color: #666;
    }
  }
`;

export const DateBadge = styled.span`
  background-color: ${props => props.selected ? '#2e7d32' : '#e0e0e0'};
  color: ${props => props.selected ? 'white' : '#333'};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;

  @media (max-width: 992px) {
    padding: 2px 6px;
    font-size: 11px;
  }
`;

// Estilos para el panel de operarios y evaluaciones (amarillo)
export const OperatorHeader = styled.div`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  background-color: ${props => props.selected ? '#e8f0fe' : 'white'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.selected ? '#e8f0fe' : '#f8f9fa'};
  }
  
  .operator-name {
    font-weight: bold;
  }
  
  .operator-count {
    background-color: #4CAF50;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
  }
`;

export const EvaluationItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.selected ? '#f0f7f0' : 'white'};
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  .warning-icon {
    margin-right: 10px;
    color: #f57c00;
  }
`;

export const EvaluacionesList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding: 0 10px;
  background-color: #f5f5f5;
  
  @media (max-width: 768px) {
    max-height: 200px;
  }
`;

export const EvaluacionItem = styled.div`
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  background-color: ${props => props.selected ? '#e8f0fe' : 'white'};
  display: flex;
  flex-direction: column;
  
  &:hover {
    background-color: ${props => props.selected ? '#e8f0fe' : '#f8f9fa'};
  }
  
  .evaluacion-fecha {
    font-size: 13px;
    color: ${props => props.selected ? '#1976d2' : '#333'};
    margin-bottom: 4px;
    
    strong {
      font-weight: ${props => props.selected ? 'bold' : '600'};
      color: ${props => props.selected ? '#1976d2' : '#555'};
    }
  }
  
  .evaluacion-seccion {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }
`;

export const EvaluationDetails = styled.div`
  .section {
    font-weight: bold;
    margin-bottom: 3px;
    font-size: 14px;
  }
  
  .date {
    font-size: 12px;
    color: #666;
  }
`;

export const EvaluationPercentage = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: ${props => props.value === '100%' ? '#4caf50' : '#f57c00'};
`;

// Estilos para el panel de detalles (azul)
export const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
  
  .separator {
    margin: 0 8px;
  }
  
  .link {
    cursor: pointer;
    color: #2196f3;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  .current {
    color: #333;
  }
`;

export const EvaluationTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

export const OperatorPhotoContainer = styled.div`
  padding: 0;
  
  @media (max-width: 992px) {
    padding: 0 10px;
  }
`;

export const OperatorNameHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-left: 24px;
  padding-right: 24px;
`;

export const OperatorTitle = styled(Typography)`
  font-weight: bold;
  color: #2e7d32;
`;

export const PhotoBox = styled(Box)`
  position: relative;
  width: calc(100% - 40px);
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: calc(100% - 20px);
  }
`;

export const PhotoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  
  @media (max-width: 992px) {
    height: 280px;
  }
  
  @media (max-width: 768px) {
    height: 240px;
  }
`;

export const OperatorPhoto = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  
  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 4px;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.02);
  }
`;

export const SignatureContainer = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  padding: 10px;
  background-color: #fff;
  
  @media (max-width: 768px) {
    height: 120px;
  }
`;

export const SignatureImage = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  & img {
    width: 100%;
    height: auto;
    object-fit: contain;
    border: 1px solid #eaeaea;
    background-color: white;
    padding: 5px;
    border-radius: 4px;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.02);
  }
`;

export const NoSignatureText = styled(Typography)`
  color: text.secondary;
  font-style: italic;
`;
export const PhotoOverlay = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%);
  padding: 20px 15px 15px;
  border-radius: 0 0 8px 8px;
`;

export const OverlayText = styled(Typography)`
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
  margin: 0;
  text-align: center;
`;

export const PhotoErrorPlaceholder = styled(Box)`
  width: 100%;
  height: 400px;
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #f5f5f5;
  border-radius: 0;
  color: #757575;
`;

export const PhotoPlaceholder = styled(Box)`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 0;
  color: #757575;
`;

export const ErrorText = styled(Typography)`
  margin-top: 8px;
  color: #666;
`;

export const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    color: white;
  }
  
  .evaluator {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .percentage {
    font-size: 24px;
    font-weight: bold;
    color: #FFC107;
  }

  @media (max-width: 992px) {
    height: 250px;
    
    .overlay {
      padding: 15px;
    }
    
    .evaluator {
      font-size: 18px;
    }
    
    .percentage {
      font-size: 22px;
    }
  }

  @media (max-width: 768px) {
    height: 220px;
    
    .overlay {
      padding: 12px;
    }
    
    .evaluator {
      font-size: 16px;
    }
    
    .percentage {
      font-size: 20px;
    }
  }
`;

export const DetailTable = styled.table`
  width: 100%;
  margin-bottom: 20px;
  border-collapse: collapse;
`;

export const DetailRow = styled.tr`
  border-bottom: 1px solid #ddd;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const DetailLabel = styled.td`
  padding: 12px;
  font-weight: bold;
  width: 200px;
  background-color: #f8f9fa;
`;

export const DetailValue = styled.td`
  padding: 12px;
`;

export const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #28a745;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-bottom: 1rem;
  
  &:hover {
    color: #218838;
  }
`;

export const FincaHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const FincaImage = styled.img`
  width: 400px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 992px) {
    width: 100%;
    height: 250px;
  }
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

export const FincaInfo = styled.div`
  flex: 1;
  
  @media (max-width: 992px) {
    width: 100%;
  }
`;

export const FincaTitle = styled.h1`
  color: #333;
  margin-bottom: 1rem;
`;

export const InfoSection = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
`;

export const InfoTitle = styled.h2`
  color: #28a745;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const InfoItem = styled.div`
  p {
    margin: 0;
    &:first-child {
      color: #666;
      font-size: 0.9rem;
    }
    &:last-child {
      color: #333;
      font-weight: 500;
    }
  }
`;

export const Navigation = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  
  .nav-item {
    font-size: 14px;
    color: #666;
    
    .nav-link {
      color: #4caf50;
      cursor: pointer;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    .current {
      font-weight: bold;
      color: #333;
    }
  }
  
  .separator {
    margin: 0 10px;
    color: #ccc;
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    
    .nav-item {
      font-size: 13px;
    }
    
    .separator {
      margin: 0 6px;
    }
  }
`;

export const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #666;
`;

export const ErrorMessage = styled.div`
  padding: 20px;
  margin: 20px;
  background-color: #fff3cd;
  color: #856404;
  border-radius: 4px;
  text-align: center;
`; 