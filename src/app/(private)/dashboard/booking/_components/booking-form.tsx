"use client";

import { useState, useTransition } from "react";

import { Calendar } from "@/shared/components/calendar";
import { Dialog } from "@/shared/components/dialog";
import type { Booking, BookingStatus } from "@/shared/lib/types/api";
import { formatDayLong, today } from "@/shared/lib/utils/date.util";

import { BOOKING_STATUS, BOOKING_STATUSES } from "../../_lib/constants/booking-status.constant";
import type { BookingEntryInput } from "../../_lib/schemes/booking.scheme";
import type { ActionResult } from "../../_lib/types/action";

interface BookingFormProps {
  open: boolean;
  /** The booking being edited; leave empty to add a new one. */
  booking?: Booking | null;
  /** Every booking, used to grey out days another active booking already holds. */
  bookings: ReadonlyArray<Booking>;
  onClose: () => void;
  onSubmit: (data: BookingEntryInput) => Promise<ActionResult>;
}

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px] outline-none transition-colors focus:border-brand";

const toInput = (booking?: Booking | null): BookingEntryInput => ({
  email: booking?.email ?? "",
  date: booking ? booking.date.slice(0, 10) : today(),
  status: booking?.status ?? "pending",
  note: booking?.note ?? "",
});

export function BookingForm({ open, booking, bookings, onClose, onSubmit }: BookingFormProps) {
  return (
    <Dialog open={open} onClose={onClose} title={booking ? "تعديل الحجز" : "إضافة حجز"}>
      {/* Keyed so each open starts from the right values. */}
      <FormBody key={booking?.id ?? "new"} booking={booking} bookings={bookings} onClose={onClose} onSubmit={onSubmit} />
    </Dialog>
  );
}

function FormBody({ booking, bookings, onClose, onSubmit }: Omit<BookingFormProps, "open">) {
  const [values, setValues] = useState<BookingEntryInput>(() => toInput(booking));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // A day is taken when another booking that is not cancelled sits on it. The booking being edited keeps its own day.
  const takenDays = new Set(
    bookings
      .filter((other) => other.id !== booking?.id && other.status !== "cancelled")
      .map((other) => other.date.slice(0, 10)),
  );
  // A cancelled booking holds no day, so it may sit on any date.
  const isDisabled = (day: string) => values.status !== "cancelled" && takenDays.has(day);

  const set = <K extends keyof BookingEntryInput>(key: K, value: BookingEntryInput[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);

        startTransition(async () => {
          const result = await onSubmit(values);
          if (result.ok) onClose();
          else setError(result.error);
        });
      }}
    >
      <label className="grid gap-1.5 text-sm text-muted">
        البريد الإلكتروني
        <input
          required
          type="email"
          dir="ltr"
          value={values.email}
          onChange={(event) => set("email", event.target.value)}
          className={`${fieldClass} text-start`}
        />
      </label>

      <div className="grid gap-2 text-sm text-muted">
        <span>
          اليوم: <strong className="text-ink">{formatDayLong(values.date)}</strong>
        </span>
        <Calendar value={values.date} onChange={(day) => set("date", day)} isDisabled={isDisabled} />
        <span className="text-xs text-faint">الأيام الرمادية محجوزة لحجز آخر.</span>
      </div>

      <label className="grid gap-1.5 text-sm text-muted">
        الحالة
        <select
          value={values.status}
          onChange={(event) => set("status", event.target.value as BookingStatus)}
          className={fieldClass}
        >
          {BOOKING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {BOOKING_STATUS[status].label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm text-muted">
        ملاحظة (للفريق فقط)
        <textarea
          rows={3}
          maxLength={500}
          value={values.note}
          onChange={(event) => set("note", event.target.value)}
          className={fieldClass}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-line px-4 py-2.5 text-[15px] transition-colors hover:bg-surface"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand px-4 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? "جارٍ الحفظ…" : booking ? "حفظ" : "إضافة"}
        </button>
      </div>
    </form>
  );
}
