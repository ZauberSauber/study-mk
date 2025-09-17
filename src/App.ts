import { authApi } from "./api";
import { ROUTES } from "./constants";
import CustomError from "./framework/CustomError";
import { Router } from "./framework/Router";
import Store from "./framework/Store";
import { ChatPage, LoginPage, RegistrationPage, SettingsPage } from "./pages";
import { EHttpStatus } from "./types/network";

const router = new Router("#app");

export default class App {
  router: Router;

  constructor() {
    this.router = router;
    this.registerRoutes();

    this.init();
  }

  async init() {
    const currentPath = window.location.pathname;

    if (!Object.values(ROUTES).includes(currentPath)) {
      return this.router.start();
    }


    await authApi.getUser()
      .then((user) => {
        if (user) {
          Store.set("user", user);
        }

        if (currentPath === ROUTES.home || currentPath === ROUTES.registration) {
          return this.router.go(ROUTES.chat);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          return console.log(`Ошибка при получении пользователя: ${error.message}`);
        }

        if (error instanceof CustomError) {
          if (error.status === EHttpStatus.Unauthorized) {
            if (currentPath === ROUTES.home || currentPath === ROUTES.registration) {
              return this.router.go(currentPath);
            }
          }

          return this.router.go(ROUTES.home);
        }
      })
      .finally(() => this.router.start());
  }

  private registerRoutes() {
    router
      .use(ROUTES.home, LoginPage)
      .use(ROUTES.registration, RegistrationPage)
      .use(ROUTES.settings, SettingsPage)
      .use(ROUTES.chat, ChatPage);
  }
}
