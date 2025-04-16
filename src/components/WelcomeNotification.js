import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { 
  NotificationContainer, 
  ProfileImage, 
  Message, 
  CloseButton 
} from '../styles/WelcomeNotificationStyles';

const WelcomeNotification = ({ fullName, profileImage, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 seconds
    
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
        ¡Bienvenido <strong>{fullName}</strong> a SFM AGROGER!
      </Message>
      <CloseButton onClick={onClose}>
        <FaTimes />
      </CloseButton>
    </NotificationContainer>
  );
};

export default WelcomeNotification;
