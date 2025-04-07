import React from 'react';
import { ModalContainer, ModalContent, CloseButton } from '../styles/AboutModal.styles';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2>SFM AGROGER</h2>
        <p>Versión: 1.0.0</p>
        <p>Desarrollado por: Agropecuaria Juradó S.A.S</p>
        
        <div style={{ marginTop: '15px' }}>
          <p style={{ marginBottom: '15px' }}>
            <strong>SFM GROGER</strong> es una herramienta digital diseñada para facilitar la gestión y supervisión en campo de las fincas agrícolas.
          </p>

          <p style={{ marginBottom: '15px' }}>
            Esta aplicación permite a los supervisores registrar y visualizar evaluaciones detalladas, enfocándose en indicadores clave como:
          </p>

          <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
            <li>Calidad del trabajo realizado</li>
            <li>Porcentajes de desempeño</li>
            <li>Estadísticas de polinización por operario</li>
          </ul>

          <p style={{ marginBottom: '15px' }}>
            Nuestro objetivo es optimizar los procesos operativos, mejorar la toma de decisiones y brindar una visión clara y en tiempo real del rendimiento en cada finca.
          </p>
        </div>

        <p style={{ marginTop: '20px' }}> {new Date().getFullYear()} Todos los derechos reservados</p>
      </ModalContent>
    </ModalContainer>
  );
};

export default AboutModal;