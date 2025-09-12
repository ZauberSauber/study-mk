import { authApi, chatApi } from "../../api";
import { Button, ChatBadge, Input, Message, Form, Overlay } from "../../components";
import { ROUTES } from "../../constants";
import Block from "../../framework/Block";
import { Router } from "../../framework/Router";
import Store from "../../framework/Store";
import { EStoreEvents, TChat, TMessage } from "../../types";
import { isEqual, isPlainObject } from "../../utils";
import { formatDate } from "../../utils/formatDate";


type TChatProps = {
  chats?: TChat[],
  chatName?: string,
  messages?: TMessage[],
};

export class ChatPage extends Block {
  chatName = "";
  token = "";
  webSocket: WebSocket | null = null;
  pingInterval: NodeJS.Timeout | null = null;
  reconnectAttempts = 0;
  maxReconnectAttempts = 5;

  constructor(props?: TChatProps) {
    const menuButton = new Button({ text: "Меню" });
    const overlay = new Overlay();

    const createChatInput = new Input({ name: "newChat", label: "Новый чат" });
    const createChatButton = new Button({ type: "submit", text: "Создать" });

    const createChatForm = new Form({
      formId: "create-chat-form",
      contentBlocks: {
        createChatInput,
        createChatButton,
      },
      template: "{{{createChatInput}}} {{{createChatButton}}}",
      events: {
        submit: (e) => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const chatName = formData.get("newChat");

          if (chatName) {
            this.createChat(chatName as string);
          }
        }
      },
    });

