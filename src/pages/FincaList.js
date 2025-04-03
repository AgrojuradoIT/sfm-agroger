// src/components/FincaList.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FincaCard from "../components/FincaCard";
import { fetchFincas } from "../controllers/FincaController";
import fincaAImage from "../assets/fincaA.png";
import fincaBImage from "../assets/fincaB.png";
import fincaCImage from "../assets/fincaC.png";
import fincaDImage from "../assets/fincaD.png";

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  padding: 20px;
  justify-items: center;
`;

const fincaImages = {
  "Finca A": fincaAImage,
  "Finca B": fincaBImage,
  "Finca C": fincaCImage,
  "Finca D": fincaDImage,
};

const FincaList = ({ onSync }) => {
  const [fincas, setFincas] = useState([]);

  const loadFincas = () => {
    const data = fetchFincas();
    setFincas(data);
  };

  useEffect(() => {
    loadFincas();
  }, []);

  return (
    <ListContainer>
      {fincas.map((finca) => (
        <FincaCard key={finca.id} name={finca.name} image={fincaImages[finca.name] || ""} />
      ))}
    </ListContainer>
  );
};

export default FincaList;

