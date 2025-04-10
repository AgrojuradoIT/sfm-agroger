import React, { useState, useEffect } from "react";
import { FaBars, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { useLocation, useParams, useNavigate } from "react-router-dom";
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
  const [userEmail, setUserEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Get the user email from localStorage if available
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  
  const getRouteTitle = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1] || '';
    
    if (pathSegments.length === 0) return 'SFM AGROGER';
    
    // Mapeo de rutas a títulos
    if (lastSegment === 'fincas') return 'Fincas';
    if (lastSegment === 'informes') return 'Informes';
    if (lastSegment === 'configuracion') return 'Configuración';
    if (params?.id && pathSegments.includes(params.id)) return `Finca ${params.id.toUpperCase()}`;
    if (lastSegment === 'evaluacion-polen') return 'Evaluación Polen FD';
    
    return lastSegment;
  };

  const getSearchPlaceholder = () => {
    return `Buscar en ${getRouteTitle()}`;
  };

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

  const handleLogoClick = () => {
    navigate('/fincas');
  };

  return (
    <HeaderContainer>
      <Logo>
        <MenuIcon onClick={(e) => {
          e.stopPropagation(); // Stop propagation to prevent Logo click
          toggleSidebar();
        }}>
          <FaBars />
        </MenuIcon>
        <div onClick={handleLogoClick} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <LogoImage src={logo} alt="Logo SFM AGROGER" />
          <span>SFM AGROGER</span>
        </div>
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
        <UserIcon onClick={toggleMenu}>{userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}</UserIcon>
        
        <UserMenu isOpen={menuOpen}>
          <UserEmail>
            <UserIcon className="avatar">{userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}</UserIcon>
            <span className="email">{userEmail || 'Usuario'}</span>
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
