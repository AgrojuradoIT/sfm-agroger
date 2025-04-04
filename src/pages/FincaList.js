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
  const [loading, setLoading] = useState(true);

  const loadFincas = async () => {
    try {
      setLoading(true);
      const data = await fetchFincas(); // Asegúrate de que fetchFincas sea asíncrona
      setFincas(data);
    } catch (error) {
      console.error("Error loading fincas:", error);
      setFincas([]); // O manejar el error de otra forma
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFincas();
  }, []);

  if (loading) {
    return <div>Cargando fincas...</div>; // Indicador de carga
  }

  return (
    <ListContainer>
      {fincas.map((finca) => (
        <FincaCard key={finca.id} name={finca.name} image={fincaImages[finca.name] || ""} />
      ))}
    </ListContainer>
  );
};

export default FincaList;