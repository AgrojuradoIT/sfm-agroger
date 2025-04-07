import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

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
  border-left: 4px solid #4CAF50;
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
    color: #4CAF50;
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

const WelcomeNotification = ({ username, profileImage, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 60000); // 1 minuto = 60,000 ms
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <NotificationContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <ProfileImage 
        src={profileImage || 'https://i.imgur.com/J6LXqYF.png'} 
        alt="Perfil" 
      />
      <Message>
        ¡Bienvenido <strong>{username}</strong> a SFM AGROGER!
      </Message>
      <CloseButton onClick={onClose}>
        <FaTimes />
      </CloseButton>
    </NotificationContainer>
  );
};

export default WelcomeNotification;
