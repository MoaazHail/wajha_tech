import { describe, expect, it } from "vitest";

import { findSection, safeHref } from "@/app/_lib/utils/landing.util";
import type { LandingSection } from "@/shared/lib/types/api";

import { cn } from "./cn.util";
import { emailHref, formatNumber, phoneHref } from "./format.util";

describe("cn", () => {
  it("joins classes and drops falsy values", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });

  it("lets the later Tailwind class win", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("format utils", () => {
  it("formats numbers with western digits and separators", () => {
    expect(formatNumber(1200)).toBe("1,200");
    expect(formatNumber(0)).toBe("0");
  });

  it("keeps only digits and + in tel links", () => {
    expect(phoneHref("+966 50 123 4567")).toBe("tel:+966501234567");
    expect(phoneHref("(050) 123-4567")).toBe("tel:0501234567");
  });

  it("builds mailto links", () => {
    expect(emailHref("hello@wajha.sa")).toBe("mailto:hello@wajha.sa");
  });
});

describe("safeHref", () => {
  it.each(["https://wa.me/966500000000", "http://example.com", "#work", "/dashboard", "mailto:a@b.co", "tel:+966500"])(
    "allows %s",
    (href) => expect(safeHref(href)).toBe(href),
  );

  it.each(["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,<script>alert(1)</script>", "vbscript:x", "//evil.com"])(
    "drops %s",
    (href) => expect(safeHref(href)).toBeUndefined(),
  );

  it("returns undefined for empty input", () => {
    expect(safeHref(undefined)).toBeUndefined();
    expect(safeHref("")).toBeUndefined();
  });
});

describe("findSection", () => {
  const sections = [{ type: "hero" }, { type: "cta" }] as unknown as LandingSection[];

  it("finds a section by type", () => {
    expect(findSection(sections, "cta")).toBe(sections[1]);
  });

  it("returns undefined when it is missing", () => {
    expect(findSection(sections, "process")).toBeUndefined();
  });
});
