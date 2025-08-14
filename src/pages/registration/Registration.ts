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
    const createButton = new Button({
      text: "Создать аккаунт",
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
      events: {
        ...props.events,
      }
    });
  }

  render() {
    return `
    <main>
      <h2>Регистрация</h2>

      <form action="#" id="registration-form">
        <div class="block">
          {{{LoginInput}}}
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
