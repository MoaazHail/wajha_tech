"use server";

import { createAdminBooking, deleteAdminBooking, updateAdminBooking } from "../apis/dashboard.api";
import { bookingEntryScheme, type BookingEntryInput } from "../schemes/booking.scheme";
import { runMutation } from "../services/mutation.service";
import type { ActionResult } from "../types/action";

export async function createBookingEntryAction(input: BookingEntryInput): Promise<ActionResult> {
  const parsed = bookingEntryScheme.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };

  return runMutation(() => createAdminBooking(parsed.data));
}

export async function updateBookingEntryAction(id: string, input: BookingEntryInput): Promise<ActionResult> {
  const parsed = bookingEntryScheme.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };

  return runMutation(() => updateAdminBooking(id, parsed.data));
}

export async function deleteBookingEntryAction(id: string): Promise<ActionResult> {
  return runMutation(() => deleteAdminBooking(id));
}
