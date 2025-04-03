// src/components/Login.js
import React, { useState } from "react";
import { 
  Container, 
  LoginBox, 
  LogoImage, 
  LogoJuradoImage, 
  Input, 
  Button, 
  Copyright 
} from "../styles/LoginStyles";
import Logo from "../assets/Logo.png";
import LogoJurado from "../assets/Logo-Jurado.png";
import BackgroundImage from "../assets/Fondo-Login.jpg";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      onLogin();
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <Container backgroundImage={BackgroundImage}>
      <LoginBox>
        <LogoImage src={Logo} alt="Logo" />
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Iniciar sesión</Button>
        </form>
        <LogoJuradoImage
          src={LogoJurado}
          alt="Logo Jurado"
          top="10px"
          left="0px"
          right="0px"
          bottom="0px"
        />
      </LoginBox>
      <Copyright>
        © {new Date().getFullYear()} Agrojurado Jurado S.A.S. Todos los derechos reservados.
      </Copyright>
    </Container>
  );
};

export default Login;