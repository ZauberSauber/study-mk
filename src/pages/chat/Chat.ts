import { Button, ChatBadge, Message } from "../../components";
import Block, { TBlockProps } from "../../framework/Block";
import { chats, messages } from "./chatMock";

type TChatProps = {
  events: TBlockProps,
};

export class ChatPage extends Block {
  constructor(props: TChatProps) {
    const menuButton = new Button({ text: "Меню" });
    const chatList = chats.map((chat) => {
      return new ChatBadge({
        lastMessage: chat.lastMessage,
        name: chat.name,
      });
    });
    const messageList = messages.map((message) => {
      return new Message({
        isInterlocutor: message.isInterlocutor,
        text: message.text,
        time: message.time,
      });
    });

    super({
      ...props,
      MenuButton: menuButton,
      chatList,
      messageList,
      events: props.events,
    });

    this.lists.chatList = chatList;
    this.lists.messages = messageList;
  }

  render() {
    return `
    <main class="chat-page">
    <aside>
        <div class="chat-menu">
            {{{MenuButton}}}
        </div>

        <div class="chat-list">
          {{{chatList}}}
        </div>

        <a data-nav="home">Вернуться на гавную</a>
    </aside>

    <div class="chat-content">
       <div class="chat-active">
            <img src="activeSrs" class="active-icon" alt="Иконка чата">
            <title class="active-name">Название активного чата</title>
       </div>
       <div class="messages">
            {{{messageList}}}
       </div>
       <div class="chat-input">
            <textarea id="user-input" name="message" placeholder="Сообщение..."></textarea>
            <button class="send-button">></button>
       </div>
    </div>
</main>`;
  }
}
