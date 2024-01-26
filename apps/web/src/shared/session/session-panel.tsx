import { useUnit } from "effector-react";
import { $$session } from "@/shared/session/index";
import { Button } from "antd";
import { VisibleByRole } from "@/shared/session/visible-by-role";

export const SessionPanel = () => {
  const { user } = useUnit($$session)
  return (
    <>
      {/*     <Button onClick={() => $$session.startRefresh()}>start refresh</Button>*/}
      <VisibleByRole roles={["GUEST"]} excludeMode={true}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div>{user?.login} / {user?.role}</div>
          <Button onClick={() => $$session.logout()}>Выйти</Button>
        </div>
      </VisibleByRole>

      <VisibleByRole roles={["GUEST"]}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div>Гость</div>
          <Button>Вход</Button>
        
        </div>
      </VisibleByRole>
    </>
  );
};
