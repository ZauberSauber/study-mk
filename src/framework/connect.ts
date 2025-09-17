import { EStoreEvents, TAppState } from "../types";
import { isEqual } from "../utils";
import Block from "./Block";
import Store from "./Store";

type TMapStateToProps = (state: TAppState) => Record<string, unknown>;

export function connect(mapStateToProps: TMapStateToProps) {
  return function <T extends Record<string, unknown>>(Component: new (props: T) => Block<T>) {
    return class extends Component {
      protected _connectStoreUpdate: () => void;

      constructor(props: T) {
        const state = mapStateToProps(Store.getState());

        super({ ...props, ...state } as T);

        let currentState = state;

        this._connectStoreUpdate = () => {
          const newState = mapStateToProps(Store.getState());

          if (!isEqual(currentState, newState)) {
            this.setProps({ ...newState } as T);
            currentState = newState;
          }
        };

        Store.on(EStoreEvents.Updated, this._connectStoreUpdate);
      }
    };
  };
}
