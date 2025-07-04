import Block, { TBlockProps } from "../../framework/Block";

type TProps = {
  events: TBlockProps;
};

export class HomePage extends Block {
  constructor(props: TProps) {
    super(props);
  }

  render() {
    return `
    <main>
      <h1>Главная страница</h1>

      <nav>
        <div>
          <a href="/login.html" data-nav="login">login page</a>
        </div>

        <div>
          <a href="/settings.html" data-nav="settings">settings page</a>
        </div>

        <div>
          <a href="/registration.html" data-nav="registration">registration page</a>
        </div>

        <div>
          <a href="/chat.html" data-nav="chat">chat page</a>
        </div>

        <div>
          <a href="/p404.html" data-nav="p404">404 page</a>
        </div>

        <div>
          <a href="/p500.html" data-nav="p500">500 page</a>
        </div>
      </nav>
    </main>`;
  }
}
