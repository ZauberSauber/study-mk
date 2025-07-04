import Block from "../../framework/Block";
import { Avatar, Input, Button } from "../../components";
import { TValidateData, TValidateType, validate } from "../../utils/validation";

type TProps = {
  test?: string;
};

export class SettingsPage extends Block {
  constructor(props: TProps) {
    const handleBlur = (e: Event) => {
      if (e.target) {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        const fieldName = target.name;
        const validateType = target.dataset.validate as TValidateType;

        if (!validateType) {
          return console.warn(`Не указан тип валидации для поля ${fieldName}`);
        };

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

    const avatar =  new Avatar({ atlText: "Ваш аватар" });
    const avatarButton =  new Button({ text: "Выбрать новый аватар" });
    const firstNameInput = new Input({ name: "first_name", label: "Имя", value: "Иван", validateType: "name", onBlur: handleBlur });
    const secondNameInput = new Input({ name: "second_name", label: "Фамилия", value: "Иванов", validateType: "name", onBlur: handleBlur });
    const patronymicInput = new Input({ name: "patronymic", label: "Отчество", value: "Иванович", validateType: "name", onBlur: handleBlur });
    const displayNameImput = new Input({ name: "display_name", label: "Отображаемое имя", value: "Иван Иванович", onBlur: handleBlur });
    const emailInput = new Input({ name: "email", label: "Электронная почта", value: "ivanov_ii@yandex.ru", validateType: "email", onBlur: handleBlur });
    const phoneInput = new Input({ name: "phone", type: "tel", label: "Телефон", value: "+79999999999", validateType: "phone", onBlur: handleBlur });
    const loginInput = new Input({ name: "login", label: "Логин", value: "ivanovii", validateType: "login", onBlur: handleBlur });
    const oldPasswordInput = new Input({ name: "oldPassword", label: "Действующий пароль", value: "*****" });
    const newPasswordInput = new Input({ name: "newPassword", label: "Новый пароль", validateType: "password", onBlur: handleBlur });
    const saveButton = new Button({ text: "Сохранить" });

    super({
      ...props,
      Avatar: avatar,
      AvatarButton: avatarButton,
      FirstNameInput: firstNameInput,
      SecondNameInput: secondNameInput,
      PatronymicInput: patronymicInput,
      DisplayNameInput: displayNameImput,
      EmailInput: emailInput,
      PhoneInput: phoneInput,
      LoginInput: loginInput,
      OldPasswordInput: oldPasswordInput,
      NewPasswordInput: newPasswordInput,
      SaveButton: saveButton,
      events: {
        submit: (e: Event) => this.onSave(e),
      }
    });
  }

  onSave(e: Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());

    console.log("Данные формы:", data);

    const inputs = document.getElementById("settings-form")?.getElementsByTagName("input");

    if (!inputs || !inputs?.length) {
      return console.error("Не удалось получить элементы формы");
    }

    const valodationErrors = validate(Array.prototype.map.call(inputs, (input: HTMLInputElement) => {
      return {
        value: input.value,
        validateType: input.dataset.validate as TValidateType,
        fieldName: input.name,
      };
    }) as TValidateData[]);

    if (valodationErrors.length) {
      valodationErrors.forEach((error) => {
        console.error(error);
      });
    } else {
      console.log("Все поля формы прошли валидацию");
    }
  }

  render() {
    return `
    <main>
      <h2>Настройки</h2>

      <form id="settings-form">
        <div class="block">
          {{{Avatar}}}
          {{{AvatarButton}}}
        </div>

        <div class="block">
          {{{FirstNameInput}}}
        </div>

        <div class="block">
          {{{SecondNameInput}}}
        </div>

        <div class="block">
          {{{PatronymicInput}}}
        </div>

        <div class="block">
          {{{DisplayNameInput}}}
        </div>

        <div class="block">
          {{{EmailInput}}}
        </div>

        <div class="block">
          {{{PhoneInput}}}
        </div>

        <div class="block">
          {{{LoginInput}}}
        </div>

        <div class="block">
          {{{OldPasswordInput}}}
        </div>

        <div class="block">
          {{{NewPasswordInput}}}
        </div>

        <div class="block">
          {{{SaveButton}}}
        </div>
      </form>

      <a href="/">home page</a>
  </main>`;
  }
}
