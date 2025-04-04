import styled from 'styled-components';

export const NavContainer = styled.nav`
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
`;

export const BreadcrumbContainer = styled.div`
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