import { router } from "@/shared/routing";

export const NotAccessPage = () => {
  return (
    <div>
      <h2>Вам сюда нельзя!</h2>
      <p>Мы сожалеем, в данный момент у вас нет доступа к этой странице.<br/>Пожалуйста
        вернитесь на <span style={{ color: "blue", cursor: "pointer" }} onClick={() => router.back()}>предыдущую страницу</span> или
        воспользуйтесь меню сайта.</p>
    </div>
  );
};