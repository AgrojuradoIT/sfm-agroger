import styled from 'styled-components';

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

// Panel Negro (izquierda) - Filtro por fechas
export const FilterPanel = styled.div`
  width: 180px;
  min-width: 160px;
  background-color: white;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  box-sizing: border-box;

  @media (max-width: 992px) {
    width: 160px;
    min-width: 140px;
  }
`;

// Panel Amarillo (centro) - Listado de evaluaciones por operario
export const EvaluationsPanel = styled.div`
  width: 280px;
  min-width: 250px;
  background-color: white;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (max-width: 992px) {
    width: 240px;
    min-width: 220px;
  }
`;

// Panel Azul (derecha) - Detalle de la evaluación seleccionada
export const DetailPanel = styled.div`
  flex: 1;
  background-color: white;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 15px;
  box-sizing: border-box;
`;

// Estilos para el panel de filtros (negro)
export const AllButton = styled.div`
  padding: 10px 15px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
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
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.selected ? '#2e7d32' : '#333'};
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  background-color: ${props => props.selected ? '#f0f7f0' : 'transparent'};
  font-size: 13px;
  
  &:hover {
    background-color: #f5f5f5;
  }

  @media (max-width: 992px) {
    padding: 5px 8px;
    font-size: 12px;
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
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
  
  .operator-name {
    font-weight: bold;
    font-size: 15px;
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
  font-size: 20px;
  margin: 8px 0;
  white-space: normal;
  word-break: break-word;
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
  border-collapse: collapse;
  table-layout: fixed;
`;

export const DetailRow = styled.tr`
  border-bottom: 1px solid #f0f0f0;
`;

export const DetailLabel = styled.td`
  padding: 8px 6px;
  color: #666;
  font-size: 13px;
  width: 110px;

  @media (max-width: 992px) {
    width: 100px;
    font-size: 12px;
    padding: 6px 4px;
  }
`;

export const DetailValue = styled.td`
  padding: 8px 6px;
  color: #333;
  font-size: 13px;
  font-weight: 500;
  word-break: break-word;
  max-width: 100%;
  overflow-wrap: break-word;

  @media (max-width: 992px) {
    font-size: 12px;
    padding: 6px 4px;
  }
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
`;

export const FincaImage = styled.img`
  width: 400px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const FincaInfo = styled.div`
  flex: 1;
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
  padding: 10px 15px;
  font-weight: 500;
  color: #333;
  background-color: white;
  width: 100%;
  height: 40px;
  margin-top: 6px;
  border-bottom: 1px solid #eaeaea;
  box-sizing: border-box;
  overflow: hidden;

  .nav-item {
    display: flex;
    align-items: center;
  }

  .nav-icon, .separator {
    margin: 0 5px;
    color: #666;
  }

  .nav-link {
    color: #666;
    cursor: pointer;
    white-space: nowrap;
    
    &:hover {
      color: #1fab89;
    }
  }

  .current {
    color: #333;
    font-weight: 500;
    white-space: nowrap;
  }
`; 