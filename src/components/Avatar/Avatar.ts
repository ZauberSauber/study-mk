import { MAIN_URL } from "../../constants";
import Block from "../../framework/Block";
import Input from "../Input/Input";

type TProps = {
  src?: string;
  atlText?: string;
};

export default class Avatar extends Block {
  constructor({ src, atlText }: TProps) {
    const avatarButton = new Input({
      name: "avatar",
      type: "file",
      accept: ".jpeg, .jpg, .png, .gif, .webp",
      label: "Выбрать новый аватар",
      events: {
        change: (e) => {
          const inputEl = e.target as HTMLInputElement;

          if (!inputEl.files) {
            return;
          }

          const fileUrl = URL.createObjectURL(inputEl?.files[0]);

          document.querySelector(".avatar-img")?.setAttribute("src", fileUrl);
        },
      }
    });

    const avatarSrc = src ? `${MAIN_URL}/resources${src}` : "/assets/avatar.jpg";

    super({
      AvatarButton: avatarButton,
      avatarSrc,
      atlText
    });
  }

  render() {
    return `
      <div class="avatar-container">
        <img class="avatar-img" src="${this.props.avatarSrc}" alt="${this.props.atlText}">
        {{{AvatarButton}}}
      </div>`;
  }
}
