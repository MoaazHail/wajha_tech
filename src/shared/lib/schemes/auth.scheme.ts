import { z } from "zod";

/** Control characters (including NUL and line breaks) never belong in a credential. */
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;
/** Characters that open markup or break out of an attribute. An email has no use for them. */
const MARKUP_CHARS = /[<>"'`\x5c]/;

/** Shared by every form that takes an email: login, booking. */
export const emailField = z
  .string()
  .trim()
  .min(1, "البريد الإلكتروني مطلوب")
  .max(254, "البريد الإلكتروني طويل جداً")
  .refine((value) => !CONTROL_CHARS.test(value) && !MARKUP_CHARS.test(value), "البريد الإلكتروني يحتوي على رموز غير مسموحة")
  .pipe(z.string().email("البريد الإلكتروني غير صالح"));

/**
 * Runs in the browser before the form is sent and again in the Server Action,
 * so a crafted request that skips the form is still rejected before it reaches the API.
 */
export const loginScheme = z.object({
  email: emailField,
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .max(128, "كلمة المرور طويلة جداً")
    .refine((value) => !CONTROL_CHARS.test(value), "كلمة المرور تحتوي على رموز غير مسموحة"),
});

export type LoginInput = z.infer<typeof loginScheme>;
