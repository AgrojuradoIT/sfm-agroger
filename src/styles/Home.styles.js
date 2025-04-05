import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: #f5f5f5;
`;

export const MainContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  margin-top: 0;
  flex-direction: row;
  width: 100%;
`;

export const Content = styled.div`
  padding: 0;
  flex: 1;
  background-color: white;
  min-height: calc(100vh - 60px);
  transition: all 0.3s ease;
  overflow-x: hidden;
  margin-top: 60px;
`; 