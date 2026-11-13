import { z } from "zod";

import { emailField } from "@/shared/lib/schemes/auth.scheme";
import { phoneField } from "@/shared/lib/schemes/contact.scheme";
import { parseDay } from "@/shared/lib/utils/date.util";

/** A booking edited from the dashboard. Unlike the public form, any real day is allowed, past ones too. */
export const bookingEntryScheme = z.object({
  email: emailField,
  /** Optional here: bookings made before the phone field existed have none. */
  phone: z.union([z.literal(""), phoneField]),
  date: z.string().refine((day) => parseDay(day) !== null, "اختر يوماً صالحاً"),
  status: z.enum(["pending", "confirmed", "cancelled"]),
  note: z.string().trim().max(500, "الملاحظة طويلة جداً (الحد 500 حرف)"),
});

export type BookingEntryInput = z.infer<typeof bookingEntryScheme>;
