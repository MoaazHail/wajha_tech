import { z } from "zod";

/** Digits with an optional leading +, spaces, dashes and brackets. Letters and markup never match. */
const PHONE_CHARS = /^\+?[\d\s().-]+$/;
const digitCount = (value: string) => value.replace(/\D/g, "").length;

/** 7 to 15 digits once the punctuation is dropped (the E.164 range). The API enforces the same rule. */
export const phoneField = z
  .string()
  .trim()
  .min(1, "رقم الجوال مطلوب")
  .max(30, "رقم الجوال طويل جداً")
  .refine(
    (value) => PHONE_CHARS.test(value) && digitCount(value) >= 7 && digitCount(value) <= 15,
    "رقم الجوال غير صالح",
  );
