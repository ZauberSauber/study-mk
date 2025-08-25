import { Button, Input } from "../../components";
import Block, { TBlockProps } from "../../framework/Block";
import { validateForm } from "../../utils/validation";

type TRegistrationProps = {
  events: TBlockProps;
};

export class RegistrationPage extends Block {
  constructor(props: TRegistrationProps) {
    const loginInput = new Input({ name: "login", placeholder: "Логин", validateType: "login" });
    const passwordInput = new Input({ name: "password", placeholder: "Пароль", validateType: "password" });
    const passwordRepeatInput = new Input({ name: "password-r", placeholder: "Повторите пароль", validateType: "password" });
    const firstNameInput = new Input({ name: "first-name", placeholder: "Имя", validateType: "name" });
    const secondNameInput = new Input({ name: "second-name", placeholder: "Фамилия", validateType: "name" });
    const emailInput = new Input({ name: "email", placeholder: "Email", validateType: "email" });
    const phoneInput = new Input({ name: "phone", placeholder: "Телефон", validateType: "phone" });
    const createButton = new Button({
      text: "Создать аккаунт",
      type: "submit",
      events: {
        click: (e: Event) => {
          e.preventDefault();
          validateForm({ formId: "registration-form" });
        }
      }
    });

    super({
      ...props,
      LoginInput: loginInput,
      PasswordInput: passwordInput,
      PasswordRepeatInput: passwordRepeatInput,
      CreateButton: createButton,
      FirstNameInput: firstNameInput,
      SecondNameInput: secondNameInput,
      EmailInput: emailInput,
      PhoneInput: phoneInput,
      events: props.events,
    });
  }

  render() {
    return `
    <main>
      <h2>Регистрация</h2>

      <form action="#" id="registration-form">
        <div class="block">
          {{{FirstNameInput}}}
        </div>

        <div class="block">
          {{{SecondNameInput}}}
        </div>

        <div class="block">
          {{{LoginInput}}}
        </div>

        <div class="block">
          {{{EmailInput}}}
        </div>

        <div class="block">
          {{{PhoneInput}}}
        </div>

        <div class="block">
          {{{PasswordInput}}}
        </div>

        <div class="block">
          {{{PasswordRepeatInput}}}
        </div>

        <div class="block">
          {{{CreateButton}}}
        </div>
      </form>

      <a data-nav="home">Вернуться на гавную</a>
    </main>`;
  }
}
