import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Description, Info } from "@mui/icons-material";
import { SidebarContainer, IconButton, ButtonText } from "../styles/Sidebar.styles";
import AboutModal from "./AboutModal";

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const Sidebar = ({ isOpen }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          <motion.div variants={itemVariants}>
            <IconButton isOpen={isOpen} onClick={() => window.location.href='/fincas'} whileHover={{ scale: 1.05 }}>
              <Home />
              <ButtonText isOpen={isOpen}>Menu</ButtonText>
            </IconButton>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <IconButton isOpen={isOpen} onClick={() => window.open('https://report.agrojurado.com', '_blank')} whileHover={{ scale: 1.05 }}>
              <Description />
              <ButtonText isOpen={isOpen}>Reportes</ButtonText>
            </IconButton>
          </motion.div>

          <motion.div variants={itemVariants}>
            <IconButton isOpen={isOpen} onClick={() => setShowAboutModal(true)} whileHover={{ scale: 1.05 }}>
              <Info />
              <ButtonText isOpen={isOpen}>Acerca de</ButtonText>
            </IconButton>
          </motion.div>
        </motion.div>
      </SidebarContainer>

      <AboutModal 
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
    </>
  );
};

export default Sidebar;
