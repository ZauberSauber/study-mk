import Block from "../../framework/Block";
import { Avatar, Input, Button } from "../../components";
import { validateForm } from "../../utils/validation";
import Form from "../../components/Form/Form";
import { Store } from "../../framework";
import { Router } from "../../framework/Router";
import { userApi } from "../../api";

type TProfileForm = {
  avatar?: File,
  first_name?: string,
  second_name?: string,
  display_name?: string,
  login?: string,
  email?: string,
  phone?: string,
};

export class SettingsPage extends Block {
  constructor() {
    const { user } = Store.getState();

    const avatar =  new Avatar({ atlText: "Ваш аватар", src: user?.avatar || "" });
    const firstNameInput = new Input({ name: "first_name", label: "Имя", value: user?.first_name || "", validateType: "name" });
    const secondNameInput = new Input({ name: "second_name", label: "Фамилия", value: user?.second_name || "", validateType: "name" });
    const displayNameImput = new Input({ name: "display_name", label: "Отображаемое имя", value: user?.display_name || "" });
    const emailInput = new Input({ name: "email", label: "Электронная почта", value: user?.email || "", validateType: "email" });
    const phoneInput = new Input({ name: "phone", type: "tel", label: "Телефон", value: user?.phone || "", validateType: "phone" });
    const loginInput = new Input({ name: "login", label: "Логин", value: user?.login, validateType: "login" });
    const oldPasswordInput = new Input({ name: "oldPassword", label: "Действующий пароль", type: "password", validateType: "password" });
    const newPasswordInput = new Input({ name: "newPassword", label: "Новый пароль", type: "password", validateType: "password" });
    const saveButton = new Button({ text: "Сохранить", type: "submit" });
    const savePasswordButton = new Button({ text: "Сменить пароль", type: "submit" });
    const backButton = new Button({
      text: "Вернуться", type: "button", events: {
        click: () => {
          Router.getInstance().back();
        }
      } });

    const settingsForm = new Form({
      formId: "profile-form",
      contentBlocks: {
        Avatar: avatar,
        FirstNameInput: firstNameInput,
        SecondNameInput: secondNameInput,
        DisplayNameInput: displayNameImput,
        EmailInput: emailInput,
        PhoneInput: phoneInput,
        LoginInput: loginInput,
        SaveButton: saveButton,
      },
      template: `
        <div class="block">
          {{{Avatar}}}
        </div>

        <div class="block">
          {{{FirstNameInput}}}
        </div>

        <div class="block">
          {{{SecondNameInput}}}
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
          {{{SaveButton}}}
        </div>`,
      events: {
        submit: async (e) => {
          e.preventDefault();

          const isValid = validateForm({ formId: "profile-form" });

          if (!isValid) {
            return;
          }

          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);

          const dataObject: TProfileForm = Object.fromEntries(formData.entries());
          const hasAvatar = dataObject.avatar?.name && dataObject.avatar?.size > 0;

          if (hasAvatar && dataObject.avatar) {
            userApi.updateAvatar(formData).catch((error) => console.error(error));
          }

          userApi.updateProfile({
            first_name: dataObject.first_name || "",
            second_name: dataObject.second_name || "",
            display_name: dataObject.display_name || "",
            email: dataObject.email || "",
            phone: dataObject.phone || "",
            login: dataObject.login || "",
          }).catch((error) => console.error(error));
        }
      }
    });

    const passwordForm = new Form({
      formId: "password-change-form",
      template: `
        <h3>Смена пароля</h3>

        <div class="block">
          {{{OldPasswordInput}}}
        </div>

        <div class="block">
          {{{NewPasswordInput}}}
        </div>
        
        <div class="block">
          {{{SaveButton}}}
        </div>`,
      contentBlocks: {
        OldPasswordInput: oldPasswordInput,
        NewPasswordInput: newPasswordInput,
        SaveButton: savePasswordButton,
      },
      events: {
        submit: async (e) => {
          e.preventDefault();

          const isValid = validateForm({ formId: "password-change-form" });

          if (!isValid) {
            return;
          }

          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const oldPassword = formData.get("oldPassword") as string;
          const newPassword = formData.get("newPassword") as string;

          await userApi.updatePassword({ oldPassword, newPassword })
            .then(() => {
              form.reset();
              console.info("Пароль изменён");
            })
            .catch((error) => {
              console.error(error);
            });
        },
      },
    });

    super({
      SettingsForm: settingsForm,
      BackButton: backButton,
      PasswordForm: passwordForm,
    });
  }

  render() {
    return `
      <main>
        <h2>Настройки профиля</h2>

        {{{SettingsForm}}}

        {{{PasswordForm}}}

        {{{BackButton}}}
      </main>`;
  }
}
