import "server-only";

import { apiRequest } from "@/shared/lib/apis/client.api";

import type { BookingInput } from "../schemes/booking.scheme";

/** Upcoming days that already have a booking, as `YYYY-MM-DD`. Public, never cached. */
export const listTakenDays = () => apiRequest<string[]>("/public/bookings/taken", { revalidate: 0 });

/** Public endpoint: saves the request and emails the visitor and the agency. Never cached. */
export const createBooking = (body: BookingInput) =>
  apiRequest<{ id: string; date: string; email: string; phone: string }>("/public/bookings", {
    method: "POST",
    body,
    revalidate: 0,
  });
