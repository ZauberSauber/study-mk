import Block, { TEvents } from "../../framework/Block";

type TProps = {
  name: string;
  value?: string;
  type?: string;
  placeholder?: string;
  validateType?: string;
  events?: TEvents;
};

export default class SimpleInput extends Block {
  constructor({ name, value = "", type = "text", placeholder = "", validateType, events }: TProps) {
    super({
      name,
      type,
      validateType,
      value,
      placeholder,
      events,
    });
  }

  render() {
    return `<input type="${this.props.type}" name="${this.props.name}" value="${this.props.value}" placeholder="${this.props.placeholder}" data-validate="${this.props.validateType || ""}" />`;
  }
}
