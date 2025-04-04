// src/components/FincaList.js
import React from "react";
import styled from "styled-components";
import FincaCard from "./FincaCard";

import fincaAImage from "../assets/fincaA.png";
import fincaBImage from "../assets/fincaB.png";
import fincaCImage from "../assets/fincaC.png";
import fincaDImage from "../assets/fincaD.png";

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  padding: 20px;
  flex: 1;
`;

// Datos de las fincas con sus respectivas imágenes
const fincas = [
  { id: 1, name: "Finca A", image: fincaAImage },
  { id: 2, name: "Finca B", image: fincaBImage },
  { id: 3, name: "Finca C", image: fincaCImage },
  { id: 4, name: "Finca D", image: fincaDImage }
];

const FincaList = () => {
  return (
    <ListContainer>
      {fincas.map((finca) => (
        <FincaCard key={finca.id} name={finca.name} image={finca.image} />
      ))}
    </ListContainer>
  );
};

export default FincaList;