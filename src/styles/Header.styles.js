import styled from "styled-components";

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background-color:rgb(56, 85, 37);
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
`;

export const LogoImage = styled.img`
  height: 40px;
  margin-right: 10px;
`;

export const MenuIcon = styled.div`
  margin-right: 15px;
  cursor: pointer;
  font-size: 20px;
`;

export const SearchBar = styled.div`
  position: relative;
  width: 400px;
  max-width: 400px;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 0 15px;
`;

export const SearchInput = styled.input`
  background-color: transparent;
  color: white;
  border: none;
  padding: 8px 10px;
  width: 100%;
  font-size: 14px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    outline: none;
  }
`;

export const SearchIcon = styled.div`
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

export const UserIcon = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #fff;
  color: #1fab89;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  
  &.avatar {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
`;

export const UserMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 250px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: ${props => (props.isOpen ? "flex" : "none")};
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
`;

export const UserEmail = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  
  .email {
    color: #333;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #333;
  width: 100%;
  text-align: left;
  font-size: 14px;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  .icon {
    margin-right: 10px;
    color: #1fab89;
  }
`; 