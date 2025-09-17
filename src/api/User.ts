import { TUser } from "../types";
import { HTTPTransport } from "../utils/request";

class UserApi {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport("/user");
  }

  updateProfile(data: Pick<TUser, "first_name" | "second_name" | "display_name" | "login" | "email" | "phone">) {
    return this.http.put("/profile", { data, headers: { "Content-Type": "application/json" } });
  }

  updateAvatar(data: FormData) {
    return this.http.put("/profile/avatar", { data });
  }

  updatePassword(data: { oldPassword: string; newPassword: string }) {
    return this.http.put("/password", { data, headers: { "Content-Type": "application/json" } });
  }
}

export default new UserApi();
