import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: ${(props) => (props.isOpen ? "220px" : "64px")};
  height: calc(100vh - 60px);
  background-color: rgb(255, 255, 255);
  color: #333;
  transition: width 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isOpen ? "flex-start" : "center")};
  padding-top: 0;
  box-shadow: 2px 0 5px rgba(23, 22, 22, 0.05);
  border-right: 1px solid rgb(241, 237, 237);
  overflow-y: auto;
  overflow-x: visible;
  flex-shrink: 0;
  margin-top: 60px;
  position: relative;
  z-index: 1;
`;

export const IconButton = styled.div`
  font-size: 18px;
  padding: ${(props) => (props.isOpen ? "10px 16px" : "10px 0")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isOpen ? "flex-start" : "center")};
  width: 100%;
  transition: all 0.3s ease-in-out;
  color: #333;
  border-radius: 4px;
  margin: 4px 0;
  overflow: visible;
  will-change: transform;
  transform-origin: left center;
  position: relative;
  
  &:hover {
    background-color: rgba(107, 163, 54, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.05);
    color: rgb(56, 85, 37);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  
  svg {
    min-width: 20px;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.15);
  }
  
  /* Tooltip simple y directo */

`;

export const ButtonText = styled.span`
  margin-left: ${(props) => (props.isOpen ? "12px" : "0")};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  display: ${(props) => (props.isOpen ? "block" : "none")};
  transition: opacity 0.3s ease-in-out;
  font-weight: 500;
  white-space: nowrap;
  font-size: 0.85rem;
  color: #555;
  will-change: opacity, transform;
`;
