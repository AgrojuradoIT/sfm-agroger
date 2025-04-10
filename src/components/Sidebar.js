import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Home, Description, Info } from "@mui/icons-material";
import { SidebarContainer, IconButton, ButtonText } from "../styles/Sidebar.styles";
import AboutModal from "./AboutModal";
import { useNavigate } from "react-router-dom";
import Tooltip from "./Tooltip";

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const Sidebar = ({ isOpen }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const navigate = useNavigate();
  
  const homeRef = useRef(null);
  const reportRef = useRef(null);
  const aboutRef = useRef(null);

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
            <IconButton 
              ref={homeRef}
              isOpen={isOpen} 
              onClick={() => navigate('/')} 
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => !isOpen && setActiveTooltip('home')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <Home />
              <ButtonText isOpen={isOpen}>Inicio</ButtonText>
            </IconButton>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <IconButton 
              ref={reportRef}
              isOpen={isOpen} 
              onClick={() => window.open('https://report.agrojurado.com', '_blank')} 
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => !isOpen && setActiveTooltip('report')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <Description />
              <ButtonText isOpen={isOpen}>Reportes</ButtonText>
            </IconButton>
          </motion.div>

          <motion.div variants={itemVariants}>
            <IconButton 
              ref={aboutRef}
              isOpen={isOpen} 
              onClick={() => setShowAboutModal(true)} 
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => !isOpen && setActiveTooltip('about')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
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
      
      {/* Tooltips */}
      <Tooltip text="Inicio" targetRef={homeRef} show={activeTooltip === 'home'} />
      <Tooltip text="Reportes" targetRef={reportRef} show={activeTooltip === 'report'} />
      <Tooltip text="Acerca de" targetRef={aboutRef} show={activeTooltip === 'about'} />
    </>
  );
};

export default Sidebar;
