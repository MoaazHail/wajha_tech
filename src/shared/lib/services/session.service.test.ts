import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const jar = { set: vi.fn(), delete: vi.fn(), get: vi.fn() };
  return {
    jar,
    cookies: vi.fn(async () => jar),
    redirect: vi.fn((to: string) => {
      throw new Error(`NEXT_REDIRECT:${to}`);
    }),
    meRequest: vi.fn(),
  };
});

vi.mock("next/headers", () => ({ cookies: mocks.cookies }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("../apis/auth.api", () => ({ meRequest: mocks.meRequest }));

import { ApiError } from "../apis/client.api";
import { clearSession, getAdmin, getToken, requireToken, setSession } from "./session.service";

const admin = { id: "1", name: "Ali", email: "a@b.co", role: "admin" };

beforeEach(() => {
  mocks.jar.get.mockReturnValue(undefined);
});

describe("session cookie", () => {
  it("stores the token in an httpOnly, lax, day-long cookie", async () => {
    await setSession("jwt");

    expect(mocks.jar.set).toHaveBeenCalledWith(
      "wajha_token",
      "jwt",
      expect.objectContaining({ httpOnly: true, sameSite: "lax", path: "/", maxAge: 86400 }),
    );
  });

  it("clears it on logout", async () => {
    await clearSession();
    expect(mocks.jar.delete).toHaveBeenCalledWith("wajha_token");
  });

  it("reads the token back", async () => {
    mocks.jar.get.mockReturnValue({ value: "jwt" });
    await expect(getToken()).resolves.toBe("jwt");
  });
});

describe("getAdmin", () => {
  it("is null without a cookie and never calls the API", async () => {
    await expect(getAdmin()).resolves.toBeNull();
    expect(mocks.meRequest).not.toHaveBeenCalled();
  });

  it("returns the admin for a valid token", async () => {
    mocks.jar.get.mockReturnValue({ value: "jwt" });
    mocks.meRequest.mockResolvedValue(admin);
    await expect(getAdmin()).resolves.toEqual(admin);
    expect(mocks.meRequest).toHaveBeenCalledWith("jwt");
  });

  it("is null when the API rejects the token", async () => {
    mocks.jar.get.mockReturnValue({ value: "expired" });
    mocks.meRequest.mockRejectedValue(new ApiError("Unauthorized", 401));
    await expect(getAdmin()).resolves.toBeNull();
  });

  it("rethrows other failures (API down)", async () => {
    mocks.jar.get.mockReturnValue({ value: "jwt" });
    mocks.meRequest.mockRejectedValue(new ApiError("Bad gateway", 502));
    await expect(getAdmin()).rejects.toMatchObject({ status: 502 });
  });
});

describe("requireToken", () => {
  it("returns the token when signed in", async () => {
    mocks.jar.get.mockReturnValue({ value: "jwt" });
    await expect(requireToken()).resolves.toBe("jwt");
  });

  it("redirects to /login when signed out", async () => {
    await expect(requireToken()).rejects.toThrow("NEXT_REDIRECT:/login");
  });
});
