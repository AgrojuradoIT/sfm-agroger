import styled from "styled-components";

export const ListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export const Navigation = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  font-weight: 500;
  color: #333;
  background-color: white;
  width: 100%;
  height: 40px;
  margin-top: 6px;
  border-bottom: 1px solid #eaeaea;
  box-sizing: border-box;
  overflow: hidden;

  .nav-item {
    display: flex;
    align-items: center;
  }

  .nav-icon, .separator {
    margin: 0 5px;
    color: #666;
  }

  .nav-link {
    color: #666;
    cursor: pointer;
    white-space: nowrap;
    
    &:hover {
      color: #1fab89;
    }
  }

  .current {
    color: #333;
    font-weight: 500;
    white-space: nowrap;
  }
`;

export const ContentArea = styled.div`
  padding: 20px;
  flex: 1;
  width: 100%;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  background-color: white;
`;

export const PageTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
  font-weight: 500;
  font-size: 18px;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
`;

export const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 95%;
  max-width: 1200px;
  padding: 15px;
  overflow-x: hidden;
`;