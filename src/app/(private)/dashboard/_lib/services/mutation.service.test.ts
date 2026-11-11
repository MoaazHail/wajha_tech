import { beforeEach, describe, expect, it, vi } from "vitest";

const { revalidatePath, revalidateTag, requireToken } = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  requireToken: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath, revalidateTag }));
vi.mock("@/shared/lib/services/session.service", () => ({ requireToken }));

import { ApiError } from "@/shared/lib/apis/client.api";

import { runMutation } from "./mutation.service";

describe("runMutation", () => {
  beforeEach(() => {
    requireToken.mockResolvedValue("tok");
  });

  it("runs the write, then refreshes the dashboard and the landing cache", async () => {
    const write = vi.fn().mockResolvedValue({});

    await expect(runMutation(write)).resolves.toEqual({ ok: true });
    expect(write).toHaveBeenCalledOnce();
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard", "layout");
    expect(revalidateTag).toHaveBeenCalledWith("landing");
  });

  it("requires a session before writing", async () => {
    requireToken.mockRejectedValue(new Error("redirect"));
    const write = vi.fn();

    await expect(runMutation(write)).rejects.toThrow("redirect");
    expect(write).not.toHaveBeenCalled();
  });

  it("turns API errors into a form-friendly result and does not revalidate", async () => {
    const result = await runMutation(() => Promise.reject(new ApiError("Phone already exists", 409)));

    expect(result).toEqual({ ok: false, error: "Phone already exists" });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("reports an unreachable API (fetch failed) instead of throwing", async () => {
    const result = await runMutation(() => Promise.reject(new TypeError("fetch failed")));

    expect(result).toEqual({ ok: false, error: "تعذّر الاتصال بالخادم، حاول مرة أخرى" });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rethrows unexpected errors", async () => {
    await expect(runMutation(() => Promise.reject(new Error("boom")))).rejects.toThrow("boom");
  });
});
