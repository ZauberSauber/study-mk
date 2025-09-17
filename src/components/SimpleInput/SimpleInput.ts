import Block, { TEvents } from "../../framework/Block";

type TProps = Partial<HTMLInputElement> & {
  validateType?: string;
  events?: TEvents;
};

export default class SimpleInput extends Block {
  constructor(props: TProps) {
    super(props);
  }

  render() {
    const attributes = Object.entries(this.props).map(([key, value]) => {
      if (["events", "validateType"].includes(key)) {
        return "";
      }

      return `${key}="${value}"`;
    }).join(" ");

    return `
      <input
        ${attributes}
        placeholder="${this.props.placeholder || ""}"
        data-validate="${this.props.validateType || ""}"
      />`;
  }
}
