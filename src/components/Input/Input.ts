import Block from "../../framework/Block";
import { TValidateType } from "../../utils/validation";
import { Label } from "../Label/Label";
import SimpleInput from "../SimpleInput/SimpleInput";

type TProps = {
  name: string;
  value?: string;
  type?: string;
  placeholder?: string;
  label?: string;
  validateType?: TValidateType;
  onBlur?: (e: Event) => void;
};

export default class Input extends Block {
  constructor(props: TProps) {
    const simpleInput = new SimpleInput(props);
    const label = new Label({ text: props?.label || "" });

    super({
      hasLabel: !!props.label,
      SimpleInput: simpleInput,
      Label: label,
    });
  }

  render() {
    return `
    <span class="input">
      ${this.props.hasLabel && "{{{Label}}}"}
      {{{SimpleInput}}}
    </span>`;
  }
}
