// src/components/FincaCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { CardContainer, CardImage, CardText } from '../styles/FincaCard.styles';

const FincaCard = ({ id, name, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
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
