import { expect } from "chai";
import sinon from "sinon";
import { HTTPTransport, METHOD } from "./request";
import { MAIN_URL } from "../constants";

describe("HTTPTransport", () => {
  let http: HTTPTransport;
  let xhrStub: sinon.SinonStub;
  let openSpy: sinon.SinonSpy;
  let sendSpy: sinon.SinonSpy;
  let setRequestHeaderSpy: sinon.SinonSpy;

  beforeEach(() => {
    http = new HTTPTransport("/test");

    const xhrMock = {
      open: sinon.spy(),
      send: sinon.spy(),
      setRequestHeader: sinon.spy(),
      withCredentials: false,
      readyState: 4,
      status: 200,
      responseText: "{}"
    };

    xhrStub = sinon.stub(global, "XMLHttpRequest").returns(xhrMock);

    openSpy = xhrMock.open;
    sendSpy = xhrMock.send;
    setRequestHeaderSpy = xhrMock.setRequestHeader;
  });

  afterEach(() => {
    xhrStub.restore();
  });

  it("Должен создавать экземпляр", () => {
    expect(http).to.be.instanceOf(HTTPTransport);
  });

  it("GET: должен отправлять корректный запрос", () => {
    http.get("/path");

    expect(openSpy.calledOnce).to.be.true;
    expect(openSpy.firstCall.args).to.deep.equal([
      METHOD.GET, `${MAIN_URL}/test/path`
    ]);
  });

  describe("queryStringify", () => {
    it("Должен корректно преобразовывать параметры", () => {
      const params = { a: 1, b: "test", c: [1, 2] };
      const result = http.queryStringify(params);

      expect(result).to.equal("?a=1&b=test&c=1,2");
    });

    it("должен обрабатывать пустые данные", () => {
      const result = http.queryStringify({});

      expect(result).to.equal("?");
    });
  });

  it("POST: должен отправлять данные в теле запроса", () => {
    const data = { name: "John" };

    http.post("/path", { data, headers: { "Content-Type": "application/json" } });

    expect(setRequestHeaderSpy.calledWith("Content-Type", "application/json")).to.be.true;

    expect(sendSpy.calledOnce).to.be.true;
    expect(sendSpy.firstCall.args[0]).to.equal(JSON.stringify(data));
  });

  it("Должен добавлять query-параметры для GET", () => {
    http.get("/path", { data: { key: "value", num: 123 } });

    expect(openSpy.firstCall.args[1]).to.equal(
      `${MAIN_URL}/test/path?key=value&num=123`
    );
  });

  it("Должен устанавливать withCredentials", () => {
    http.get("/path");

    const xhrInstance = xhrStub.firstCall.returnValue;

    expect(xhrInstance.withCredentials).to.be.true;
  });
});
