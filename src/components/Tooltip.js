import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TooltipContainer, Arrow } from '../styles/Tooltip.styles';

const Tooltip = ({ text, targetRef, show }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!targetRef.current || !show) return;

    const updatePosition = () => {
      const rect = targetRef.current.getBoundingClientRect();
      setPosition({
        x: rect.right,
        y: rect.top + rect.height / 2
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [targetRef, show]);

  return ReactDOM.createPortal(
    <>
      <Arrow 
        show={show} 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: 'translateY(-50%)'
        }} 
      />
      <TooltipContainer 
        show={show} 
        style={{ 
          left: `${position.x + 5}px`, 
          top: `${position.y}px`,
          transform: 'translateY(-50%)'
        }}
      >
        {text}
      </TooltipContainer>
    </>,
    document.body
  );
};

export default Tooltip;
