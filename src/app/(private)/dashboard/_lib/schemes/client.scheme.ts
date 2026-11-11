import { z } from "zod";

export const clientScheme = z.object({
  name: z.string().trim().min(1, "اسم العميل مطلوب"),
  phone: z.string().trim().min(5, "رقم الجوال غير صالح"),
  email: z.union([z.literal(""), z.string().trim().email("البريد الإلكتروني غير صالح")]),
  plan: z.string().trim(),
});

export type ClientInput = z.infer<typeof clientScheme>;
