import { z } from "zod";

export const projectScheme = z.object({
  title: z.string().trim().min(1, "اسم المشروع مطلوب"),
  description: z.string().trim(),
  bio_image: z.string().trim(),
  live: z.string().trim(),
  status: z.enum(["active", "review", "done"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "التاريخ غير صالح"),
  featured: z.boolean(),
  user: z.string().trim(),
  plan: z.string().trim(),
});

export type ProjectInput = z.infer<typeof projectScheme>;
