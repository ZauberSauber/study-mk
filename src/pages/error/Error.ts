import { ROUTES } from "../../constants";
import Block from "../../framework/Block";

export type TProps = {
  errorCode: number;
  message?: string;
};

export class ErrorPage extends Block {
  constructor() {
    super({
      errorCode: window.location.pathname.split("/")[1],
    });
  }

  protected render(): string {
    const { errorCode, message = "Что-то пошло не так" } = this.props;

    return `
    <main>
      <section class="page-error">
        <span class="error-code">${ errorCode }</span>
        <span class="error-text">${ message }</span>
      </section>
      <section class="page-error__footer">
        <a href="${ROUTES.home}">Перейти на главную</a>
      </section>
    </main>`;
  }
}
