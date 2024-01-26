import { $$session, SessionRoles } from "./index"
import { ReactNode } from "react"
import { useUnit } from "effector-react";

type VisibleByRole = {
  roles: SessionRoles[]
  children: ReactNode
  excludeMode?: boolean
}

export const VisibleByRole = (props: VisibleByRole) => {
  const session = useUnit($$session)
  const { children, roles, excludeMode } = props

  let isVisible = roles?.some((role) => role === session?.role)

  if (excludeMode ? !isVisible : isVisible) {
    return <>{children}</>
  } else {
    return <></>
  }
}