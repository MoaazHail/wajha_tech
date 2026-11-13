import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getLanding: vi.fn() }));

vi.mock("@/shared/lib/apis/landing.api", () => ({ getLanding: mocks.getLanding }));
vi.mock("@/shared/lib/services/session.service", () => ({ getAdmin: vi.fn() }));
vi.mock("@/shared/layout/public-chrome", () => ({ PublicChrome: () => null }));
vi.mock("@/shared/lib/constants/fonts.constant", () => ({ fontVariables: "" }));
vi.mock("./globals.css", () => ({}));

import { SITE } from "@/shared/lib/constants/site.constant";

import { generateMetadata } from "./layout";

describe("link preview metadata", () => {
  beforeEach(() => {
    mocks.getLanding.mockReset();
  });

  it("uses the description saved in the dashboard", async () => {
    mocks.getLanding.mockResolvedValue({ settings: { description: "وصف من لوحة التحكم" } });
    const meta = await generateMetadata();

    expect(meta.description).toBe("وصف من لوحة التحكم");
    expect(meta.openGraph?.description).toBe("وصف من لوحة التحكم");
  });

  it("falls back to the built-in description when the API is down, so the preview is never empty", async () => {
    mocks.getLanding.mockRejectedValue(new TypeError("fetch failed"));
    const meta = await generateMetadata();

    expect(meta.description).toBe(SITE.description);
    expect(meta.openGraph?.description).toBe(SITE.description);
    expect(SITE.description.length).toBeGreaterThan(40);
  });

  it("falls back when the saved description is blank", async () => {
    mocks.getLanding.mockResolvedValue({ settings: { description: "" } });
    expect((await generateMetadata()).description).toBe(SITE.description);
  });

  it("sets the Open Graph and Twitter basics", async () => {
    mocks.getLanding.mockResolvedValue({ settings: null });
    const meta = await generateMetadata();

    expect(meta.openGraph).toMatchObject({ type: "website", siteName: SITE.name, url: "/", locale: "ar_SA" });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
    expect(String(meta.metadataBase)).toContain(new URL(SITE.url).host);
    expect(meta.alternates?.canonical).toBe("/");
  });
});
