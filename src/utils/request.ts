enum METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

type RequestOptions = {
  method: METHOD;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  responseType?: XMLHttpRequestResponseType;
};

export class HTTPTransport {
  // Формирует строку запроса из объекта параметров
  private queryStringify(params: Record<string, unknown>): string {
    const keys = Object.keys(params);

    return keys.reduce((result, key, index) => {
      return `${result}${key}=${params[key]}${index < keys.length - 1 ? "&" : ""}`;
    }, "?");
  }

  // Метод для общих HTTP-запросов
  private request(url: string, options: RequestOptions): Promise<XMLHttpRequest> {
    const { method, data, headers, timeout, responseType } = options;

    let finalUrl = url;

    if (method === METHOD.GET && data) {
      const queryString = this.queryStringify(data as Record<string, unknown>);

      finalUrl += (finalUrl.includes("?") ? "&" : "?") + queryString;
    } else {
      finalUrl += (finalUrl.includes("?") ? "&" : "?") + data;
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Настройка запроса
      xhr.open(method, finalUrl);

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
        xhr.send(JSON.stringify(data));
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
