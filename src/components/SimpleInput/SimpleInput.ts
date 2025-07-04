import Block from "../../framework/Block";

type TProps = {
  name: string;
  value?: string;
  type?: string;
  placeholder?: string;
  validateType?: string;
  onBlur?: (e: Event) => void;
};

export default class SimpleInput extends Block {
  constructor({ name, value = "", type = "text", placeholder = "", validateType, onBlur }: TProps) {
    super({
      name,
      type,
      validateType,
      value,
      placeholder,
      events: {
        ...(onBlur ? { blur: onBlur } : null),
      },
    });
  }

  render() {
    return `<input type="${this.props.type}" name="${this.props.name}" value="${this.props.value}" placeholder="${this.props.placeholder}" data-validate="${this.props.validateType || ""}" />`;
  }
}
