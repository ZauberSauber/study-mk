import Block, { TEvents } from "../../framework/Block";

type TButtonProps = {
  className?: string;
  text?: string;
  events?: TEvents;
  type?: HTMLButtonElement["type"];
};

export default class Button extends Block {
  constructor({ text, events, type = "button", className }: TButtonProps) {
    super({ text, events, type, className });
  }

  render() {
    return `<button class="button {{className}}" type="{{type}}"}>{{text}}</button>`;
  }
}
