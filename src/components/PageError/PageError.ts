import Block from "../../framework/Block";

type TProps = {
  errorCode?: string;
  errorText?: string;
};

export default class PageError extends Block {
  constructor({ errorCode, errorText = "" }: TProps) {
    super({ errorCode, errorText });
  }

  render() {
    return `
    <section class="page-error">
      <span class="error-code">${this.props.errorCode}</span>
      <span class="error-text">${this.props.errorText}</span>
    </section>`;
  }
}
