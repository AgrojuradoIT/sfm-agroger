import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: ${(props) => (props.isOpen ? "200px" : "60px")};
  height: calc(100vh - 60px);
  background-color:rgb(255, 255, 255);
  color: #333;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isOpen ? "flex-start" : "center")};
  padding-top: 0;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
  margin-top: 60px;
`;

export const IconButton = styled.div`
  font-size: 20px;
  padding: ${(props) => (props.isOpen ? "12px 20px" : "12px 0")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isOpen ? "flex-start" : "center")};
  width: 100%;
  transition: all 0.3s;
  color: #333;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  svg {
    min-width: 20px;
  }
`;

export const ButtonText = styled.span`
  margin-left: ${(props) => (props.isOpen ? "15px" : "0")};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  display: ${(props) => (props.isOpen ? "block" : "none")};
  transition: opacity 0.3s;
  font-weight: 500;
  white-space: nowrap;
`; 