import { beforeEach, describe, expect, it, vi } from "vitest";

const { loginRequest, setSession, clearSession, redirect } = vi.hoisted(() => ({
  loginRequest: vi.fn(),
  setSession: vi.fn(),
  clearSession: vi.fn(),
  // Like Next's, redirect() throws to stop the action.
  redirect: vi.fn((to: string) => {
    throw new Error(`NEXT_REDIRECT:${to}`);
  }),
}));

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("../apis/auth.api", () => ({ loginRequest }));
vi.mock("../services/session.service", () => ({ setSession, clearSession }));

import { ApiError } from "../apis/client.api";
import { loginAction, logoutAction } from "./auth.action";

const form = (email: string, password: string) => {
  const data = new FormData();
  data.set("email", email);
  data.set("password", password);
  return data;
};

describe("loginAction", () => {
  beforeEach(() => {
    loginRequest.mockResolvedValue({ token: "jwt" });
  });

  it("rejects XSS payloads server-side without calling the API", async () => {
    const state = await loginAction({}, form('"><script>alert(1)</script>@x.co', "pw"));

    expect(state.error).toBeTruthy();
    expect(loginRequest).not.toHaveBeenCalled();
  });

  it("rejects missing fields", async () => {
    await expect(loginAction({}, new FormData())).resolves.toHaveProperty("error");
    expect(loginRequest).not.toHaveBeenCalled();
  });

  it("stores the session and redirects to the dashboard on success", async () => {
    await expect(loginAction({}, form("admin@wajha.sa", "pw"))).rejects.toThrow("NEXT_REDIRECT:/dashboard");
    expect(loginRequest).toHaveBeenCalledWith("admin@wajha.sa", "pw");
    expect(setSession).toHaveBeenCalledWith("jwt");
  });

  it("maps a 401 to a wrong-credentials message", async () => {
    loginRequest.mockRejectedValue(new ApiError("Invalid credentials", 401));
    await expect(loginAction({}, form("a@b.co", "pw"))).resolves.toEqual({
      error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    });
    expect(setSession).not.toHaveBeenCalled();
  });

  it("maps a 429 to a rate-limit message", async () => {
    loginRequest.mockRejectedValue(new ApiError("Too many", 429));
    await expect(loginAction({}, form("a@b.co", "pw"))).resolves.toEqual({ error: "محاولات كثيرة، حاول لاحقاً" });
  });

  it("reports an unreachable server for any other failure", async () => {
    loginRequest.mockRejectedValue(new TypeError("fetch failed"));
    await expect(loginAction({}, form("a@b.co", "pw"))).resolves.toEqual({
      error: "تعذّر الاتصال بالخادم، حاول مرة أخرى",
    });
  });
});

describe("logoutAction", () => {
  it("clears the session and goes to /login", async () => {
    await expect(logoutAction()).rejects.toThrow("NEXT_REDIRECT:/login");
    expect(clearSession).toHaveBeenCalledOnce();
  });
});
