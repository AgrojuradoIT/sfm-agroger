import React from "react";
import styled from "styled-components";
import { FaHome, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

const SidebarContainer = styled.div`
  width: ${(props) => (props.isOpen ? "200px" : "60px")};
  height: 100vh;
  background-color: #fff; /* Cambiado a blanco */
  border-right: 2px solid #ddd; /* Bordes a la derecha */
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Sombra ligera */
`;

const IconSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconButton = styled.div`
  font-size: 24px;
  margin: 15px 0;
  cursor: pointer;
  color: #333; /* Color de los iconos */
`;

const ContentSection = styled.div`
  margin-top: 20px; /* Espacio debajo de los iconos */
  width: 100%;
  padding: 10px;
  text-align: center;
  border-top: 1px solid #ddd; /* Línea divisoria */
`;

const Sidebar = ({ isOpen }) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <IconSection>
        <IconButton><FaHome /></IconButton>
        <IconButton><FaInfoCircle /></IconButton>
        <IconButton><FaExclamationTriangle /></IconButton>
      </IconSection>
      <ContentSection>
        {isOpen && (
          <div>
            <p>Panel de Control</p>
            <p>Configuración</p>
            <p>Salir</p>
          </div>
        )}
      </ContentSection>
    </SidebarContainer>
  );
};

export default Sidebar;