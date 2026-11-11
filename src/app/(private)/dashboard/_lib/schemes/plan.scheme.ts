import { z } from "zod";

export const planScheme = z.object({
  title: z.string().trim().min(1, "اسم الخطة مطلوب"),
  price: z.number({ error: "السعر غير صالح" }).min(0, "السعر غير صالح"),
  benefits: z.array(z.string().trim().min(1)),
});

export type PlanInput = z.infer<typeof planScheme>;
