import { ROUTES } from "../../constants";
import Block from "../../framework/Block";

export class HomePage extends Block {
  constructor() {
    super();
  }

  render() {
    return `
    <main>
      <h1>Главная страница</h1>

      <nav>
        <ul>
          <li><a href="${ROUTES.home}">Логин</a></li>
          <li><a href="${ROUTES.registration}">Регистрация</a></li>
          <li><a href="${ROUTES.chat}">В чат</a></li>
        </ul>
      </nav>
    </main>`;
  }
}
