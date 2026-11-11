import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

async function load(apiUrl: string | undefined) {
  vi.resetModules();
  if (apiUrl === undefined) vi.stubEnv("API_URL", "");
  else vi.stubEnv("API_URL", apiUrl);
  return import("./client.api");
}

describe("apiRequest", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("returns the `data` of the success envelope", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: { id: "1" } }));
    const { apiRequest } = await load("http://api.test/api/v1");

    await expect(apiRequest("/plans")).resolves.toEqual({ id: "1" });
    expect(fetchMock.mock.calls[0]?.[0]).toBe("http://api.test/api/v1/plans");
  });

  it("sends the bearer token and a JSON body", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: {} }));
    const { apiRequest } = await load("http://api.test");

    await apiRequest("/users", { method: "POST", body: { name: "x" }, token: "tok" });

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit & { headers: Record<string, string> };
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ name: "x" }));
    expect(init.headers.Authorization).toBe("Bearer tok");
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  it("sends FormData untouched, without a JSON content type", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: {} }));
    const { apiRequest } = await load("http://api.test");
    const body = new FormData();
    body.append("image", new Blob(["x"]), "a.png");

    await apiRequest("/uploads/image", { method: "POST", body });

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit & { headers: Record<string, string> };
    expect(init.body).toBe(body);
    expect(init.headers["Content-Type"]).toBeUndefined();
  });

  it("opts out of the cache when revalidate is 0", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: {} }));
    const { apiRequest } = await load("http://api.test");

    await apiRequest("/stats", { revalidate: 0 });
    expect((fetchMock.mock.calls[0]?.[1] as RequestInit).cache).toBe("no-store");
  });

  it("throws an ApiError carrying the API message and status", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: false, message: "Invalid credentials" }, 401));
    const { apiRequest, ApiError } = await load("http://api.test");

    const error = await apiRequest("/auth/login").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: "Invalid credentials", status: 401 });
  });

  it("throws a generic ApiError when the body is not JSON", async () => {
    fetchMock.mockResolvedValue(new Response("<html>bad gateway</html>", { status: 502 }));
    const { apiRequest } = await load("http://api.test");

    await expect(apiRequest("/plans")).rejects.toMatchObject({ status: 502, message: "Request to /plans failed" });
  });

  it("fails fast when API_URL is not configured", async () => {
    const { apiRequest } = await load(undefined);
    await expect(apiRequest("/plans")).rejects.toMatchObject({ status: 500 });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
