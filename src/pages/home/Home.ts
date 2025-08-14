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
          <a data-nav="login">login page</a>
        </div>

        <div>
          <a data-nav="settings">settings page</a>
        </div>

        <div>
          <a data-nav="registration">registration page</a>
        </div>

        <div>
          <a data-nav="chat">chat page</a>
        </div>

        <div>
          <a data-nav="p404">404 page</a>
        </div>
      </nav>
    </main>`;
  }
}
