import styled from 'styled-components';

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  width: 100%;
  max-width: 200px;
  height: 240px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
  position: relative;
  margin: 0 auto;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 1200px) {
    max-width: 180px;
    height: 230px;
  }

  @media (max-width: 992px) {
    max-width: 160px;
    height: 220px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    height: 210px;
  }
`;

export const CardImage = styled.img`
  width: 80%;
  height: 70%;
  object-fit: contain;
  margin-bottom: 35px;
`;

export const CardText = styled.p`
  width: 100%;
  padding: 8px 0;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #333;
  position: absolute;
  bottom: 10px;
`;