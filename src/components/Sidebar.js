import React from "react";
import { FaHome, FaInfoCircle, FaBook } from "react-icons/fa";
import { SidebarContainer, IconButton, ButtonText } from "../styles/Sidebar.styles";

const Sidebar = ({ isOpen }) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <IconButton isOpen={isOpen}>
        <FaHome />
        <ButtonText isOpen={isOpen}>Menu</ButtonText>
      </IconButton>
      <IconButton isOpen={isOpen}>
        <FaInfoCircle />
        <ButtonText isOpen={isOpen}>About</ButtonText>
      </IconButton>
      <IconButton isOpen={isOpen}>
        <FaBook />
        <ButtonText isOpen={isOpen}>Feedback</ButtonText>
      </IconButton>
    </SidebarContainer>
  );
};

export default Sidebar;
