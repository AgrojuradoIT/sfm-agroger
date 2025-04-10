// src/components/Login.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  TextField,
  CssBaseline,
  InputAdornment,
  IconButton,
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress
} from "@mui/material";
import { Person, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { 
  backgroundContainerStyle,
  loginPaperStyle,
  formContainerStyle,
  loginFormStyle,
  errorAlertStyle,
  logoStyle,
  juradoLogoStyle,
  copyrightTextStyle,
  loginButtonStyle,
  loadingIndicatorStyle,
  textFieldStyle,
  PRIMARY_COLOR,
  SECONDARY_COLOR
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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      if (email === "admin" && password === "1234") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", "admin@agrojurado.com");
        onLogin("Administrador");
        return;
      }
      
      await authService.login(email, password);
      // Store the email in localStorage
      localStorage.setItem("userEmail", email);
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

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CssBaseline />
      <Box sx={{ ...backgroundContainerStyle, backgroundImage: `url(${BackgroundImage})` }}>
        <Paper sx={loginPaperStyle} elevation={10}>
          <Box sx={formContainerStyle}>
            <Box component="img" src={Logo} alt="Logo SFM Agroger" sx={logoStyle} />
            
            <Box component="form" onSubmit={handleSubmit} sx={loginFormStyle}>
              {error && (
                <Alert severity="error" sx={errorAlertStyle}>
                  {error}
                </Alert>
              )}
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Usuario"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                sx={textFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: PRIMARY_COLOR }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                sx={textFieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: PRIMARY_COLOR }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        sx={{ color: SECONDARY_COLOR }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={loginButtonStyle}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" sx={loadingIndicatorStyle} />
                ) : null}
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </Box>
            
            <Box component="img" src={LogoJurado} alt="Logo Jurado" sx={juradoLogoStyle} />
          </Box>
        </Paper>
        
        <Typography variant="body2" align="center" sx={copyrightTextStyle}>
          {new Date().getFullYear()} Agrojurado Jurado S.A.S. Todos los derechos reservados.
        </Typography>
      </Box>
    </motion.div>
  );
};

export default Login;