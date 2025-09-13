import { MAIN_URL } from "../constants";
import CustomError from "../framework/CustomError";
import { EHttpStatus } from "../types/network";

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
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = `${MAIN_URL}${baseUrl}`;
  }
  // Формирует строку запроса из объекта параметров
  private queryStringify(params: Record<string, unknown>): string {
    const keys = Object.keys(params);

    return keys.reduce((result, key, index) => {
      return `${result}${key}=${params[key]}${index < keys.length - 1 ? "&" : ""}`;
    }, "?");
  }

  // Метод для общих HTTP-запросов
  private request<T>(url: string, options: RequestOptions): Promise<T> {
    const { method, data, headers, timeout, responseType } = options;
    let finalUrl = `${this.baseUrl}${url}`;

    if (method === METHOD.GET && data) {
      const queryString = this.queryStringify(data as Record<string, unknown>);

      finalUrl += queryString;
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Настройка запроса
      xhr.open(method, finalUrl);
      xhr.withCredentials = true;

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
      xhr.onload = () => {
        switch (xhr.status) {
          case EHttpStatus.Ok:
          case EHttpStatus.Created:
            if (xhr.responseText === "OK") {
              resolve(null as unknown as T);
            } else {
              try {
                resolve(JSON.parse(xhr.responseText) as T);
              } catch {
                reject(new Error("Ошибка парсинга JSON"));
              }
            }

            break;
          case EHttpStatus.NoContent:
            resolve(null as unknown as T);
            break;

          case EHttpStatus.BadRequest:
            try {
              const response = JSON.parse(xhr.responseText);

              if (response.reason === "User already in system") {
                resolve(response.reason);
              } else {
                reject(new Error(`Bad Request (${xhr.status})`));
              }
            } catch {
              reject(new Error("Ошибка парсинга JSON"));
            }

            break;
          case EHttpStatus.Unauthorized:
            reject(new CustomError(xhr.status, "Unauthorized"));
            break;
          case EHttpStatus.Forbidden:
            reject(new CustomError(xhr.status, "Forbidden"));
            break;
          case EHttpStatus.NotFound:
            reject(new Error(`Not Found (${xhr.status})`));
            break;
          case EHttpStatus.Conflict:
            reject(new Error(`Conflict (${xhr.status})`));
            break;
          case EHttpStatus.InternalServerError:
            reject(new Error(`Internal Server Error (${xhr.status})`));
            break;

          default:
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.responseText as unknown as T);
            } else {
              reject(new Error(`Unhandled status: ${xhr.status}`));
            }
        }
      };

      xhr.onabort = () => reject(new Error("Запрос отменен"));
      xhr.onerror = () => reject(new Error(`Ошибка сети: ${xhr.statusText}`));
      xhr.ontimeout = () => reject(new Error(`Время вышло: ${timeout}ms`));

      // Установка таймаута
      if (timeout) {
        xhr.timeout = timeout;
      }

      // Отправка данных (если это не GET и данные есть)
      if (method !== METHOD.GET && data !== undefined) {
        if (data instanceof FormData) {
          xhr.send(data);

          return;
        }

        xhr.send(JSON.stringify(data));
      } else {
        xhr.send();
      }
    });
  }

  // Генератор HTTP-методов
  private createMethodHandler(method: METHOD) {
    return <T>(url: string, options: Record<string, unknown> | FormData = { } ): Promise<T> => {
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
