import EventBus from "./EventBus";
import { set } from "../utils";
import { EStoreEvents, TAppState } from "../types";

class Store extends EventBus {
  constructor() {
    super();

    this.on(EStoreEvents.Updated, () => {console.log("Store updated", this.getState());});
  }

  private state: TAppState = {};

  public getState(): TAppState {
    return this.state;
  }

  public set(path: string, value: unknown) {
    set(this.state, path, value);
    this.emit(EStoreEvents.Updated);
  }

  public clear() {
    this.state = {};
    this.emit(EStoreEvents.Updated);
  }
}

export default new Store();
