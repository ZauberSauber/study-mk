enum METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

type RequestOptions = {
  method: METHOD;
  data?: string | FormData | null;
  headers?: Record<string, string>;
  timeout?: number;
  responseType?: XMLHttpRequestResponseType;
};

export class HTTPTransport {
  // Метод для общих HTTP-запросов
  private request(url: string, options: RequestOptions): Promise<XMLHttpRequest> {
    const { method, data, headers, timeout, responseType } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Настройка запроса
      xhr.open(method, url);

      // Установка заголовков, если они указаны
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      // Настройка типа ответа
      if (responseType) {
        xhr.responseType = responseType;
      }

      // Обработчики событий
      xhr.onload = () => resolve(xhr);
      xhr.onabort = () => reject(new Error("Запрос отменен"));
      xhr.onerror = () => reject(new Error(`Ошибка сети: ${xhr.statusText}`));
      xhr.ontimeout = () => reject(new Error(`Время вышло: ${timeout}ms`));

      // Установка таймаута
      if (timeout) {
        xhr.timeout = timeout;
      }

      // Отправка данных (если это не GET и данные есть)
      if (method !== METHOD.GET && data !== undefined) {
        xhr.send(data);
      } else {
        xhr.send();
      }
    });
  }

  // Генератор HTTP-методов
  private createMethodHandler(method: METHOD) {
    return (url: string, options: Omit<RequestOptions, "method"> = {}): Promise<XMLHttpRequest> => {
      return this.request(url, { ...options, method });
    };
  }

  // Экспортируемые методы
  public get = this.createMethodHandler(METHOD.GET);
  public post = this.createMethodHandler(METHOD.POST);
  public put = this.createMethodHandler(METHOD.PUT);
  public patch = this.createMethodHandler(METHOD.PATCH);
  public delete = this.createMethodHandler(METHOD.DELETE);
}
