import { expect } from "chai";
import sinon from "sinon";
import { Router } from "./Router";
import Block from "./Block";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', {
  url: "http://localhost:3000"
});

global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.history = dom.window.history;
global.Event = dom.window.Event;

class HomePage extends Block {
  render() {
    return "<div>Home Page</div>";
  }
}

class SettingsPage extends Block {
  render() {
    return "<div>Settings Page</div>";
  }
}

describe("Router", () => {
  let router: Router;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    window.history.replaceState(null, "", "/");

    resetRouterInstance();

    router = new Router("#app");
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  function resetRouterInstance() {
    const routerClass = Router as unknown as { __instance: Router | null };

    if (routerClass.__instance) {
      routerClass.__instance = null;
    }
  }

  it("Должен создавать экземпляр роутера", () => {
    expect(router).to.be.instanceOf(Router);
  });

  it("Должен регистрировать роуты через use()", () => {
    router
      .use("/", HomePage)
      .use("/settings", SettingsPage);

    const route1 = router.getRoute("/");
    const route2 = router.getRoute("/settings");

    expect(route1).to.not.be.null;
    expect(route2).to.not.be.null;
  });

  it("Должен переходить по указанному пути с помощью go()", () => {
    router
      .use("/", HomePage)
      .use("/settings", SettingsPage)
      .start();

    router.go("/settings");
    expect(window.location.pathname).to.equal("/settings");
  });

  it("Должен отображать правильный компонент при переходе", () => {
    router
      .use("/", HomePage)
      .use("/settings", SettingsPage)
      .start();

    router.go("/settings");
    const content = document.querySelector("#app")?.innerHTML;

    expect(content).to.include("Settings Page");
  });

  it("Должен перенаправлять на страницу ошибки", () => {
    router
      .use("/", HomePage)
      .start();

    router.go("/not-an-app-route");
    const content = document.querySelector("#app")?.innerHTML;

    expect(content).to.include("Что-то пошло не так");
  });

  it("Должен быть синглтоном", () => {
    const router1 = new Router("#app");
    const router2 = new Router("#app");

    expect(router1).to.equal(router2);
  });

  it("Должен выбрасывать ошибку при получении экземпляра без инициализации", () => {
    resetRouterInstance();

    expect(() => Router.getInstance()).to.throw("Роутер не был инициализирован");
  });
});
