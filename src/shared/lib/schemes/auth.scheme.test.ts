import { describe, expect, it } from "vitest";

import { loginScheme } from "./auth.scheme";

const parse = (email: string, password: string) => loginScheme.safeParse({ email, password });

describe("loginScheme", () => {
  it("accepts a normal login and trims the email", () => {
    const result = parse("  admin@wajha.sa  ", "S3cret!pass");
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe("admin@wajha.sa");
  });

  it("requires both fields", () => {
    expect(parse("", "x").error?.issues[0]?.message).toBe("البريد الإلكتروني مطلوب");
    expect(parse("a@b.co", "").error?.issues[0]?.message).toBe("كلمة المرور مطلوبة");
  });

  it("rejects malformed emails", () => {
    expect(parse("not-an-email", "x").success).toBe(false);
    expect(parse("a@", "x").success).toBe(false);
  });

  it.each([
    "<script>alert(1)</script>@x.co",
    '"><img src=x onerror=alert(1)>@x.co',
    "a'b@x.co",
    "a`b@x.co",
    "a\\b@x.co",
    "a\u0000b@x.co",
    "a\nb@x.co",
  ])("rejects markup and control characters in the email: %j", (email) => {
    expect(parse(email, "x").success).toBe(false);
  });

  it("rejects control characters and huge passwords", () => {
    expect(parse("a@b.co", "pass\u0000word").success).toBe(false);
    expect(parse("a@b.co", "x".repeat(129)).success).toBe(false);
    expect(parse("a@b.co", "x".repeat(128)).success).toBe(true);
  });

  it("rejects an email over 254 characters", () => {
    expect(parse(`${"a".repeat(250)}@b.co`, "x").success).toBe(false);
  });

  it("does not alter the password", () => {
    expect(parse("a@b.co", "  p<a>ss  ").data?.password).toBe("  p<a>ss  ");
  });
});
