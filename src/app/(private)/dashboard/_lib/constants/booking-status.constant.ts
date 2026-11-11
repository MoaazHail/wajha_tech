import type { BookingStatus } from "@/shared/lib/types/api";

/** Label and badge colours per booking status, for the dark dashboard tables. */
export const BOOKING_STATUS: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "قيد الانتظار", className: "bg-accent/20 text-orange-300" },
  confirmed: { label: "مؤكد", className: "bg-emerald-400/15 text-emerald-300" },
  cancelled: { label: "ملغي", className: "bg-white/10 text-white/60" },
};

export const BOOKING_STATUSES = Object.keys(BOOKING_STATUS) as BookingStatus[];
