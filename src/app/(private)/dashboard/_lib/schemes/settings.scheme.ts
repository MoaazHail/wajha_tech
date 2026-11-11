import { z } from "zod";

const INVALID_YEAR = "سنة التأسيس غير صالحة";

export const settingsScheme = z.object({
  name: z.string().trim().min(1, "اسم الموقع مطلوب"),
  wordmark: z.string().trim(),
  tagline: z.string().trim(),
  description: z.string().trim(),
  phone: z.string().trim(),
  email: z.union([z.literal(""), z.string().trim().email("البريد الإلكتروني غير صالح")]),
  whatsapp: z.string().trim(),
  address: z.string().trim(),
  foundedYear: z
    .number({ error: INVALID_YEAR })
    .int(INVALID_YEAR)
    .min(1900, INVALID_YEAR)
    .max(2100, INVALID_YEAR)
    .nullable(),
});

export type SettingsInput = z.infer<typeof settingsScheme>;
