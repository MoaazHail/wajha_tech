import { describe, expect, it } from "vitest";

import { clientScheme } from "./client.scheme";
import { planScheme } from "./plan.scheme";
import { projectScheme } from "./project.scheme";
import { settingsScheme } from "./settings.scheme";

describe("clientScheme", () => {
  const valid = { name: " عيادة الأمل ", phone: "+966500000001", email: "", plan: "" };

  it("accepts a client with no email or plan and trims the name", () => {
    const result = clientScheme.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("عيادة الأمل");
  });

  it("requires a name and a plausible phone", () => {
    expect(clientScheme.safeParse({ ...valid, name: "  " }).error?.issues[0]?.message).toBe("اسم العميل مطلوب");
    expect(clientScheme.safeParse({ ...valid, phone: "123" }).error?.issues[0]?.message).toBe("رقم الجوال غير صالح");
  });

  it("validates a non-empty email", () => {
    expect(clientScheme.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(clientScheme.safeParse({ ...valid, email: "a@b.co" }).success).toBe(true);
  });
});

describe("planScheme", () => {
  it("accepts a plan", () => {
    expect(planScheme.safeParse({ title: "باقة", price: 1200, benefits: ["a"] }).success).toBe(true);
  });

  it("rejects a blank title, a negative or NaN price and blank benefits", () => {
    expect(planScheme.safeParse({ title: " ", price: 1, benefits: [] }).success).toBe(false);
    expect(planScheme.safeParse({ title: "x", price: -1, benefits: [] }).success).toBe(false);
    expect(planScheme.safeParse({ title: "x", price: Number.NaN, benefits: [] }).success).toBe(false);
    expect(planScheme.safeParse({ title: "x", price: 1, benefits: [" "] }).success).toBe(false);
  });
});

describe("projectScheme", () => {
  const valid = {
    title: "موقع",
    description: "",
    bio_image: "",
    live: "",
    status: "active",
    date: "2026-10-18",
    featured: false,
    user: "",
    plan: "",
  };

  it("accepts a project", () => {
    expect(projectScheme.safeParse(valid).success).toBe(true);
  });

  it("rejects an unknown status and a malformed date", () => {
    expect(projectScheme.safeParse({ ...valid, status: "archived" }).success).toBe(false);
    expect(projectScheme.safeParse({ ...valid, date: "18/10/2026" }).error?.issues[0]?.message).toBe("التاريخ غير صالح");
  });

  it("requires a title", () => {
    expect(projectScheme.safeParse({ ...valid, title: "" }).error?.issues[0]?.message).toBe("اسم المشروع مطلوب");
  });
});

describe("settingsScheme", () => {
  const valid = {
    name: "واجهة",
    wordmark: "WAJHA",
    tagline: "",
    description: "",
    phone: "",
    email: "",
    whatsapp: "",
    address: "",
    foundedYear: 2025,
  };

  it("accepts valid settings, an empty email and no founding year", () => {
    expect(settingsScheme.safeParse(valid).success).toBe(true);
    expect(settingsScheme.safeParse({ ...valid, foundedYear: null }).success).toBe(true);
  });

  it("rejects a bad email, a blank name and an out-of-range year", () => {
    expect(settingsScheme.safeParse({ ...valid, email: "x" }).success).toBe(false);
    expect(settingsScheme.safeParse({ ...valid, name: "" }).success).toBe(false);
    expect(settingsScheme.safeParse({ ...valid, foundedYear: 1800 }).success).toBe(false);
    expect(settingsScheme.safeParse({ ...valid, foundedYear: 2025.5 }).success).toBe(false);
  });
});
