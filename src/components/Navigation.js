import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
`;

const BreadcrumbContainer = styled.div`
  color: #6c757d;
  font-size: 0.95rem;
  display: flex;
  align-items: center;

  a {
    color: #28a745;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  span.separator {
    margin: 0 0.5rem;
    color: #adb5bd;
  }

  span.current {
    color: #495057;
    font-weight: 500;
  }
`;

const Navigation = () => {
  const location = useLocation();
  const params = useParams();
  
  const getPageTitle = (pathname) => {
    const routes = {
      '/': 'Inicio',
      '/fincas': 'Fincas',
      '/informes': 'Informes',
      '/configuracion': 'Configuración'
    };

    if (pathname.startsWith('/fincas/') && params.id) {
      return `Finca ${params.id.toUpperCase()}`;
    }

    return routes[pathname] || pathname;
  };

  const renderBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    return (
      <BreadcrumbContainer>
        <Link to="/">Inicio</Link>
        {pathSegments.map((segment, index) => {
          currentPath += `/${segment}`;
          const isLast = index === pathSegments.length - 1;
          const title = segment === 'fincas' ? 'Fincas' : 
                       (params.id ? `Finca ${params.id.toUpperCase()}` : segment);

          return (
            <span key={segment}>
              <span className="separator">/</span>
              {isLast ? (
                <span className="current">{title}</span>
              ) : (
                <Link to={currentPath}>{title}</Link>
              )}
            </span>
          );
        })}
      </BreadcrumbContainer>
    );
  };

  return (
    <NavContainer>
      {renderBreadcrumbs()}
    </NavContainer>
  );
};

export default Navigation; 