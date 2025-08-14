import Block, { TEvents } from "../../framework/Block";

type TButtonProps = {
  text?: string;
  events?: TEvents;
};

export default class Button extends Block {
  constructor({ text, events }: TButtonProps) {
    super({ text, events });
  }

  render() {
    return `<button class="button">{{text}}</button>`;
  }
}
