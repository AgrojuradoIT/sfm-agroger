import styled from 'styled-components';

export const TooltipContainer = styled.div`
  position: fixed;
  background-color: rgba(56, 85, 37, 0.9);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 9999;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s;
`;

export const Arrow = styled.div`
  position: fixed;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid rgba(56, 85, 37, 0.9);
  z-index: 9999;
  pointer-events: none;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s;
`;
