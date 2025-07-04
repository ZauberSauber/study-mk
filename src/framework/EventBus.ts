export type TCallback = (...args: unknown[]) => void;

export default class EventBus {
  constructor() {
    this.on = this.on.bind(this);
    this.emit = this.emit.bind(this);
    this.off = this.off.bind(this);
    
    this._listeners = {};
  }

  _listeners: { [key: string]: TCallback[]} = {};

  on(eventName: string, callback: TCallback) {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }

    this._listeners[eventName].push(callback);
  }
  
  off(eventName: string, callback: TCallback) {
    if (!this._listeners[eventName]) {
      throw new Error(`Нет события: ${eventName}`);
    }

    this._listeners[eventName] = this._listeners[eventName].filter(event => event !== callback);
  }
  
  emit(eventName: string, ...args: unknown[]) {
    if (!this._listeners[eventName]) {
      throw new Error(`Нет события: ${eventName}`);
    }

    this._listeners[eventName].forEach(listener => {
      listener(...args);
    });
  }
}
