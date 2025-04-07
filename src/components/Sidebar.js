import React, { useState } from "react";
import { FaHome, FaInfoCircle, FaBook } from "react-icons/fa";
import { SidebarContainer, IconButton, ButtonText } from "../styles/Sidebar.styles";
import AboutModal from "./AboutModal";

const Sidebar = ({ isOpen }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <IconButton isOpen={isOpen} onClick={() => window.location.href='/fincas'}>
          <FaHome />
          <ButtonText isOpen={isOpen}>Menu</ButtonText>
        </IconButton>
        
        <IconButton isOpen={isOpen} onClick={() => setShowAboutModal(true)}>
          <FaInfoCircle />
          <ButtonText isOpen={isOpen}>Acerca de</ButtonText>
        </IconButton>

        <IconButton isOpen={isOpen} onClick={() => window.open('https://report.agrojurado.com', '_blank')}>
          <FaBook />
          <ButtonText isOpen={isOpen}>Reportes</ButtonText>
        </IconButton>
      </SidebarContainer>

      <AboutModal 
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
    </>
  );
};

export default Sidebar;
