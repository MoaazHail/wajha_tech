import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  api: {
    listBookings: vi.fn(),
    createAdminBooking: vi.fn(),
    updateAdminBooking: vi.fn(),
    deleteAdminBooking: vi.fn(),
  },
  runMutation: vi.fn(async (write: () => Promise<unknown>) => {
    await write();
    return { ok: true };
  }),
  actions: {
    createBookingEntryAction: vi.fn(),
    updateBookingEntryAction: vi.fn(),
    deleteBookingEntryAction: vi.fn(),
  },
}));

vi.mock("../_lib/apis/dashboard.api", () => mocks.api);
vi.mock("../_lib/actions/bookings.action", () => mocks.actions);

import type { Booking } from "@/shared/lib/types/api";

import { BOOKING_STATUS } from "../_lib/constants/booking-status.constant";
import { bookingEntryScheme } from "../_lib/schemes/booking.scheme";
import { BookingManager } from "./_components/booking-manager";
import BookingLoading from "./loading";
import BookingPage from "./page";

const bookings: Booking[] = [
  { id: "b1", email: "one@example.com", date: "2026-11-14T00:00:00.000Z", status: "pending", note: "اتصال صباحاً" },
  { id: "b2", email: "two@example.com", date: "2026-11-20T00:00:00.000Z", status: "confirmed" },
  { id: "b3", email: "three@example.com", date: "2026-11-02T00:00:00.000Z", status: "cancelled" },
];

beforeEach(() => {
  mocks.api.listBookings.mockResolvedValue(bookings);
  for (const action of Object.values(mocks.actions)) action.mockResolvedValue({ ok: true });
});

describe("booking page", () => {
  it("loads the bookings server-side and lists them", async () => {
    render(await BookingPage());

    expect(screen.getByRole("heading", { name: "الحجوزات" })).toBeInTheDocument();
    expect(mocks.api.listBookings).toHaveBeenCalledOnce();
    expect(screen.getAllByText("one@example.com").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2026-11-14").length).toBeGreaterThan(0);
    expect(screen.getAllByText("اتصال صباحاً").length).toBeGreaterThan(0);
  });

  it("shows an accessible skeleton while loading", () => {
    render(<BookingLoading />);
    expect(screen.getByRole("status", { name: "جارٍ التحميل" })).toBeInTheDocument();
  });

  it("is responsive: the table collapses into cards on phones", () => {
    const { container } = render(<BookingManager bookings={bookings} />);
    expect(container.querySelector("table")!.parentElement).toHaveClass("hidden", "md:block");
    expect(container.querySelector("ul")).toHaveClass("md:hidden");
    expect(screen.getByRole("group", { name: "تصفية الحجوزات" })).toHaveClass("flex-wrap");
  });
});

describe("status filter", () => {
  it("shows counts and filters the rows", () => {
    render(<BookingManager bookings={bookings} />);

    expect(screen.getByRole("button", { name: /الكل \(3\)/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /مؤكد \(1\)/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /مؤكد/ }));
    expect(screen.getAllByText("two@example.com").length).toBeGreaterThan(0);
    expect(screen.queryByText("one@example.com")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /الكل/ }));
    expect(screen.getAllByText("one@example.com").length).toBeGreaterThan(0);
  });

  it("shows an empty message when nothing matches", () => {
    render(<BookingManager bookings={[]} />);
    expect(screen.getAllByText("لا توجد حجوزات").length).toBeGreaterThan(0);
  });
});

