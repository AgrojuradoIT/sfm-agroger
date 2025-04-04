import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import FincaList from "./components/FincaList";
import FincaDetail from "./components/FincaDetail";
import Sidebar from "./components/Sidebar";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("isAuthenticated");
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {!isAuthenticated ? (
          <Login onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <>
            <Sidebar isOpen={sidebarOpen} />
            <div style={{ flex: 1, transition: "margin-left 0.3s ease", width: "100%" }}>
              <Header onLogout={handleLogout} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
              <Navigation />
              <div style={{ marginTop: "20px", padding: "20px" }}>
                <Routes>
                  <Route path="/" element={<Navigate to="/fincas" />} />
                  <Route path="/fincas" element={<FincaList />} />
                  <Route path="/fincas/:id" element={<FincaDetail />} />
                  <Route path="/informes" element={<div>Página de Informes</div>} />
                  <Route path="/configuracion" element={<div>Página de Configuración</div>} />
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
