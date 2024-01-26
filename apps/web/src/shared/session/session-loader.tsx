import React, { ReactNode } from 'react';
import { useUnit } from "effector-react";
import { $$session } from "@/shared/session/index";

export const SessionLoader = (props: { children: ReactNode }) => {
  const session = useUnit($$session)

  if (!session.sessionIsLoaded)
    return (
      <div style={{
        height: "100vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex"
      }}>
        Загрузка сессии
      </div>
    );

  return <>{props.children}</>
};
