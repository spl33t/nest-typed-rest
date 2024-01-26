import { $$getUserByIdQuery } from "@/pages/user/model";
import { useUnit } from "effector-react";

export const UserPage = () => {
  const { data: user } = useUnit($$getUserByIdQuery);

  return (
    <div>
      <div>id: {user?.id}</div>
      <div>login: {user?.login}</div>
      <div>role: {user?.role}</div>
      <div>name: {user?.name}</div>
    </div>
  );
};