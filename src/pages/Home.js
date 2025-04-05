import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FincaList from "../components/FincaList";
import { AppContainer, MainContainer, Content } from "../styles/Home.styles";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <AppContainer>
      <Header toggleSidebar={toggleSidebar} />
      <MainContainer>
        <Sidebar isOpen={sidebarOpen} />
        <Content sidebarOpen={sidebarOpen}>
          <FincaList />
        </Content>
      </MainContainer>
    </AppContainer>
  );
};

export default App;