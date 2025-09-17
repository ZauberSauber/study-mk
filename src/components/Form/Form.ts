import Block, { TEvents } from "../../framework/Block";

type TProps = {
  formId: string,
  template: string,
  contentBlocks: { [key: string]: Block },
  events: TEvents & { submit: (e: Event) => void | Promise<void> },
};

export default class Form extends Block {
  constructor(props: TProps) {
    super({
      ...props.contentBlocks,
      template: props.template,
      formId: props.formId,
      events: props.events,
    });
  }

  render() {
    return `<form action="#" id="${this.props.formId}">${this.props.template}</form>`;
  }
}