describe("create", () => {
  const open = () => {
    fireEvent.click(screen.getByRole("button", { name: /إضافة حجز/ }));
    return screen.getByRole("heading", { name: "إضافة حجز" }).closest("dialog")!;
  };

  it("adds a booking with the picked day, status and note", async () => {
    render(<BookingManager bookings={bookings} />);
    const dialog = open();

    fireEvent.change(within(dialog).getByLabelText("البريد الإلكتروني"), { target: { value: "new@example.com" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /^\d{4}-\d{2}-15$/ }));
    fireEvent.change(within(dialog).getByLabelText("الحالة"), { target: { value: "confirmed" } });
    fireEvent.change(within(dialog).getByLabelText("ملاحظة (للفريق فقط)"), { target: { value: "VIP" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "إضافة" }));

    await waitFor(() =>
      expect(mocks.actions.createBookingEntryAction).toHaveBeenCalledWith({
        email: "new@example.com",
        date: expect.stringMatching(/^\d{4}-\d{2}-15$/),
        status: "confirmed",
        note: "VIP",
      }),
    );
  });

  it("shows a server error and keeps the form open", async () => {
    mocks.actions.createBookingEntryAction.mockResolvedValue({ ok: false, error: "البريد الإلكتروني غير صالح" });
    render(<BookingManager bookings={bookings} />);
    const dialog = open();

    fireEvent.click(within(dialog).getByRole("button", { name: "إضافة" }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent("البريد الإلكتروني غير صالح");
  });
});

describe("update", () => {
  it("opens prefilled from the row menu and saves changes", async () => {
    render(<BookingManager bookings={bookings} />);

    fireEvent.click(screen.getAllByLabelText("إجراءات الصف")[0]!);
    fireEvent.click(screen.getByRole("menuitem", { name: /تعديل/ }));

    const dialog = screen.getByRole("heading", { name: "تعديل الحجز" }).closest("dialog")!;
    expect(within(dialog).getByLabelText("البريد الإلكتروني")).toHaveValue("one@example.com");
    expect(within(dialog).getByLabelText("الحالة")).toHaveValue("pending");
    expect(within(dialog).getByRole("button", { name: "2026-11-14" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.change(within(dialog).getByLabelText("الحالة"), { target: { value: "confirmed" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "حفظ" }));

    await waitFor(() =>
      expect(mocks.actions.updateBookingEntryAction).toHaveBeenCalledWith(
        "b1",
        expect.objectContaining({ status: "confirmed", date: "2026-11-14", note: "اتصال صباحاً" }),
      ),
    );
  });
});

describe("delete", () => {
  it("asks first, then deletes the right booking", async () => {
    render(<BookingManager bookings={bookings} />);

    fireEvent.click(screen.getAllByLabelText("إجراءات الصف")[1]!);
    fireEvent.click(screen.getByRole("menuitem", { name: /حذف/ }));

    const confirm = screen.getByText("تأكيد الحذف").closest("dialog")!;
    expect(within(confirm).getByText(/two@example.com/)).toBeInTheDocument();
    expect(mocks.actions.deleteBookingEntryAction).not.toHaveBeenCalled();

    fireEvent.click(within(confirm).getByRole("button", { name: "حذف" }));
    await waitFor(() => expect(mocks.actions.deleteBookingEntryAction).toHaveBeenCalledWith("b2"));
  });

  it("shows the error when the delete fails", async () => {
    mocks.actions.deleteBookingEntryAction.mockResolvedValue({ ok: false, error: "تعذر الحذف" });
    render(<BookingManager bookings={bookings} />);

    fireEvent.click(screen.getAllByLabelText("إجراءات الصف")[0]!);
    fireEvent.click(screen.getByRole("menuitem", { name: /حذف/ }));
    fireEvent.click(within(screen.getByText("تأكيد الحذف").closest("dialog")!).getByRole("button", { name: "حذف" }));

    expect(await screen.findByText("تعذر الحذف")).toBeInTheDocument();
  });
});

describe("days held by another booking", () => {
  // The add form opens on the current month, so pin "today" to the month the fixtures live in.
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 11, 12));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const dayButton = (dialog: HTMLElement, day: string) => within(dialog).getByRole("button", { name: day });

  it("greys out a day another active booking holds, but not a cancelled one", () => {
    render(<BookingManager bookings={bookings} />);
    fireEvent.click(screen.getByRole("button", { name: /إضافة حجز/ }));
    const dialog = screen.getByRole("heading", { name: "إضافة حجز" }).closest("dialog")!;

    // b1 (pending) is on 11-14, b2 (confirmed) on 11-20, b3 (cancelled) on 11-02.
    expect(dayButton(dialog, "2026-11-14")).toBeDisabled();
    expect(dayButton(dialog, "2026-11-20")).toBeDisabled();
    expect(dayButton(dialog, "2026-11-02")).toBeEnabled();
    expect(dayButton(dialog, "2026-11-15")).toBeEnabled();
  });

  it("lets a booking keep its own day when edited, while other bookings' days stay greyed", () => {
    render(<BookingManager bookings={bookings} />);
    fireEvent.click(screen.getAllByLabelText("إجراءات الصف")[0]!);
    fireEvent.click(screen.getByRole("menuitem", { name: /تعديل/ }));
    const dialog = screen.getByRole("heading", { name: "تعديل الحجز" }).closest("dialog")!;

    expect(dayButton(dialog, "2026-11-14")).toBeEnabled();
    expect(dayButton(dialog, "2026-11-20")).toBeDisabled();
  });

  it("frees every day when the booking is set to cancelled", () => {
    render(<BookingManager bookings={bookings} />);
    fireEvent.click(screen.getByRole("button", { name: /إضافة حجز/ }));
    const dialog = screen.getByRole("heading", { name: "إضافة حجز" }).closest("dialog")!;

    fireEvent.change(within(dialog).getByLabelText("الحالة"), { target: { value: "cancelled" } });
    expect(dayButton(dialog, "2026-11-20")).toBeEnabled();
  });
});

describe("bookingEntryScheme / status labels", () => {
  const valid = { email: "a@b.co", date: "2026-01-02", status: "pending" as const, note: "" };

  it("accepts a past day (the dashboard records history)", () => {
    expect(bookingEntryScheme.safeParse({ ...valid, date: "2020-05-05" }).success).toBe(true);
  });

  it("rejects bad email, impossible day, unknown status and a long note", () => {
    expect(bookingEntryScheme.safeParse({ ...valid, email: "<x>@y.co" }).success).toBe(false);
    expect(bookingEntryScheme.safeParse({ ...valid, date: "2026-02-30" }).success).toBe(false);
    expect(bookingEntryScheme.safeParse({ ...valid, status: "done" }).success).toBe(false);
    expect(bookingEntryScheme.safeParse({ ...valid, note: "x".repeat(501) }).success).toBe(false);
  });

  it("has a label for every status", () => {
    expect(Object.values(BOOKING_STATUS).map((s) => s.label)).toEqual(["قيد الانتظار", "مؤكد", "ملغي"]);
  });
});
