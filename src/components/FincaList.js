// src/components/FincaList.js
import React, { useState, useEffect } from "react";
import FincaCard from "./FincaCard";
import { FaAngleRight } from "react-icons/fa";
import { 
  ListWrapper, 
  Navigation, 
  ContentArea, 
  ListContainer 
} from "../styles/FincaList.styles";
import authService from "../services/authService";

import fincaAImage from "../assets/fincaA.png";
import fincaBImage from "../assets/fincaB.png";
import fincaCImage from "../assets/fincaC.png";
import fincaDImage from "../assets/fincaD.png";

// Datos de las fincas con sus respectivas imágenes
const fincasData = [
  { id: 'a', name: "FINCA A", image: fincaAImage },
  { id: 'b', name: "FINCA B", image: fincaBImage },
  { id: 'c', name: "FINCA C", image: fincaCImage },
  { id: 'd', name: "FINCA D", image: fincaDImage }
];

const FincaList = () => {
  const [fincas, setFincas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Obtener información del usuario y sus permisos
        const userData = await authService.getCurrentUser();
        setUserInfo(userData);

        if (userData) {
          const { usuario, permisos } = userData;
          let fincasFiltradas = [...fincasData];

          // Si el usuario es evaluador, solo mostrar la finca a la que pertenece
          if (permisos.rol_tipo === 'evaluador' && usuario.idFinca) {
            // Determinar qué finca corresponde según idFinca
            const idFincaLetra = getLetraFinca(usuario.idFinca);
            fincasFiltradas = fincasData.filter(finca => finca.id === idFincaLetra);
          } 
          // Si el usuario es operario, no mostrar ninguna finca
          else if (permisos.rol_tipo === 'operario') {
            fincasFiltradas = [];
          }
          // Los administradores y coordinadores ven todas las fincas

          setFincas(fincasFiltradas);
        } else {
          // Si hay error o no hay datos, mostrar fincas por defecto
          setFincas(fincasData);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        setFincas(fincasData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Función auxiliar para mapear el ID numérico de finca al ID de letra usado en el frontend
  const getLetraFinca = (idFinca) => {
    // Esto es un mapeo de ejemplo, ajusta según tu backend
    const mapping = {
      1: 'a', // Finca A tiene ID 1 en la base de datos
      2: 'b', // Finca B tiene ID 2 en la base de datos
      3: 'c', // Finca C tiene ID 3 en la base de datos
      4: 'd'  // Finca D tiene ID 4 en la base de datos
    };
    return mapping[idFinca] || 'a'; // Valor por defecto es 'a'
  };

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
        {loading ? (
          <p>Cargando fincas...</p>
        ) : (
          <ListContainer>
            {fincas.map((finca) => (
              <FincaCard 
                key={finca.id}
                id={finca.id}
                name={finca.name} 
                image={finca.image} 
              />
            ))}
            {fincas.length === 0 && (
              <p>No tienes acceso a ninguna finca. Contacta con el administrador.</p>
            )}
          </ListContainer>
        )}
      </ContentArea>
    </ListWrapper>
  );
};

export default FincaList;