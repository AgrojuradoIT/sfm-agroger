import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import FincaList from "./pages/FincaList";
import Sidebar from "./components/Sidebar";
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
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {!isAuthenticated ? (
        <Login onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <>
          <Sidebar isOpen={sidebarOpen} />
          <div style={{ flex: 1, transition: "margin-left 0.3s ease", width: "100%" }}>
            <Header onLogout={handleLogout} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div style={{ marginTop: "80px", padding: "20px" }}>
              <FincaList />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