    const removeChatButton = new Button({
      text: "Удалить чат",
      events: {
        click: () => {
          const chatId = prompt("Введите id чата для удаления");

          if (!chatId) {
            return;
          }

          chatApi.deleteChat(+chatId)
            .then(() => {
              this.wsDestroy();

              const { chats = [] } = Store.getState();
              const filteredChats = chats.filter((chat) => chat.id !== +chatId);

              Store.set("chats", filteredChats);
              this.setProps({ chats: filteredChats });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }
    });

    const logoutButton = new Button({
      text: "Выйти",
      events: {
        click: () => {
          authApi.logout()
            .then(() => {
              Store.set("user", null);
              Store.set("chats", []);
              Store.set("currentChatId", null);
              Router.getInstance().go(ROUTES.login);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }
    });

    const addUserToChatButton = new Button({
      text: "Добавить пользователя в чат",
      type: "button",
      events: {
        click: () => {
          const chatId = Store.getState().currentChatId;

          if (!chatId) {
            return alert("Для добавления пользователя в чат необходимо выбрать чат");
          }

          const userId = prompt("Введите id пользователя для добавления");

          if (userId) {
            chatApi.addUsers([+userId], chatId);
          }
        }
      }
    });

    const removeUserFromChatButton = new Button({
      text: "Удалить пользователя из чата",
      type: "button",
      events: {
        click: () => {
          const chatId = Store.getState().currentChatId;

          if (!chatId) {
            return alert("Для удаления пользователя из чата необходимо выбрать чат");
          }

          const userId = prompt("Введите id пользователя для удаления");

          if (userId) {
            chatApi.deleteUsers([+userId], chatId);
          }
        }
      }
    });

    const getChatUsersButton = new Button({
      text: "Получить пользователей чата",
      type: "button",
      events: {
        click: () => {
          const chatId = Store.getState().currentChatId;

          if (!chatId) {
            return alert("Для получения пользователей чата необходимо выбрать чат");
          }

          chatApi.getUsers(chatId).then((users) => {
            if (users) {
              const listContainer = document.querySelector(".chat-users");

              listContainer?.replaceChildren(...users.map((user) => {
                const listEl = document.createElement("li");

                listEl.textContent = `${user.id} :: ${user.display_name}`;

                return listEl;
              }));
            }
          });
        }
      }
    });

    const sendButton = new Button({ type: "submit", className: "send-button", text: ">" });
    const messageSendForm = new Form({
      formId: "message-send-form",
      contentBlocks: {
        sendButton,
      },
      template: `
        <textarea id="user-input" name="message" placeholder="Сообщение..."></textarea>
        {{{sendButton}}}`,
      events: {
        submit: (e) => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const message = formData.get("message");

          if (message) {
            this.wsSend({
              type: "message",
              content: message,
            });
          }

          form.reset();
        }
      }
    });

    super({
      ...props,
      MenuButton: menuButton,
      createChatForm,
      messageSendForm,
      removeChatButton,
      addUserToChatButton,
      removeUserFromChatButton,
      logoutButton,
      getChatUsersButton,
      overlay,
      events: {
        click: async (e) => {
          const target: HTMLElement = e.target as HTMLElement;

          if (!target) {
            return;
          }

          if (target.classList.contains("chat-badge")) {
            const chatId = target.dataset.id as string;

            Store.set("currentChatId", chatId);

            this.initWebSocket();

            this.chatName = chatId;
            this.setProps({ chatName: chatId });
          }
        }
      }
    });

    this.lists.chatList = [];
    this.lists.messages = [];

    Store.on(EStoreEvents.Updated, () => { });
  }

  setOverlay(isVisible: boolean) {
    const overlayEl = document.querySelector(".overlay");

    if (!overlayEl) {
      return;
    }

    if (isVisible) {
      overlayEl.classList.remove("overlay_hidden");
    } else {
      overlayEl.classList.add("overlay_hidden");
    }
  }

  async initWebSocket() {
    const { currentChatId } = Store.getState();

    if (!currentChatId) {
      return;
    }

    const response = await chatApi.getToken(currentChatId);

    this.token = response.token || "";

    this.wsDestroy();
    this.wsConnect();
  }

  wsConnect() {
    const { user, currentChatId } = Store.getState();

    this.webSocket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${user?.id}/${currentChatId}/${this.token}`);
    this.webSocket.addEventListener("open", () => {
      console.log("WebSocket connection opened");
      this.reconnectAttempts = 0;

      this.pingInterval = setInterval(() => {
        this.wsSend({ type: "ping" });
      }, 300);

      // полкучение старых сообщений
      setTimeout(() => {
        this.webSocket?.send(JSON.stringify({
          type: "get old",
          content: 0,
        }));
      }, 100);

    });

    this.webSocket.addEventListener("message", this.wsOnMessage.bind(this));

    this.webSocket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
      this.wsCleanup();
      this.wsReconnect();
    });
  }

  wsDestroy() {
    if (this.webSocket) {
      if (this.webSocket.readyState === WebSocket.OPEN) {
        this.webSocket.close();
      }

      this.webSocket = null;
    }

    this.wsCleanup();
  }

  wsCleanup() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
  }

  wsSend(message: string | Record<string, unknown>) {
    if (this.webSocket?.readyState === WebSocket.OPEN) {
      this.webSocket.send(JSON.stringify(message));
    }
  }

  wsOnMessage(messageEvent: MessageEvent) {
    const data = JSON.parse(messageEvent.data);

    if (Array.isArray(data)) {
      Store.set("lastMessages", data);
      this.setProps({ messages: data });
    }

    if (isPlainObject(data)) {
      if ((data as TMessage).type === "message") {
        const { lastMessages=[] } = Store.getState();
        const newMessages = [...lastMessages, data];

        Store.set("lastMessages", newMessages);
        this.setProps({ messages: newMessages });
      }
    }
  };

  wsReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.wsConnect(), 2000);
    }
  }

  createChatList() {
    const chats = Store.getState()?.chats || [];

    return chats.map((chat) => {
      return new ChatBadge({ chat });
    });
  }

  createMessageList() {
    const { lastMessages = [], currentChatId, user } = Store.getState();

    if (!currentChatId) {
      return [];
    }

    return lastMessages.map((message) => {
      return new Message({
        isInterlocutor: message.user_id !== user?.id,
        text: message.content,
        time: formatDate(message.time),
      });
    });
  }

  async getChats() {
    this.setOverlay(true);

    chatApi.getChats().then((chats) => {
      Store.set("chats", chats);
      this.setProps({ chats });
    }).catch((error) => { console.error(error); })
      .finally(() => this.setOverlay(false));
  }

  createChat(title: string) {
    this.setOverlay(true);

    chatApi.createChat(title)
      .then(() => {
        this.getChats();
      })
      .catch((error) => { console.error(error); });
  }

  protected componentDidMount(): void {
    this.getChats();
  }

  protected componentDidUpdate(oldProps: TChatProps, newProps: TChatProps): boolean {
    let isChanged = false;

    if (!isEqual(oldProps.chats, newProps.chats)) {
      this.lists.chatList = this.createChatList();

      isChanged = true;
    }

    if (!isEqual(oldProps.messages, newProps.messages)) {
      this.lists.messages = this.createMessageList().reverse();

      isChanged = true;
    }

    return isChanged;
  }

  protected componentWillUnmount(): void {
    this.wsDestroy();
  }

  render() {
    return `
    <main class="chat-page">
      {{{overlay}}}
      <aside>
          <nav class="chat-nav">
            <ul>
              <li><a href="${ROUTES.settings}">В настройки</a></li>
              <li><a href="${ROUTES.home}">На главную</a></li>
            </ul>
          </nav>

          <div class="chat-list">
            {{{chatList}}}
          </div>

      </aside>

      <div class="chat-content">
        <div class="chat-active">
          <img src="activeSrs" class="active-icon" alt="Иконка чата">
          <title class="active-name">${this.chatName} Название активного чата</title>
        </div>
        <div class="messages">
          {{{messages}}}
        </div>
        <div class="chat-input">
          {{{messageSendForm}}}
        </div>
      </div>

      <menu class="chat-menu">
        <div class="block">
          {{{logoutButton}}}
        </div>

        <div class="block">
          {{{createChatForm}}}
        </div>

        <div class="block">
          {{{removeChatButton}}}
        </div>
        
        <div class="block">
          {{{getChatUsersButton}}}
        </div>

        <div class="block">
          {{{addUserToChatButton}}}
        </div>

        <div class="block">
          {{{removeUserFromChatButton}}}
        </div>
        
      </menu>

      <section class="chat-info">
        <ul class="chat-users"></ul>
      </section>
    </main>
    `;
  }
}
