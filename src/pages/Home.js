import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import FincaList from "./components/FincaList";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
`;

const App = () => {
  return (
    <AppContainer>
      <Header />
      <MainContainer>
        <Sidebar />
        <FincaList />
      </MainContainer>
    </AppContainer>
  );
};

export default App;