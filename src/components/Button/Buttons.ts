import Block, { TEvents } from "../../framework/Block";

type TButtonProps = {
  text?: string;
  events?: TEvents;
  type?: HTMLButtonElement["type"];
};

export default class Button extends Block {
  constructor({ text, events, type = "button" }: TButtonProps) {
    super({ text, events, type });
  }

  render() {
    return `<button class="button" type="{{type}}"}>{{text}}</button>`;
  }
}
