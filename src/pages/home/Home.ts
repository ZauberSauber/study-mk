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
        <ul>
          <li><a data-nav="login">login page</a></li>
          <li><a data-nav="settings">settings page</a></li>
          <li><a data-nav="registration">registration page</a></li>
          <li><a data-nav="chat">chat page</a></li>
          <li><a data-nav="p404">404 page</a></li>
        </ul>
      </nav>
    </main>`;
  }
}
