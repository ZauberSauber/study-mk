import Block, { TBlockProps } from "../../framework/Block";
import { Avatar, Input, Button } from "../../components";
import { validateForm } from "../../utils/validation";

type TProps = {
  events: TBlockProps;
  test?: string;
};

export class SettingsPage extends Block {
  constructor(props: TProps) {
    const avatar =  new Avatar({ atlText: "Ваш аватар" });
    const avatarButton =  new Button({ text: "Выбрать новый аватар" });
    const firstNameInput = new Input({ name: "first_name", label: "Имя", value: "Иван", validateType: "name" });
    const secondNameInput = new Input({ name: "second_name", label: "Фамилия", value: "Иванов", validateType: "name" });
    const patronymicInput = new Input({ name: "patronymic", label: "Отчество", value: "Иванович", validateType: "name" });
    const displayNameImput = new Input({ name: "display_name", label: "Отображаемое имя", value: "Иван Иванович" });
    const emailInput = new Input({ name: "email", label: "Электронная почта", value: "ivanov_ii@yandex.ru", validateType: "email" });
    const phoneInput = new Input({ name: "phone", type: "tel", label: "Телефон", value: "+79999999999", validateType: "phone" });
    const loginInput = new Input({ name: "login", label: "Логин", value: "ivanovii", validateType: "login" });
    const oldPasswordInput = new Input({ name: "oldPassword", label: "Действующий пароль", value: "*****" });
    const newPasswordInput = new Input({ name: "newPassword", label: "Новый пароль", validateType: "password" });
    const saveButton = new Button({ text: "Сохранить", events: { click: (e: Event) => this.onSave(e) } });

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
      events: props.events,
    });
  }

  formId = "settings-form";

  onSave(e: Event) {
    e.preventDefault();

    validateForm({ formId: "settings-form" });
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

      <a data-nav="home">Вернуться на гавную</a>
  </main>`;
  }
}
