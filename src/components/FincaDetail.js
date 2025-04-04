import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';

const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled.button`
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

const FincaHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FincaImage = styled.img`
  width: 400px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FincaInfo = styled.div`
  flex: 1;
`;

const FincaTitle = styled.h1`
  color: #333;
  margin-bottom: 1rem;
`;

const InfoSection = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
`;

const InfoTitle = styled.h2`
  color: #28a745;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const InfoItem = styled.div`
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

const FincaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ID de la finca:', id);
  }, [id]);

  // Importar las imágenes directamente
  const getImageForFinca = (fincaId) => {
    try {
      return require(`../assets/finca${fincaId.toUpperCase()}.png`);
    } catch (error) {
      console.error('Error cargando imagen:', error);
      return '';
    }
  };

  const fincaData = {
    id,
    name: `Finca ${id.toUpperCase()}`,
    image: getImageForFinca(id),
    ubicacion: 'San José del Guaviare',
    hectareas: '150',
    cultivos: 'Café, Plátano',
    trabajadores: '25',
    ultimaVisita: '15/03/2024',
    estado: 'Activo'
  };

  return (
    <DetailContainer>
      <BackButton onClick={() => navigate('/fincas')}>
        <FaArrowLeft /> Volver a Fincas
      </BackButton>
      
      <FincaHeader>
        <FincaImage src={fincaData.image} alt={fincaData.name} />
        <FincaInfo>
          <FincaTitle>{fincaData.name}</FincaTitle>
          
          <InfoSection>
            <InfoTitle>Información General</InfoTitle>
            <InfoGrid>
              <InfoItem>
                <p>Ubicación</p>
                <p>{fincaData.ubicacion}</p>
              </InfoItem>
              <InfoItem>
                <p>Hectáreas</p>
                <p>{fincaData.hectareas}</p>
              </InfoItem>
              <InfoItem>
                <p>Cultivos Principales</p>
                <p>{fincaData.cultivos}</p>
              </InfoItem>
              <InfoItem>
                <p>Trabajadores</p>
                <p>{fincaData.trabajadores}</p>
              </InfoItem>
              <InfoItem>
                <p>Última Visita</p>
                <p>{fincaData.ultimaVisita}</p>
              </InfoItem>
              <InfoItem>
                <p>Estado</p>
                <p>{fincaData.estado}</p>
              </InfoItem>
            </InfoGrid>
          </InfoSection>
        </FincaInfo>
      </FincaHeader>
    </DetailContainer>
  );
};

export default FincaDetail; 