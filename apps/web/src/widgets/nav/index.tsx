import { Link, LinkProps } from "atomic-router-react"
import React, { FC, ReactNode } from "react"
import styled from "styled-components"
import { RouteInstanceCustom } from "@/shared/routing/routes-factory";
import { VisibleByRole } from "@/shared/session/visible-by-role";

interface MenuItemProps extends Omit<LinkProps<any>, "to" | "params" | "query"> {
  routeInstance: RouteInstanceCustom<any>
  children: ReactNode
  icon?: ReactNode
}


export const MenuItem = (props: MenuItemProps) => {

  return (
    <VisibleByRole roles={props.routeInstance?.access}>
      <Link
        to={props.routeInstance?.route}
        className={props.className}
        activeClassName={props.activeClassName}
      >
        <MenuItemWrapper>
          <MenuItemIcon>{props.icon}</MenuItemIcon>
          <MenuItemTitle>{props.children}</MenuItemTitle>
        </MenuItemWrapper>
      </Link>
    </VisibleByRole>
  )
}

const MenuItemWrapper = styled.div`
  display: flex;
  padding: 0 10px;
  font-size: 18px;
  color: #545D69;
  cursor: pointer;
  border-radius: 12px;
  transition: 0.4s;

  &:hover {
    background: #274797;
    color: cornsilk;
  }
`
const MenuItemTitle = styled.div``
const MenuItemIcon = styled.div`
  width: 0;
`