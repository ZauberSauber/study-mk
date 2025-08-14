import Block from "./framework/Block";
import { ChatPage, ErrorPage, HomePage, LoginPage, RegistrationPage, SettingsPage, TErrorPageProps } from "./pages";

type TAppState = {
  currentPage: string;
};

type TPageData = Record<string, unknown>;

const DEFAULT_TITLE = "Мой чат";

const pages: { [key: string]: { title?: string, Page: typeof Block, data?: TPageData } } = {
  home: {
    title: "Главная",
    Page: HomePage
  },
  settings: {
    title: "Настройки",
    Page: SettingsPage,
  },
  chat: {
    title: "Чат",
    Page: ChatPage,
  },
  login: {
    title: "Авторизация",
    Page: LoginPage,
  },
  registration: {
    title: "Регистрация",
    Page: RegistrationPage,
  },
  error: {
    title: "Ошибка",
    Page: ErrorPage
  }
};

export default class App {
  private state: TAppState;
  private appElement: HTMLElement | null;

  constructor() {
    this.state = {
      currentPage: "home",
    };

    this.appElement = document.getElementById("app");
    this.render();
  }

  render() {
    let page = pages[this.state.currentPage];

    if (!page) {
      page = pages.error;
      page.data  = {
        errorCode: 404,
        message: "Страница не найдена",
      } as TErrorPageProps;
    }

    document.title = page?.title || DEFAULT_TITLE;

    const currentPage = new page.Page({
      events: {
        click: (e: Event) => this.onClick(e)
      },
      ...page.data,
    });

    if (this.appElement) {
      this.appElement.replaceChildren(currentPage.getContent() as HTMLElement);
    }
  }

  changePage(page: string): void {
    this.state.currentPage = page;
    this.render();
  }

  private onClick = (e: Event) => {
    e.preventDefault();

    if (e.target instanceof HTMLAnchorElement) {
      const target = e.target as HTMLElement;
      const page = target.dataset.nav;

      if (page) {
        this.changePage(page);
      }
    }
  };
}
