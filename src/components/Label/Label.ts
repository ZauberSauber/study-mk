import Block from "../../framework/Block";

type TProps = {
  text: string;
};

export class Label extends Block {
  constructor(props: TProps) {
    super(props);
  }

  render() {
    return this.props?.text ? `<label>${this.props.text}</label>` : "";
  }
}
