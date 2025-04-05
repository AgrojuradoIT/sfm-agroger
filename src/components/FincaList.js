// src/components/FincaList.js
import React from "react";
import styled from "styled-components";
import FincaCard from "./FincaCard";
import { FaChevronRight, FaAngleRight } from "react-icons/fa";

import fincaAImage from "../assets/fincaA.png";
import fincaBImage from "../assets/fincaB.png";
import fincaCImage from "../assets/fincaC.png";
import fincaDImage from "../assets/fincaD.png";

const ListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const Navigation = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  font-weight: 500;
  color: #333;
  background-color: white;
  width: 100%;
  height: 40px;
  margin-top: 6px;
  border-bottom: 1px solid #eaeaea;
  box-sizing: border-box;
  overflow: hidden;

  .nav-item {
    display: flex;
    align-items: center;
  }

  .nav-icon, .separator {
    margin: 0 5px;
    color: #666;
  }

  .nav-link {
    color: #666;
    cursor: pointer;
    white-space: nowrap;
    
    &:hover {
      color: #1fab89;
    }
  }

  .current {
    color: #333;
    font-weight: 500;
    white-space: nowrap;
  }
`;

const ContentArea = styled.div`
  padding: 20px;
  flex: 1;
  width: 100%;
  overflow-x: hidden;
`;

const PageTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
  font-weight: 500;
  font-size: 18px;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 100%;
  padding: 0;
  overflow-x: hidden;
`;

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