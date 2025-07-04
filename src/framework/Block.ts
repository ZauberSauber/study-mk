import EventBus, { TCallback } from "./EventBus";
import { v4 as makeUUID } from "uuid";
import Handlebars from "handlebars";

type TEvents = {
  [key: string]: (e: Event) => void
};

export type TBlockProps = {
  events?: TEvents;
  attr?: Record<string, string>;
  [key: string]: unknown;
};

export default class Block {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render"
  };

  _element: HTMLElement | null = null;
  _id: string = "";
  
  props: TBlockProps = {};
  eventBus;
  children: Record<string, Block> = {};
  lists: Record<string, Block[]> = {};

  constructor(propsWithChildren = {}) {
    const eventBus = new EventBus();

    const { props, children, lists } = this._getChildren(propsWithChildren);

    this._id = makeUUID();
    this.children = children;
    this.lists = lists;
    this.props = this._makePropsProxy(props);

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this) as TCallback);
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  protected init(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount() {
    this.componentDidMount();
    Object.values(this.children).forEach(child => { child.dispatchComponentDidMount(); });
  }

  protected componentDidMount(oldProps: TBlockProps = {}) {
    console.log(oldProps);
  }

  protected dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: TBlockProps, newProps: TBlockProps) {
    const response = this.componentDidUpdate(oldProps, newProps);

    if (!response) {
      return;
    }

    this._render();
  }

  protected componentDidUpdate(oldProps: TBlockProps = {}, newProps: TBlockProps = {}) {
    console.log(oldProps, newProps);
    return true;
  }

  private _getChildren(propsAndChildren: TBlockProps): {
    children: Record<string, Block>,
    props: TBlockProps,
    lists: Record<string, Block[]>
  } {
    const children: Record<string, Block> = {};
    const props: TBlockProps = {};
    const lists: Record<string, Block[]> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else if (Array.isArray(value)) {
        lists[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props, lists };
  }

  protected addAttributes(): void {
    const { attr = {} } = this.props;

    Object.entries(attr).forEach(([key, value]) => {
      if (this._element) {
        this._element.setAttribute(key, value as string);
      }
    });
  }

  protected setAttributes(attr: Record<string, string | boolean | number>): void {
    Object.entries(attr).forEach(([key, value]) => {
      if (this._element) {
        this._element.setAttribute(key, value as string);
      }
    });
  }

  public setProps = (nextProps: TBlockProps) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  private _render() {
    const propsAndStubs = { ...this.props };
    const tmpId = makeUUID();

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    Object.entries(this.lists).forEach(([key]) => {
      propsAndStubs[key] = `<div data-id="${tmpId}"></div>`;
    });

    const fragment = this._createDocumentElement("template");
    fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);

    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);

      if (stub && child.getContent()) {
        stub.replaceWith(child.getContent() as HTMLElement);
      }
    });

    Object.entries(this.lists).forEach(([key, children]) => {
      const stub = fragment.content.querySelector(`[data-list-id="${key}"]`);

      if (!stub) {
        return;
      }

      const fragmentContainer = document.createDocumentFragment();

      children.forEach(child => {
        if (!child.element) {
          child.getContent();
        }

        if (!child.getContent()) {
          return;
        }

        fragmentContainer.appendChild(child.getContent() as HTMLElement);
      });

      stub.replaceWith(fragmentContainer);
    });

    const newElement = fragment.content.firstElementChild as HTMLElement;

    if (this._element && newElement) {
      this._element.replaceWith(newElement);
    }

    this._element = newElement;
    this._addEvents();
    this.addAttributes();
  }

  // Переопределяется пользователем. Необходимо вернуть разметку
  protected render(): string {
    return "";
  }

  public getContent(): HTMLElement | null {
    if (!this._element) {
      return null;
    }

    return this.element as HTMLElement;
  }

  private _makePropsProxy(props: TBlockProps): TBlockProps {
    return new Proxy(props, {
      get(target: Record<string, unknown>, prop: string) {
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set: (target: Record<string, unknown>, prop: string, value: unknown) => {
        if ((prop as string)[0] === "_") {
          throw new Error("Отказано в доступе к приватному свойству");
        } else {
          const oldTarget = { ...target };

          target[prop] = value;
          this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
          return true;
        }
      },
      deleteProperty(target, prop) {
        if ((prop as string)[0] === "_") {
          throw new Error("Отказано в доступе к приватному свойству");
        } else {
          delete target[prop as keyof TBlockProps];
          return true;
        }
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLTemplateElement {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName) as HTMLTemplateElement;
  }

  protected show(): void {
    const content = this.getContent();

    if (content) {
      content.style.display = "block";
    }
  }

  protected hide(): void {
    const content = this.getContent();

    if (content) {
      content.style.display = "none";
    }
  }

  private _addEvents() {
    const { events } = this.props;

    if (!events) {
      return;
    }

    Object.keys(events).forEach(eventName => {
      if (this._element) {
        this._element.addEventListener(eventName as keyof HTMLElementEventMap, events[eventName as keyof HTMLElementEventMap]);
      }
    });
  }
}
