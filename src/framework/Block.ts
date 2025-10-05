import EventBus, { TCallback } from "./EventBus";
import { v4 as makeUUID } from "uuid";
import Handlebars from "handlebars";

export type TEvents = {
  [key: string]: (e: Event) => void
};

export type TBlockProps = {
  events?: TEvents;
  attr?: Record<string, string>;
  [key: string]: unknown;
};

export default class Block<TProps extends TBlockProps = TBlockProps> {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_CWU: "flow:component-will-unmount",
    FLOW_RENDER: "flow:render"
  };

  isMounted = false;

  _element: HTMLElement | null = null;
  _id: string = "";

  props: TProps;
  eventBus;
  children: Record<string, Block> = {};
  lists: Record<string, Block[]> = {};

  constructor(propsWithChildren: TProps = {} as TProps) {
    const eventBus = new EventBus();

    const { props, children, lists } = this._getChildren(propsWithChildren);

    this._id = makeUUID();
    this.children = children;
    this.lists = lists;
    this.props = this._makePropsProxy(props as TProps);

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this) as TCallback);
    eventBus.on(Block.EVENTS.FLOW_CWU, this._componentWillUnmount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  protected init(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount() {
    this.componentDidMount();

    Object.values(this.children).forEach(child => {
      child.dispatchComponentDidMount();
    });

    Object.values(this.lists).flat().forEach(child => {
      child.dispatchComponentDidMount();
    });
  }

  protected componentDidMount() {}

  protected dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: TProps, newProps: TProps) {
    const response = this.componentDidUpdate(oldProps, newProps);

    if (!response) {
      return;
    }

    this._render();
  }

  protected componentDidUpdate(oldProps: TProps, newProps: TProps) {
    console.log(oldProps, newProps);

    return true;
  }

  private _componentWillUnmount() {
    this.componentWillUnmount();
  }

  protected componentWillUnmount() {}

  private _getChildren(propsAndChildren: TProps): {
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

  public setProps = (nextProps: TProps) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  private _render() {
    const propsAndStubs: Record<string, unknown> = { ...this.props } as Record<string, unknown>;

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    Object.entries(this.lists).forEach(([key]) => {
      propsAndStubs[key] = `<div data-list-id="${key}"></div>`;
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
      this._removeEvents();
      this._element.replaceWith(newElement);
      this.eventBus().emit(Block.EVENTS.FLOW_CWU);
    }

    this._element = newElement;
    this._addEvents();
    this.addAttributes();

    if (!this.isMounted) {
      this.isMounted = true;
      this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }
  }

  // Переопределяется пользователем. Необходимо вернуть разметку
  protected render(): string {
    return "";
  }

  public getContent(): HTMLElement | null {
    if (!this._element) {
      throw new Error("Нет элемента");
    }

    return this.element as HTMLElement;
  }

  private _makePropsProxy(props: TProps): TProps {
    return new Proxy(props, {
      get(target, prop: string) {
        const value = target[prop];

        return typeof value === "function" ? value.bind(target) : value;
      },
      set: (target, prop: string, value: unknown) => {
        if ((prop as string)[0] === "_") {
          throw new Error("Отказано в доступе к приватному свойству");
        } else {
          const oldTarget = { ...target };

          target[prop as keyof TProps] = value as TProps[keyof TProps];
          this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);

          return true;
        }
      },
      deleteProperty(target, prop) {
        if ((prop as string)[0] === "_") {
          throw new Error("Отказано в доступе к приватному свойству");
        } else {
          delete target[prop as keyof TProps];

          return true;
        }
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLTemplateElement {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName) as HTMLTemplateElement;
  }

  show(): void {
    const content = this.getContent();

    if (content) {
      content.style.display = "block";
    }
  }

  hide(): void {
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

  private _removeEvents() {
    const { events } = this.props;

    if (!events) {
      return;
    }

    Object.keys(events).forEach(eventName => {
      if (this._element) {
        this._element.removeEventListener(eventName as keyof HTMLElementEventMap, events[eventName as keyof HTMLElementEventMap]);
      }
    });
  }
}
