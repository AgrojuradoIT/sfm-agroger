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
  overflow-x: hidden;
  flex-shrink: 0;
  margin-top: 60px;
  position: relative;
  z-index: 10;
`;

export const IconButton = styled.div`
  font-size: 18px;
  padding: ${(props) => (props.isOpen ? "10px 16px" : "10px 0")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isOpen ? "flex-start" : "center")};
  width: 100%;
  transition: all 0.2s ease-in-out;
  color: #333;
  border-radius: 4px;
  margin: 4px 0;
  overflow: visible;
  will-change: transform;
  transform-origin: left center;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
  
  svg {
    min-width: 20px;
  }
`;

export const ButtonText = styled.span`
  margin-left: ${(props) => (props.isOpen ? "12px" : "0")};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  display: ${(props) => (props.isOpen ? "block" : "none")};
  transition: opacity 0.2s ease-in-out;
  font-weight: 500;
  white-space: nowrap;
  font-size: 0.85rem;
  color: #555;
  will-change: opacity, transform;
`;