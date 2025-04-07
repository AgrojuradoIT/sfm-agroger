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
import authService from '../services/authService';

const Header = ({ onLogout, toggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleLogout = async () => {
    try {
      await authService.logout();
      // Ya no necesitamos llamar al callback, el servicio maneja la redirección
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // Aquí puedes implementar la lógica de búsqueda
      console.log('Buscando:', searchTerm);
      // Ejemplo: redireccionar a página de resultados
      // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  const getSearchPlaceholder = () => {
    const path = window.location.pathname;
    
    // Detectar rutas de detalle
    if (/\/finca\/\d+/.test(path)) return 'Buscar en Evaluaciones';
    
    // Detectar otras rutas
    if (path.includes('finca')) return 'Buscar una finca';
    if (path.includes('usuario')) return 'Buscar un usuario';
    if (path.includes('cultivo')) return 'Buscar un cultivo';
    if (path.includes('reporte')) return 'Buscar un reporte';
    
    return 'Buscar en SFM AGROGER';
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
        <SearchInput 
          placeholder={getSearchPlaceholder()} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
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
            Cerrar Sesión
          </LogoutButton>
        </UserMenu>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
