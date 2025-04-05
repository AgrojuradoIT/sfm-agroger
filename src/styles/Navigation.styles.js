import styled from 'styled-components';

export const NavContainer = styled.nav`
  background-color: #fff;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid #dee2e6;
`;

export const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;

  a, span.current {
    color: #333;
    text-decoration: none;
    font-weight: normal;
    
    &:hover {
      text-decoration: none;
    }
  }

  span.current {
    color:rgb(252, 252, 252);
    font-weight: 500;
  }

  span.separator {
    margin: 0 0.5rem;
    color: #333;
  }
`; 