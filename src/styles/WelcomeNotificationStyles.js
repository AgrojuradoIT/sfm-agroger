import { motion } from 'framer-motion';
import styled from 'styled-components';

// Colores de la empresa
const primaryColor = 'rgb(56, 85, 37)';
const secondaryColor = 'rgb(107, 163, 54)';

export const NotificationContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  border-left: 4px solid ${secondaryColor};
  max-width: 350px;
`;

export const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const Message = styled.div`
  font-size: 14px;
  color: #333;
  flex-grow: 1;
  
  strong {
    color: ${primaryColor};
    font-weight: 600;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;
  transition: color 0.2s;
  
  &:hover {
    color: #333;
  }
`;
