import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { NavContainer, BreadcrumbContainer } from '../styles/Navigation.styles';

const Navigation = () => {
  const location = useLocation();
  const params = useParams();
  
  const renderBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    // Si estamos en la ruta raíz, solo mostramos "Menu"
    if (pathSegments.length === 0) {
      return (
        <BreadcrumbContainer>
          <span>Menu</span>
        </BreadcrumbContainer>
      );
    }
    
    return (
      <BreadcrumbContainer>
        <Link to="/">Menu</Link>
        {pathSegments.map((segment, index) => {
          currentPath += `/${segment}`;
          const isLast = index === pathSegments.length - 1;
          
          // Personalización para mostrar nombres más amigables
          let title = segment;
          if (segment === 'fincas') {
            title = 'Fincas';
          } else if (segment === 'informes') {
            title = 'Informes';
          } else if (segment === 'configuracion') {
            title = 'Configuración';
          } else if (params.id && segment === params.id) {
            title = `Finca ${params.id.toUpperCase()}`;
          } else if (segment === 'evaluacion-polen') {
            title = 'Evaluacion Polen FD';
          }

          return (
            <span key={segment}>
              <span className="separator">&gt;</span>
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