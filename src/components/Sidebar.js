import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Description, Info, Settings } from "@mui/icons-material";
import { SidebarContainer, IconButton, ButtonText } from "../styles/Sidebar.styles";
import AboutModal from "./AboutModal";
import { useNavigate } from "react-router-dom";
import Tooltip from "./Tooltip";
import authService from "../services/authService";

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const Sidebar = ({ isOpen }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [userPermissions, setUserPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const homeRef = useRef(null);
  const reportRef = useRef(null);
  const aboutRef = useRef(null);
  const configRef = useRef(null);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUserPermissions(userData?.permisos);
      } catch (error) {
        console.error("Error al obtener permisos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPermissions();
  }, []);

  // Verifica si el usuario tiene permiso para ver cierta opción
  const hasPermission = (requiredRole) => {
    if (!userPermissions) return false;
    
    const { rol_tipo } = userPermissions;
    
    // Administradores pueden ver todo
    if (rol_tipo === 'administrador') return true;
    
    // Coordinadores pueden ver informes pero no configuración
    if (rol_tipo === 'coordinador') {
      return requiredRole !== 'administrador';
    }
    
    // Evaluadores solo pueden ver las opciones básicas
    if (rol_tipo === 'evaluador') {
      return requiredRole === 'evaluador';
    }
    
    // Operarios tienen acceso muy limitado
    return false;
  };

  if (loading) {
    return <SidebarContainer isOpen={isOpen}></SidebarContainer>;
  }

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
              onClick={() => navigate('/fincas')} 
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => !isOpen && setActiveTooltip('home')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <Home />
              <ButtonText isOpen={isOpen}>Inicio</ButtonText>
            </IconButton>
          </motion.div>
          
          {hasPermission('coordinador') && (
            <motion.div variants={itemVariants}>
              <IconButton 
                ref={reportRef}
                isOpen={isOpen} 
                onClick={() => navigate('/informes')} 
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => !isOpen && setActiveTooltip('report')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <Description />
                <ButtonText isOpen={isOpen}>Reportes</ButtonText>
              </IconButton>
            </motion.div>
          )}
          
          {hasPermission('administrador') && (
            <motion.div variants={itemVariants}>
              <IconButton 
                ref={configRef}
                isOpen={isOpen} 
                onClick={() => navigate('/configuracion')} 
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => !isOpen && setActiveTooltip('config')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <Settings />
                <ButtonText isOpen={isOpen}>Configuración</ButtonText>
              </IconButton>
            </motion.div>
          )}

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
      {hasPermission('coordinador') && (
        <Tooltip text="Reportes" targetRef={reportRef} show={activeTooltip === 'report'} />
      )}
      {hasPermission('administrador') && (
        <Tooltip text="Configuración" targetRef={configRef} show={activeTooltip === 'config'} />
      )}
      <Tooltip text="Acerca de" targetRef={aboutRef} show={activeTooltip === 'about'} />
    </>
  );
};

export default Sidebar;
