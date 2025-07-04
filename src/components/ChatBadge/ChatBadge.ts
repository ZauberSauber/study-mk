import Block from "../../framework/Block";

type TProps = {
  name?: string;
  lastMessage?: string;
};

export default class ChatBadge extends Block {
  constructor({ name, lastMessage }: TProps) {
    super({ name, lastMessage });
  }

  render() {
    return `
    <div class="chat-badge">
      <img class="badge-icon" src="">
      <div class="badge-content">
        <title class="badge-name">${this.props.name}</title>
        <p class="badge-message">${this.props.lastMessage}</p>
      </div>
    </div>`;
  }
}
