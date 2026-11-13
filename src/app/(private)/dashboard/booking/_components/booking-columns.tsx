import type { DataTableColumn } from "@/shared/components/data-table";
import type { Booking } from "@/shared/lib/types/api";

import { BOOKING_STATUS } from "../../_lib/constants/booking-status.constant";

/** Shown when a booking has no phone (older bookings) or no note. */
export const EMPTY_CELL = "-";

export function BookingStatusBadge({ status }: { status: Booking["status"] }) {
  const { label, className } = BOOKING_STATUS[status];
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}>{label}</span>;
}

export const BOOKING_COLUMNS: ReadonlyArray<DataTableColumn<Booking>> = [
  { key: "email", header: "البريد الإلكتروني", cell: (row) => row.email, strong: true, className: "ltr text-start" },
  { key: "phone", header: "الجوال", cell: (row) => row.phone?.trim() || EMPTY_CELL, className: "ltr text-start" },
  { key: "date", header: "اليوم", cell: (row) => row.date.slice(0, 10), className: "ltr text-start" },
  { key: "status", header: "الحالة", cell: (row) => <BookingStatusBadge status={row.status} /> },
  { key: "note", header: "ملاحظة", cell: (row) => row.note?.trim() || EMPTY_CELL, className: "md:max-w-[28ch] md:truncate" },
];
