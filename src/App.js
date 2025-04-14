import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import FincaList from "./components/FincaList";
import FincaDetail from "./components/FincaDetail";
import Sidebar from "./components/Sidebar";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import WelcomeNotification from './components/WelcomeNotification';
import defaultProfile from './assets/default-profile.png';
import authService from './services/authService';

// Componente de protección de rutas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const location = useLocation();

  console.log("ProtectedRoute - path:", location.pathname, "- isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) {
    // Redirigir al login pero guardar la ubicación actual
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// Componente para verificar permisos de ruta según el rol
const RoleBasedRoute = ({ element, requiredRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [userPermissions, setUserPermissions] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUserPermissions(userData?.permisos);
      } catch (error) {
        console.error("Error al obtener permisos:", error);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, []);

  if (loading) {
    return <div>Cargando permisos...</div>;
  }

  // Si no hay restricciones de roles o el usuario es admin/coordinador, permitir acceso
  if (requiredRoles.length === 0 || 
      !userPermissions || 
      userPermissions.rol_tipo === 'administrador' || 
      userPermissions.rol_tipo === 'coordinador' ||
      requiredRoles.includes(userPermissions.rol_tipo)) {
    return element;
  }

  // Si no tiene permisos, redirigir a fincas
  return <Navigate to="/fincas" state={{ from: location }} replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loggedUser, setLoggedUser] = useState("");
  const [profileImage, setProfileImage] = useState(defaultProfile);

  // Actualizar el estado si cambia la autenticación
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogin = (username) => {
    setLoggedUser(username);
    setShowWelcome(true);
    setIsAuthenticated(true);
    
    // Aquí podrías cargar la imagen real del usuario si está disponible
    // setProfileImage(userData.profileImage);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error durante el logout:', error);
    } finally {
      setIsAuthenticated(false);
    }
  };

  console.log("Renderizando App con isAuthenticated =", isAuthenticated);

  return (
    <Router>
      {showWelcome && (
        <WelcomeNotification
          username={loggedUser}
          profileImage={profileImage}
          onClose={() => setShowWelcome(false)}
        />
      )}
      
      <Routes>
        <Route path="/" element={
          !isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Navigate to="/fincas" replace />
          )
        } />
        <Route path="/*" element={
          <ProtectedRoute>
            <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
              <Sidebar isOpen={sidebarOpen} />
              <div style={{ flex: 1, transition: "margin-left 0.3s ease", width: "100%" }}>
                <Header onLogout={handleLogout} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <Navigation />
                <div style={{ marginTop: "20px", padding: "20px" }}>
                  <Routes>
                    <Route path="/fincas" element={<FincaList />} />
                    <Route path="/fincas/:id" element={
                      <RoleBasedRoute 
                        element={<FincaDetail />}
                        requiredRoles={['administrador', 'coordinador', 'evaluador']} 
                      />
                    } />
                    <Route path="/informes" element={
                      <RoleBasedRoute 
                        element={<div>Página de Informes</div>}
                        requiredRoles={['administrador', 'coordinador']} 
                      />
                    } />
                    <Route path="/configuracion" element={
                      <RoleBasedRoute 
                        element={<div>Página de Configuración</div>}
                        requiredRoles={['administrador']} 
                      />
                    } />
                    <Route path="*" element={<Navigate to="/fincas" replace />} />
                  </Routes>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
