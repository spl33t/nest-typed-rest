import { Button, Input } from "antd";

import { setLogin, $login, $password, setPassword } from "./model";
import { useUnit } from "effector-react";
import styled from "styled-components";
import { useState } from "react";
import { $$session } from "@/shared/session";

export const AuthPage = () => {
  const [authType, setAuthType] = useState<"signUp" | "signIn">("signUp")
  const { login, password } = useUnit({ login: $login, password: $password })


  function submitForm() {
    if (authType === "signUp") {
      $$session.signUp({ body: { login, password, role: "admin" } })
    }
    if (authType === "signIn") {
      $$session.signIn({ body: { login, password } })
    }
  }

  return (
    <Wrapper>
      <div>
        <div>Логин</div>
        <div>Регистрация</div>
      </div>
      <Form>
        <Input onChange={(e) => setLogin(e.target.value)} value={login} />
        <Input onChange={(e) => setPassword(e.target.value)} value={password} />
        <Button onClick={() => submitForm()}>Войти</Button>
      </Form>
    </Wrapper>
  );
};
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`