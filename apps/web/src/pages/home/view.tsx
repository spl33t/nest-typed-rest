import { useUnit } from "effector-react";
import { $count, increment } from "./model";

export const HomePage = () => {
  const count = useUnit($count)

  return (
    <div>
      <h1>Welcome to effector-role-based-routing [DEMO]</h1>
      <button onClick={() => increment()}>Клик</button>
      {count}
    </div>
  );
};