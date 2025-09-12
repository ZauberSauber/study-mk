import { authApi } from "../../api";
import { Button, Input } from "../../components";
import Form from "../../components/Form/Form";
import { ROUTES } from "../../constants";
import Block from "../../framework/Block";
import { Router } from "../../framework/Router";
import store from "../../framework/Store";
import { validateForm } from "../../utils/validation";

export class RegistrationPage extends Block {
  constructor() {
    const loginInput = new Input({ name: "login", placeholder: "Логин", validateType: "login" });
    const passwordInput = new Input({ name: "password", type: "password", placeholder: "Пароль", validateType: "password" });
    const firstNameInput = new Input({ name: "first-name", placeholder: "Имя", validateType: "name" });
    const secondNameInput = new Input({ name: "second-name", placeholder: "Фамилия", validateType: "name" });
    const emailInput = new Input({ name: "email", placeholder: "Email", validateType: "email" });
    const phoneInput = new Input({ name: "phone", type: "tel", placeholder: "Телефон", validateType: "phone" });
    const createButton = new Button({ text: "Создать аккаунт", type: "submit" });

    const template = `
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
        {{{CreateButton}}}
      </div>`;

    const registrationForm = new Form({
      formId: "registration-form",
      contentBlocks: {
        LoginInput: loginInput,
        PasswordInput: passwordInput,
        CreateButton: createButton,
        FirstNameInput: firstNameInput,
        SecondNameInput: secondNameInput,
        EmailInput: emailInput,
        PhoneInput: phoneInput,
      },
      template,
      events: {
        submit: async (e: Event) => {
          e.preventDefault();
          const isValid = validateForm({ formId: "registration-form" });

          if (!isValid) {
            return;
          }

          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const data = {
            login: formData.get("login") as string,
            password: formData.get("password") as string,
            first_name: formData.get("first-name") as string,
            second_name: formData.get("second-name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
          };

          try {
            const result = await authApi.signup(data);
            const userId = result.id;

            store.set("user", { ...data, id: userId });
            Router.getInstance().go(ROUTES.chat);

          } catch (error) {
            console.error(error);
          }
        }
      }
    });

    super({
      RegistrationForm: registrationForm,
    });
  }

  render() {
    return `
    <main>
      <h2>Регистрация</h2>

      {{{RegistrationForm}}}

      <a href="${ROUTES.home}">Вернуться на гавную</a>
    </main>`;
  }
}
