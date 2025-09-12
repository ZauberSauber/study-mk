import { isEqual } from "../utils";
import Block from "./Block";

type TRouteProps = {
  rootSelector: string;
};

function render(selector: string, block: Block): HTMLElement {
  const root = document.querySelector(selector);

  if (!root) {
    throw new Error(`Не найден элемент по селектору: ${selector}`);
  }

  root.innerHTML = "";
  root.append(block.getContent() as HTMLElement);

  return root as HTMLElement;
}

class Route {
  private _pathname: string;
  private _blockClass: new (props?: Record<string, unknown>) => Block;
  private _block: Block | null;
  private _props: TRouteProps;

  constructor(pathname: string, view: new (props?: Record<string, unknown>) => Block, props: TRouteProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {}

  match(pathname: string) {
    return isEqual(pathname, this._pathname);
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass({});
      render(this._props.rootSelector, this._block);

      return;
    }
  }
}

export class Router {
  private static __instance: Router;
  private routes: Route[] = [];
  private history: History = window.history;
  private _currentRoute: Route | null = null;
  private _rootQuery: string = "";

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  static getInstance(): Router {
    if (!Router.__instance) {
      throw new Error("Роутер не был инициализирован");
    }

    return Router.__instance;
  }

  use(pathname: string, block: new (props?: Record<string, unknown>) => Block): this {
    const route = new Route(pathname, block, { rootSelector: this._rootQuery });

    this.routes.push(route);

    return this;
  }

  start() {
    window.onpopstate = ((event: PopStateEvent) => {
      const target = event.currentTarget as Window;

      this._onRoute(target.location.pathname);
    }).bind(this);

    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    const route = this.getRoute(pathname);

    if (!route) {
      return;
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string) {
    return this.routes.find(route => route.match(pathname));
  }
}
