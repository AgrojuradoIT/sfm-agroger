import React from "react";
import styled from "styled-components";
import { FaBars, FaSignOutAlt } from "react-icons/fa";

const HeaderContainer = styled.header`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 20px;
  margin: 0;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #ddd;
  }
`;

const Header = ({ onLogout, toggleSidebar }) => {
  return (
    <HeaderContainer>
      <FaBars style={{ fontSize: "24px", cursor: "pointer" }} onClick={toggleSidebar} />
      <Title>SFM AGRORER</Title>
      <LogoutButton onClick={onLogout}>
        <FaSignOutAlt style={{ marginRight: "5px" }} /> Cerrar Sesión
      </LogoutButton>
    </HeaderContainer>
  );
};

export default Header;

