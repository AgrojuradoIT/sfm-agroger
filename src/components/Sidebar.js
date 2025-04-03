import React from "react";
import styled from "styled-components";
import { FaHome, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

const SidebarContainer = styled.div`
  width: ${(props) => (props.isOpen ? "200px" : "60px")};
  height: 100vh;
  background-color: #222;
  color: white;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
`;

const IconButton = styled.div`
  font-size: 24px;
  margin: 15px 0;
  cursor: pointer;
`;

const Sidebar = ({ isOpen }) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <IconButton><FaHome /></IconButton>
      <IconButton><FaInfoCircle /></IconButton>
      <IconButton><FaExclamationTriangle /></IconButton>
    </SidebarContainer>
  );
};

export default Sidebar;
