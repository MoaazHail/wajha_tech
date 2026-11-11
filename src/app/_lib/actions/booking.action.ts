"use server";

import { ApiError } from "@/shared/lib/apis/client.api";

import { createBooking, listTakenDays } from "../apis/booking.api";
import { bookingScheme, type BookingInput } from "../schemes/booking.scheme";

export type BookingResult = { ok: true } | { ok: false; error: string; conflict?: boolean };

/** Days that are already booked. If the API cannot be reached nothing is greyed out; the server still refuses a taken day. */
export async function getTakenDaysAction(): Promise<string[]> {
  try {
    return await listTakenDays();
  } catch {
    return [];
  }
}

export async function bookMeetingAction(input: BookingInput): Promise<BookingResult> {
  const parsed = bookingScheme.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };

  try {
    await createBooking(parsed.data);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 429) return { ok: false, error: "محاولات كثيرة، حاول لاحقاً" };
      if (error.status === 409) return { ok: false, error: error.message, conflict: true };
      if (error.status === 400) return { ok: false, error: "بيانات غير صالحة، راجع اليوم والبريد" };
      // 502 / 503 come with an Arabic message written for the visitor.
      if (error.status === 502 || error.status === 503) return { ok: false, error: error.message };
    }
    return { ok: false, error: "تعذّر الاتصال بالخادم، حاول مرة أخرى" };
  }
}
