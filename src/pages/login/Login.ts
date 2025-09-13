import { authApi } from "../../api";
import { Button, Input } from "../../components";
import Form from "../../components/Form/Form";
import { ROUTES } from "../../constants";
import { Store } from "../../framework";
import Block from "../../framework/Block";
import { Router } from "../../framework/Router";
import { validateForm } from "../../utils/validation";

const LOGIN_FORM_ID = "login-form";

export class LoginPage extends Block {
  constructor() {
    const loginInput = new Input({ name: "login", placeholder: "Логин", validateType: "login" });
    const passwordInput = new Input({ name: "password", placeholder: "Пароль", type: "password", validateType: "password" });
    const loginButton = new Button({ text: "Войти", type: "submit" });
    const logoutButton = new Button({
      text: "Выйти", type: "button", events: {
        click: async () => {
          await authApi.logout()
            .then(() => {
              Store.clear();
              Router.getInstance().go(ROUTES.home);
            })
            .catch((error) => {
              console.error(error);
            });
        } } });
    const createButton = new Button({ text: "Создать аккаунт" });

    const appState = Store.getState();

    const logoutButtonTemplate =
      `<div class="block">
        {{{LogoutButton}}}
      </div>`;

    const template =
      `<div class="block">
        {{{LoginInput}}}
      </div>

      <div class="block">
        {{{PasswordInput}}}
      </div>

      <div class="block">
        {{{LoginButton}}}
      </div>

      ${appState?.user ? logoutButtonTemplate : ""}`;

    const loginForm = new Form({
      formId: LOGIN_FORM_ID,
      template,
      contentBlocks: {
        LoginInput: loginInput,
        PasswordInput: passwordInput,
        LoginButton: loginButton,
        CreateButton: createButton,
        LogoutButton: logoutButton,
      },
      events: {
        submit: async (e: Event) => {
          e.preventDefault();
          const isValid = validateForm({ formId: LOGIN_FORM_ID });

          if (!isValid) {
            return;
          }

          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);

          const data = {
            login: formData.get("login") as string,
            password: formData.get("password") as string
          };

          try {
            await authApi.signin(data);
            const user = await authApi.getUser();

            Store.set("user", user);
            Router.getInstance().go(ROUTES.chat);
          } catch (error) {
            console.error("Login failed:", error);
          }
        }
      }
    });

    super({
      LoginForm: loginForm
    });
  }

  render() {
    return `
    <main>
      <h2>Вход</h2>

      {{{LoginForm}}}

      <p>Нет аккаунта?</p>
      <a href="${ROUTES.registration}">Зарегистрироваться</a>
    </main>`;
  }
}
