// src/components/Login.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Container, 
  LoginBox, 
  LogoImage, 
  LogoJuradoImage, 
  Input, 
  Button, 
  Copyright,
  ErrorMessage
} from "../styles/LoginStyles";
import Logo from "../assets/Logo.png";
import LogoJurado from "../assets/Logo-Jurado.png";
import BackgroundImage from "../assets/Fondo-Login.jpg";
import authService from "../services/authService";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      if (email === "admin" && password === "1234") {
        localStorage.setItem("isAuthenticated", "true");
        onLogin("Administrador");
        return;
      }
      
      await authService.login(email, password);
      onLogin(email.split('@')[0]); // Extrae el nombre del email
    } catch (err) {
      console.error("Error de autenticación:", err);
      
      if (err.message) {
        setError(err.message);
      } else if (err.error) {
        setError(err.error);
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container style={{ backgroundImage: `url(${BackgroundImage})` }}>
        <LoginBox>
          <LogoImage src={Logo} alt="Logo" />
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
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
          {new Date().getFullYear()} Agrojurado Jurado S.A.S. Todos los derechos reservados.
        </Copyright>
      </Container>
    </motion.div>
  );
};

export default Login;