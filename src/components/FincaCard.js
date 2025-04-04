// src/components/FincaCard.js
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 15px;
  padding: 15px;
  width: 220px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 2px 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.img`
  width: 180px;
  height: 180px;
  object-fit: contain;
  border-radius: 8px;
`;

const CardText = styled.p`
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #333;
`;

const FincaCard = ({ id, name, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Navegando a:', `/fincas/${id}`);
    navigate(`/fincas/${id}`);
  };

  return (
    <CardContainer onClick={handleClick}>
      <CardImage src={image} alt={name} />
      <CardText>{name}</CardText>
    </CardContainer>
  );
};

export default FincaCard;
