import { Button, Input } from "../../components";
import Block, { TBlockProps } from "../../framework/Block";
import { validateForm } from "../../utils/validation";

type TLoginProps = {
  events: TBlockProps;
};

export class LoginPage extends Block {
  constructor(props: TLoginProps) {
    const loginInput = new Input({ name: "login", placeholder: "Логин", validateType: "login" });
    const passwordInput = new Input({ name: "password", placeholder: "Пароль", validateType: "password" });
    const loginButton = new Button({ text: "Войти", events: { click: (e: Event) => this.validate(e) } });
    const createButton = new Button({ text: "Создать аккаунт" });

    super({
      ...props,
      LoginInput: loginInput,
      PasswordInput: passwordInput,
      LoginButton: loginButton,
      CreateButton: createButton,
      events: {
        ...props.events,
        login: () => {
          console.log("login");
        }
      }
    });
  }

  private validate = (e: Event) => {
    e.preventDefault();
    validateForm({ formId: "login-form" });
  };

  render() {
    return `
    <main>
      <h2>Вход</h2>

      <form action="#" id="login-form">
        <div class="block">
          {{{LoginInput}}}
        </div>

        <div class="block">
          {{{PasswordInput}}}
        </div>

        <div class="block">
          {{{LoginButton}}}
        </div>

        <div class="block">
          {{{CreateButton}}}
        </div>
      </form>

      <a data-nav="home">Вернуться на гавную</a>
    </main>`;
  }
}
