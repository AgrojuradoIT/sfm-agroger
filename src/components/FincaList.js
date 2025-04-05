// src/components/FincaList.js
import React from "react";
import FincaCard from "./FincaCard";
import { FaAngleRight } from "react-icons/fa";
import { 
  ListWrapper, 
  Navigation, 
  ContentArea, 
  ListContainer 
} from "../styles/FincaList.styles";

import fincaAImage from "../assets/fincaA.png";
import fincaBImage from "../assets/fincaB.png";
import fincaCImage from "../assets/fincaC.png";
import fincaDImage from "../assets/fincaD.png";

// Datos de las fincas con sus respectivas imágenes
const fincas = [
  { id: 'a', name: "FINCA A", image: fincaAImage },
  { id: 'b', name: "FINCA B", image: fincaBImage },
  { id: 'c', name: "FINCA C", image: fincaCImage },
  { id: 'd', name: "FINCA D", image: fincaDImage }
];

const FincaList = () => {
  return (
    <ListWrapper>
      <Navigation>
        <div className="nav-item">
          <span className="nav-link">Menu</span>
        </div>
        <div className="separator">
          <FaAngleRight />
        </div>
        <div className="nav-item">
          <span className="current">Fincas</span>
        </div>
      </Navigation>
      <ContentArea>
        <ListContainer>
          {fincas.map((finca) => (
            <FincaCard 
              key={finca.id}
              id={finca.id}
              name={finca.name} 
              image={finca.image} 
            />
          ))}
        </ListContainer>
      </ContentArea>
    </ListWrapper>
  );
};

export default FincaList;