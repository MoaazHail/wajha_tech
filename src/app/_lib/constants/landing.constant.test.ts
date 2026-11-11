import { describe, expect, it } from "vitest";

import { MAIN_NAV } from "@/shared/lib/constants/navigation.constant";
import { DASHBOARD_NAV } from "@/shared/lib/constants/dashboard.constant";

import { findSection, safeHref } from "../utils/landing.util";
import { buildLandingSections } from "./landing.constant";

const WA = "https://wa.me/966500000000";

describe("buildLandingSections", () => {
  const sections = buildLandingSections(WA);

  it("provides every section the home page renders", () => {
    for (const type of ["hero", "proof", "features", "package", "services", "process", "portfolio", "cta"] as const) {
      expect(findSection(sections, type), type).toBeDefined();
    }
  });

  it("is fully static: every section is visible and every item active", () => {
    expect(sections.every((s) => s.isVisible)).toBe(true);
    expect(sections.flatMap((s) => s.contents).every((c) => c.isActive)).toBe(true);
  });

  it("uses the WhatsApp link from settings for every call to action", () => {
    const ctas = sections.flatMap((s) => s.contents).flatMap((c) => (c.cta ? [c.cta] : []));
    expect(ctas.length).toBeGreaterThanOrEqual(5);
    expect(ctas.every((cta) => cta.href === WA && safeHref(cta.href))).toBe(true);
  });

  it("has the expected item counts", () => {
    const count = (type: Parameters<typeof findSection>[1]) => findSection(sections, type)?.contents.length;
    expect(count("features")).toBe(4);
    expect(count("process")).toBe(4);
    expect(count("services")).toBe(2);
    expect(count("package")).toBe(1);
    expect(count("proof")).toBe(4); // copy + three avatars
  });

  it("gives items unique ids", () => {
    const ids = sections.flatMap((s) => s.contents.map((c) => c.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("navigation constants", () => {
  it("points every main nav link at an in-page anchor", () => {
    expect(MAIN_NAV.every((item) => item.href.startsWith("#"))).toBe(true);
  });

  it("lists the dashboard pages, including bookings, contents and settings", () => {
    const hrefs = DASHBOARD_NAV.map((item) => item.href);
    expect(hrefs).toEqual([
      "/dashboard",
      "/dashboard/users",
      "/dashboard/projects",
      "/dashboard/plans",
      "/dashboard/booking",
      "/dashboard/contents",
      "/dashboard/settings",
    ]);
  });
});
