import { HTTPTransport } from "../utils/request";

class AuthApi {
  private http = new HTTPTransport("/auth");

  signin(data: { login: string; password: string }) {
    return this.http.post("/signin", { data, headers: { "Content-Type": "application/json" } });
  }

  signup(data: {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
  }): Promise<{ id: number }> {
    return this.http.post("/signup", { data, headers: { "Content-Type": "application/json" } });
  }

  logout() {
    return this.http.post("/logout");
  }

  getUser() {
    return this.http.get("/user");
  }
}

export default new AuthApi();
