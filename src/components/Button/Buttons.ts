import Block from "../../framework/Block";

type TButtonProps = {
  text?: string;
};

export default class Button extends Block {
  constructor({text}: TButtonProps) {
    super({text});
  }

  render() {
    return `<button class="button">{{text}}</button>`;
  }
}
