// src/styles/LoginStyles.js
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
`;

export const LoginBox = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 350px;
  position: relative;
`;

export const LogoImage = styled.img`
  width: 120px;
  margin-bottom: 20px;
`;

export const LogoJuradoImage = styled.img`
  width: 120px;
  margin-top: 30px;
  position: relative;
  top: ${(props) => props.top || "0px"};
  bottom: ${(props) => props.bottom || "0px"};
  left: ${(props) => props.left || "0px"};
  right: ${(props) => props.right || "0px"};
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box; 
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
  box-sizing: border-box; 

  &:hover {
    background-color: #218838;
  }
`;

export const Copyright = styled.div`
  margin-top: 20px;
  color: white;
  font-size: 14px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  text-align: center;
`;