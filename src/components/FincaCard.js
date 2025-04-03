// src/components/FincaCard.js
import React from "react";
import styled from "styled-components";

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
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const CardImage = styled.div`
  width: 180px;
  height: 180px;
  background-image: url(${(props) => props.image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const CardText = styled.p`
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

const FincaCard = ({ name, image }) => {
  return (
    <CardContainer>
      <CardImage image={image} />
      <CardText>{name}</CardText>
    </CardContainer>
  );
};

export default FincaCard;
