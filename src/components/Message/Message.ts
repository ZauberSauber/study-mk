import Block from "../../framework/Block";

type TProps = {
  isInterlocutor?: boolean;
  text?: string;
  time?: string;
};

export default class Input extends Block {
  constructor({ isInterlocutor = false, text = "", time = "" }: TProps) {
    super({ isInterlocutor, text, time });
  }

  render() {
    return `
    ${this.props.isInterlocutor ? '<div class="message message_interlocutor">' : '<div class="message">'}
      <span class="message-text">${this.props.text}</span>
      <span class="message-time">${this.props.time}</span>
    </div>`;
  }
}
