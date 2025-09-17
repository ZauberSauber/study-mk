import Block from "../../framework/Block";
import { TChat } from "../../types";

type TProps = {
  chat: TChat;
};

export default class ChatBadge extends Block {
  constructor({ chat }: TProps) {
    const chatId = chat.id;
    const name = chat.title;
    const lastMessage = chat.last_message?.content || "В чате ещё нет сообщений";

    super({ name, lastMessage, chatId });
  }

  render() {
    return `
    <div class="chat-badge" data-id="${this.props.chatId}" data-title="${this.props.name}">
      <img class="badge-icon" src="" alt="Иконка чата">
      <div class="badge-content">
        <title class="badge-name">${this.props.name}</title>
        <p class="badge-message">${this.props.lastMessage}</p>
      </div>
    </div>`;
  }
}
