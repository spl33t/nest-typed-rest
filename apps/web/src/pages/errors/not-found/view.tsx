import { router } from "@/shared/routing";

export const NotFoundPage = () => {

  return (
    <div>
      <h2>Ой... Мы не можем найти эту страницу!</h2>
      <p>Мы сожалеем, но страница на которую Вы пытались перейти не существует.<br/>Пожалуйста
        вернитесь на <span style={{ color: "blue", cursor: "pointer" }} onClick={() => router.back()}>предыдущую страницу</span> или
        воспользуйтесь меню сайта.</p>
    </div>
  );
};