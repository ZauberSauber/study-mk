import { TUser } from "../types";
import { HTTPTransport } from "../utils/request";

class ChatApi {
  private http = new HTTPTransport("/chats");

  getToken(chatId: number) {
    return this.http.post<{ token: string }>(`/token/${chatId}`);
  }

  getChats() {
    return this.http.get("");
  }

  createChat(title: string) {
    return this.http.post("", { data: { title }, headers: { "Content-Type": "application/json" } });
  }

  deleteChat(chatId: number) {
    return this.http.delete("", { chatId });
  }

  getUsers(chatId: number): Promise<TUser[]> {
    return this.http.get(`/${chatId}/users`, { chatId });
  }

  addUsers(userIds: number[], chatId: number): Promise<void> {
    return this.http.put("/users", {
      data: { users: userIds, chatId },
      headers: { "Content-Type": "application/json" },
    });
  }

  deleteUsers(userIds: number[], chatId: number): Promise<void> {
    return this.http.delete("/users", {
      data: { users: userIds, chatId },
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default new ChatApi();
