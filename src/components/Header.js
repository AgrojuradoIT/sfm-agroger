import React, { useState } from "react";
import { FaBars, FaSignOutAlt, FaSearch } from "react-icons/fa";
import {
  HeaderContainer,
  Logo,
  LogoImage,
  MenuIcon,
  SearchBar,
  SearchInput,
  SearchIcon,
  RightSection,
  UserIcon,
  UserMenu,
  UserEmail,
  LogoutButton
} from "../styles/Header.styles";
import logo from "../assets/Logo.png";

const Header = ({ onLogout, toggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setMenuOpen(false);
  };
  
  return (
    <HeaderContainer>
      <Logo>
        <MenuIcon onClick={toggleSidebar}>
          <FaBars />
        </MenuIcon>
        <LogoImage src={logo} alt="SMF AGROGER Logo" />
        <span>SFM AGROGER</span>
      </Logo>
      
      <SearchBar>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput placeholder="Search Menu" />
      </SearchBar>
      
      <RightSection>
        <UserIcon onClick={toggleMenu}>A</UserIcon>
        
        <UserMenu isOpen={menuOpen}>
          <UserEmail>
            <UserIcon className="avatar">A</UserIcon>
            <span className="email">appsagrojurado@gmail.com</span>
          </UserEmail>
          
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            Log Out
          </LogoutButton>
        </UserMenu>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;

