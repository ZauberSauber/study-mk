import Block from "../../framework/Block";

type TProps = {
  src?: string;
  atlText?: string;
};

export default class Avatar extends Block {
  constructor({ src, atlText }: TProps) {
    super({ src, atlText });
  }

  render() {
    return `<img class="avatar" src="${this.props.src}" alt="${this.props.atlText}">`;
  }
}
