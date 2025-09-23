import { expect } from "chai";
import sinon from "sinon";
import Block from "./Block";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>');

global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.Event = dom.window.Event;
global.MouseEvent = dom.window.MouseEvent;

class TestBlock extends Block {
  render() {
    return '<div class="test-block">{{text}}</div>';
  }
}

describe("Block", () => {
  it("Должен создавать экземпляр", () => {
    const block = new TestBlock({});

    expect(block).to.be.instanceOf(Block);
  });

  it("Должен рендерить контент", () => {
    const block = new TestBlock({ text: "Hello" });
    const content = block.getContent();

    expect((content as HTMLElement).textContent).to.equal("Hello");
  });

  it("Должен обновлять пропсы через setProps", () => {
    const block = new TestBlock({ text: "Initial" });

    block.setProps({ text: "Updated" });

    expect((block.getContent() as HTMLElement).textContent).to.equal("Updated");
  });

  it("Должен обрабатывать события", () => {
    const clickSpy = sinon.spy();
    const block = new TestBlock({
      events: {
        click: clickSpy
      }
    });

    const element = block.getContent();

    (element as HTMLElement).dispatchEvent(new Event("click"));

    expect(clickSpy.calledOnce).to.equal(true);
  });

  it("Должен выбрасывать ошибку при получении контента без элемента", () => {
    const block = new TestBlock({});

    block._element = null;

    let errorMessage = "";

    try {
      block.getContent();
    } catch (e) {
      errorMessage = (e as Error).message;
    }

    expect(errorMessage).to.equal("Нет элемента");
  });
});
