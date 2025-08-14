import Block from "../../framework/Block";
import { TValidateType, validate } from "../../utils/validation";
import { Label } from "../Label/Label";
import SimpleInput from "../SimpleInput/SimpleInput";

type TProps = {
  name: string;
  value?: string;
  type?: string;
  placeholder?: string;
  label?: string;
  validateType?: TValidateType;
};

export default class Input extends Block {
  constructor(props: TProps) {
    const onBlur = (e: Event) => {
      if (e.target) {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        const fieldName = target.name;
        const validateType = target.dataset.validate as TValidateType;

        if (!validateType) {
          return console.warn(`Не указан тип валидации для поля ${fieldName}`);
        }

        const validationError = validate([{
          value,
          validateType,
          fieldName,
        }])[0];

        if (validationError) {
          console.error(validationError[fieldName]);
        } else {
          console.log(`Поле ${fieldName} прошло валидацию`);
        }
      }
    };

    const simpleInput = new SimpleInput({ ...props, events: { blur: onBlur } });
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
      ${this.props.hasLabel ? "{{{Label}}}" : ""}
      {{{SimpleInput}}}
    </span>`;
  }
}
