import styled from 'styled-components';

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 16px;
  padding: 15px;
  width: 95%;
  max-width: 250px;
  height: 240px;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.07), 
              -6px -6px 12px rgba(255, 255, 255, 0.8);
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  margin: 0 auto;

  &:hover {
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.07), 
                -8px -8px 16px rgba(255, 255, 255, 0.8);
    transform: translateY(-5px);
  }
  
  &:active {
    box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.07), 
                inset -4px -4px 8px rgba(255, 255, 255, 0.8);
    transform: translateY(0);
  }

  @media (max-width: 1200px) {
    max-width: 220px;
    height: 220px;
  }

  @media (max-width: 992px) {
    max-width: 200px;
    height: 200px;
  }

  @media (max-width: 768px) {
    max-width: 180px;
    height: 180px;
  }
`;

export const CardImage = styled.img`
  width: 80%;
  height: 75%;
  object-fit: contain;
  margin-bottom: 25px;
  filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.2));
`;

export const CardText = styled.p`
  width: 100%;
  padding: 8px 0;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #333;
  position: absolute;
  bottom: 15px;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
`;