import { z } from "zod";

import { emailField } from "@/shared/lib/schemes/auth.scheme";
import { phoneField } from "@/shared/lib/schemes/contact.scheme";
import { addDays, parseDay, today } from "@/shared/lib/utils/date.util";

/** How far ahead a visitor may book. The API enforces the same limit. */
export const MAX_DAYS_AHEAD = 90;

export const bookingDateScheme = z
  .string()
  .refine((day) => parseDay(day) !== null, "اختر يوماً صالحاً")
  .refine((day) => day >= today(), "لا يمكن حجز يوم مضى")
  .refine((day) => day <= addDays(today(), MAX_DAYS_AHEAD), "اختر يوماً خلال 90 يوماً القادمة");

export const bookingScheme = z.object({
  date: bookingDateScheme,
  email: emailField,
  phone: phoneField,
});

export type BookingInput = z.infer<typeof bookingScheme>;
