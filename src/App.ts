import { authApi } from "./api";
import { ROUTES } from "./constants";
import { Router } from "./framework/Router";
import Store from "./framework/Store";
import { ChatPage, ErrorPage, HomePage, LoginPage, RegistrationPage, SettingsPage } from "./pages";

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

    if (Object.values(ROUTES).includes(currentPath)) {
      try {
        const user = await authApi.getUser();

        Store.set("user", user);

        if (user) {
          this.router.go(currentPath);
        } else {
          if (currentPath === ROUTES.home || currentPath === ROUTES.login || currentPath === ROUTES.registration) {
            this.router.go(currentPath);
          } else {
            this.router.go(ROUTES.login);
          }
        }
      } catch (error) {
        console.error("Произошла ошибка:", error);
        this.router.go(ROUTES.login);
      }
    } else {
      this.router.go("/error");
    }
  }

  private registerRoutes() {
    router
      .use(ROUTES.home, HomePage)
      .use(ROUTES.registration, RegistrationPage)
      .use(ROUTES.login, LoginPage)
      .use(ROUTES.settings, SettingsPage)
      .use(ROUTES.chat, ChatPage)
      .use("/error", ErrorPage);
  }
}
