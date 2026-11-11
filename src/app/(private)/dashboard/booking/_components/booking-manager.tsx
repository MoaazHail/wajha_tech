"use client";

import { useState, useTransition } from "react";

import { DataTable } from "@/shared/components/data-table";
import type { Booking, BookingStatus } from "@/shared/lib/types/api";
import { cn } from "@/shared/lib/utils/cn.util";

import {
  createBookingEntryAction,
  deleteBookingEntryAction,
  updateBookingEntryAction,
} from "../../_lib/actions/bookings.action";
import { BOOKING_STATUS, BOOKING_STATUSES } from "../../_lib/constants/booking-status.constant";
import type { BookingEntryInput } from "../../_lib/schemes/booking.scheme";
import type { ActionResult } from "../../_lib/types/action";
import { BOOKING_COLUMNS } from "./booking-columns";
import { BookingForm } from "./booking-form";

type Filter = "all" | BookingStatus;

/** The bookings table with a status filter, add, edit and delete. */
export function BookingManager({ bookings }: { bookings: ReadonlyArray<Booking> }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const visible = filter === "all" ? bookings : bookings.filter((booking) => booking.status === filter);
  const count = (status: Filter) =>
    status === "all" ? bookings.length : bookings.filter((booking) => booking.status === status).length;

  const submit = async (data: BookingEntryInput): Promise<ActionResult> =>
    editing ? updateBookingEntryAction(editing.id, data) : createBookingEntryAction(data);

  const remove = (row: Booking) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteBookingEntryAction(row.id);
      if (!result.ok) setError(result.error);
    });
  };

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: "الكل" },
    ...BOOKING_STATUSES.map((status) => ({ key: status, label: BOOKING_STATUS[status].label })),
  ];

  return (
    <>
      <div role="group" aria-label="تصفية الحجوزات" className="flex flex-wrap gap-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              filter === key ? "border-brand bg-brand text-white" : "border-white/15 text-white/75 hover:bg-white/10",
            )}
          >
            {label} <span className="font-mono">({count(key)})</span>
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <DataTable
        columns={BOOKING_COLUMNS}
        rows={visible}
        getRowId={(row) => row.id}
        addLabel="إضافة حجز"
        onAdd={() => {
          setEditing(null);
          setFormOpen(true);
        }}
        onEdit={(row) => {
          setEditing(row);
          setFormOpen(true);
        }}
        onDelete={remove}
        deleteMessage={(row) => `هل أنت متأكد من حذف حجز «${row.email}»؟ لا يمكن التراجع عن هذا الإجراء.`}
        emptyText="لا توجد حجوزات"
        theme="dark"
      />

      <BookingForm open={formOpen} booking={editing} bookings={bookings} onClose={() => setFormOpen(false)} onSubmit={submit} />
    </>
  );
}
