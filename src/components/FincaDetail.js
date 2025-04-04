import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
  DetailContainer,
  BackButton,
  FincaHeader,
  FincaImage,
  FincaInfo,
  FincaTitle,
  InfoSection,
  InfoTitle,
  InfoGrid,
  InfoItem
} from '../styles/FincaDetail.styles';

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