import Block from "../../framework/Block";

export type TProps = {
  errorCode: number;
  message?: string;
};

export class ErrorPage extends Block {
  constructor() {
    super();
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
        <a data-nav="home">Перейти на главную</a>
      </section>
    </main>`;
  }
}
