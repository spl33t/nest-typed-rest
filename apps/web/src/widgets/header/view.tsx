import { Link } from "atomic-router-react";
import { routes } from "@/shared/routing";
import { MenuItem } from "@/widgets/nav";
import styled from "styled-components";
import { SessionPanel } from "@/shared/session/session-panel";

export const Header = () => {
  return (
    <HeaderWrapper>
      <Link to={routes.home.route}><Logo>effector-role-based-routing</Logo></Link>
      <nav style={{ display: "flex" }}>
        <ul style={{ display: "flex", gap: 20, margin: 0, padding: 0 }}>
          <MenuItem routeInstance={routes.users}>Пользователи</MenuItem>
        </ul>
      </nav>
      <SessionPanel/>
    </HeaderWrapper>
  );
};

const Logo = styled.div`
  font-weight: 800;
  transition: 0.4s;
  
  &:hover {
    color: #274797;
  }
`
const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #eeea;
  border: 1px solid #d6d6d6;
  box-shadow: 0 3px 5px 0 #00000024;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
`