import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ book: vi.fn(), createBooking: vi.fn(), taken: vi.fn(), listTaken: vi.fn() }));

vi.mock("../_lib/actions/booking.action", () => ({ bookMeetingAction: mocks.book, getTakenDaysAction: mocks.taken }));

import { ApiError } from "@/shared/lib/apis/client.api";
import { addDays, today } from "@/shared/lib/utils/date.util";

vi.mock("../_lib/apis/booking.api", () => ({ createBooking: mocks.createBooking, listTakenDays: mocks.listTaken }));

import { bookingScheme } from "../_lib/schemes/booking.scheme";
import { BookingButton } from "./booking-button";
import { BookingModal } from "./booking-modal";

const pickDay = (day: string) => fireEvent.click(screen.getByRole("button", { name: day }));
const typeEmail = (value: string) => fireEvent.change(screen.getByLabelText("بريدك الإلكتروني"), { target: { value } });
const currentStep = () => document.querySelector('[aria-current="step"]')?.textContent ?? "";

describe("BookingModal", () => {
  const tomorrow = addDays(today(), 1);

  beforeEach(() => {
    mocks.book.mockResolvedValue({ ok: true });
    mocks.taken.mockResolvedValue([]);
  });

  it("starts on step 1 with the calendar and a progress bar", () => {
    render(<BookingModal open onClose={() => {}} />);

    expect(screen.getByRole("heading", { name: "احجز موعداً معنا" })).toBeInTheDocument();
    expect(currentStep()).toContain("1: اختر اليوم");
    expect(screen.getByRole("grid")).toBeInTheDocument();
    // Four steps in the progress list.
    expect(screen.getByRole("list", { name: "مراحل الحجز" }).querySelectorAll("li:not([aria-hidden])")).toHaveLength(4);
  });

  it("does not let the visitor pick a day in the past", () => {
    render(<BookingModal open onClose={() => {}} />);
    expect(screen.getByRole("button", { name: addDays(today(), -1) })).toBeDisabled();
  });

  it("clicking a day moves to the email step", () => {
    render(<BookingModal open onClose={() => {}} />);
    pickDay(tomorrow);

    expect(currentStep()).toContain("2: بريدك الإلكتروني");
    expect(screen.getByLabelText("بريدك الإلكتروني")).toBeInTheDocument();
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("can go back and change the day", () => {
    render(<BookingModal open onClose={() => {}} />);
    pickDay(tomorrow);
    fireEvent.click(screen.getByRole("button", { name: "تغيير" }));
    expect(currentStep()).toContain("1: اختر اليوم");
  });

  it("blocks an invalid or malicious email on the client, without calling the server", () => {
    render(<BookingModal open onClose={() => {}} />);
    pickDay(tomorrow);

    typeEmail("not-an-email");
    fireEvent.click(screen.getByRole("button", { name: "التالي" }));
    expect(screen.getByRole("alert")).toHaveTextContent("البريد الإلكتروني غير صالح");

    typeEmail('"><script>alert(1)</script>@x.co');
    fireEvent.click(screen.getByRole("button", { name: "التالي" }));
    expect(screen.getByRole("alert")).toHaveTextContent("رموز غير مسموحة");

    expect(currentStep()).toContain("2:");
    expect(mocks.book).not.toHaveBeenCalled();
  });

  it("asks for confirmation before sending anything", () => {
    render(<BookingModal open onClose={() => {}} />);
    pickDay(tomorrow);
    typeEmail("  visitor@example.com ");
    fireEvent.click(screen.getByRole("button", { name: "التالي" }));

    expect(currentStep()).toContain("3: تأكيد الحجز");
    expect(screen.getByText(/هل أنت متأكد من حجز موعد/)).toBeInTheDocument();
    expect(screen.getByText("visitor@example.com")).toBeInTheDocument();
    expect(mocks.book).not.toHaveBeenCalled();
  });

  it("goes back from the confirmation to edit the email", () => {
    render(<BookingModal open onClose={() => {}} />);
    pickDay(tomorrow);
    typeEmail("a@b.co");
    fireEvent.click(screen.getByRole("button", { name: "التالي" }));
    fireEvent.click(screen.getByRole("button", { name: "لا، رجوع" }));

    expect(currentStep()).toContain("2:");
    expect(screen.getByLabelText("بريدك الإلكتروني")).toHaveValue("a@b.co");
  });

  it("on yes, sends the day and email and shows the success step", async () => {
    render(<BookingModal open onClose={() => {}} />);
    pickDay(tomorrow);
    typeEmail("a@b.co");
    fireEvent.click(screen.getByRole("button", { name: "التالي" }));
    fireEvent.click(screen.getByRole("button", { name: "نعم، أكّد الحجز" }));

    await waitFor(() => expect(mocks.book).toHaveBeenCalledWith({ date: tomorrow, email: "a@b.co" }));
    expect(await screen.findByRole("status")).toHaveTextContent("تم استلام طلبك");
    expect(currentStep()).toContain("4: تم الحجز");
  });

  it("shows the server error on the confirmation step and lets the visitor retry", async () => {
    mocks.book.mockResolvedValueOnce({ ok: false, error: "تعذّر إرسال رسالة التأكيد، حاول مرة أخرى" });
    render(<BookingModal open onClose={() => {}} />);
    pickDay(tomorrow);
    typeEmail("a@b.co");
    fireEvent.click(screen.getByRole("button", { name: "التالي" }));
    fireEvent.click(screen.getByRole("button", { name: "نعم، أكّد الحجز" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("تعذّر إرسال رسالة التأكيد");
    expect(currentStep()).toContain("3:");

    // The button is disabled while the request is pending: wait for it before retrying.
    const retry = await screen.findByRole("button", { name: "نعم، أكّد الحجز" });
    await waitFor(() => expect(retry).toBeEnabled());
    fireEvent.click(retry);
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("closes from the success step", async () => {
    const onClose = vi.fn();
    render(<BookingModal open onClose={onClose} />);
    pickDay(tomorrow);
    typeEmail("a@b.co");
    fireEvent.click(screen.getByRole("button", { name: "التالي" }));
    fireEvent.click(screen.getByRole("button", { name: "نعم، أكّد الحجز" }));
    fireEvent.click(await screen.findByText("إغلاق"));
    expect(onClose).toHaveBeenCalled();
  });

  it("is responsive: action buttons stack on phones and the dialog scrolls", () => {
    const { container } = render(<BookingModal open onClose={() => {}} />);
    pickDay(tomorrow);
    expect(container.querySelector("dialog")).toHaveClass("w-[min(94vw,30rem)]", "max-h-[92dvh]");
    expect(screen.getByRole("button", { name: "التالي" }).parentElement).toHaveClass("flex-col-reverse", "sm:flex-row");
  });
});

describe("BookingModal: days booked by someone else", () => {
  const free = addDays(today(), 3);
  const booked = addDays(today(), 4);

  beforeEach(() => {
    mocks.book.mockResolvedValue({ ok: true });
  });

  it("greys out days that are already booked and still allows the others", async () => {
    mocks.taken.mockResolvedValue([booked]);
    render(<BookingModal open onClose={() => {}} />);

    await waitFor(() => expect(screen.getByRole("button", { name: booked })).toBeDisabled());
    expect(screen.getByRole("button", { name: free })).toBeEnabled();
    expect(screen.getByText(/الأيام الرمادية غير متاحة/)).toBeInTheDocument();
  });

  it("clicking a booked day does nothing", async () => {
    mocks.taken.mockResolvedValue([booked]);
    render(<BookingModal open onClose={() => {}} />);
    await waitFor(() => expect(screen.getByRole("button", { name: booked })).toBeDisabled());

    fireEvent.click(screen.getByRole("button", { name: booked }));
    expect(currentStep()).toContain("1: اختر اليوم");
  });

  it("says so while the days are loading", () => {
    mocks.taken.mockReturnValue(new Promise(() => {}));
    render(<BookingModal open onClose={() => {}} />);
    expect(screen.getByText("جارٍ تحميل الأيام المتاحة…")).toBeInTheDocument();
  });

  it("if someone takes the day first, returns to the calendar with the message and the day greyed out", async () => {
    mocks.taken.mockResolvedValueOnce([]).mockResolvedValue([free]);
    mocks.book.mockResolvedValueOnce({ ok: false, error: "هذا اليوم محجوز، اختر يوماً آخر", conflict: true });
    render(<BookingModal open onClose={() => {}} />);
    await waitFor(() => expect(mocks.taken).toHaveBeenCalledTimes(1));

    pickDay(free);
    typeEmail("a@b.co");
    fireEvent.click(screen.getByRole("button", { name: "التالي" }));
    fireEvent.click(screen.getByRole("button", { name: "نعم، أكّد الحجز" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("هذا اليوم محجوز");
    expect(currentStep()).toContain("1: اختر اليوم");
    await waitFor(() => expect(screen.getByRole("button", { name: free })).toBeDisabled());
  });
});

describe("BookingButton", () => {
  afterEach(() => vi.clearAllMocks());

  it("opens the modal from step 1 every time", () => {
    render(<BookingButton tone="white">اطلب موقعك الآن</BookingButton>);
    expect(screen.queryByRole("heading", { name: "احجز موعداً معنا" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "اطلب موقعك الآن" }));
    pickDay(addDays(today(), 2));
    expect(currentStep()).toContain("2:");

    fireEvent.click(screen.getByLabelText("إغلاق"));
    fireEvent.click(screen.getByRole("button", { name: "اطلب موقعك الآن" }));
    expect(currentStep()).toContain("1: اختر اليوم");
  });
});

describe("bookingScheme", () => {
  const ok = { date: addDays(today(), 1), email: "a@b.co" };

  it("accepts today and the last allowed day", () => {
    expect(bookingScheme.safeParse({ ...ok, date: today() }).success).toBe(true);
    expect(bookingScheme.safeParse({ ...ok, date: addDays(today(), 90) }).success).toBe(true);
  });

  it("rejects the past, too far ahead, and nonsense", () => {
    expect(bookingScheme.safeParse({ ...ok, date: addDays(today(), -1) }).error?.issues[0]?.message).toBe("لا يمكن حجز يوم مضى");
    expect(bookingScheme.safeParse({ ...ok, date: addDays(today(), 91) }).success).toBe(false);
    expect(bookingScheme.safeParse({ ...ok, date: "2026-02-30" }).success).toBe(false);
    expect(bookingScheme.safeParse({ ...ok, date: "" }).success).toBe(false);
  });

  it("applies the shared email rules", () => {
    expect(bookingScheme.safeParse({ ...ok, email: "<b>@x.co" }).success).toBe(false);
    expect(bookingScheme.safeParse({ ...ok, email: "" }).success).toBe(false);
  });
});

describe("getTakenDaysAction", () => {
  const load = () => vi.importActual<typeof import("../_lib/actions/booking.action")>("../_lib/actions/booking.action");

  it("returns the booked days", async () => {
    mocks.listTaken.mockResolvedValue(["2026-12-11"]);
    await expect((await load()).getTakenDaysAction()).resolves.toEqual(["2026-12-11"]);
  });

  it("returns none when the API is unreachable, so the form still works", async () => {
    mocks.listTaken.mockRejectedValue(new TypeError("fetch failed"));
    await expect((await load()).getTakenDaysAction()).resolves.toEqual([]);
  });

  it("flags a 409 as a conflict and keeps the API message", async () => {
    mocks.createBooking.mockRejectedValue(new ApiError("هذا اليوم محجوز، اختر يوماً آخر", 409));
    const result = await (await load()).bookMeetingAction({ date: addDays(today(), 1), email: "a@b.co" });
    expect(result).toEqual({ ok: false, error: "هذا اليوم محجوز، اختر يوماً آخر", conflict: true });
  });
});

describe("bookMeetingAction", () => {
  // The real action, with the API call mocked.
  const load = () => vi.importActual<typeof import("../_lib/actions/booking.action")>("../_lib/actions/booking.action");
  const input = { date: addDays(today(), 1), email: "a@b.co" };

  it("rejects invalid input without calling the API", async () => {
    const { bookMeetingAction } = await load();
    await expect(bookMeetingAction({ ...input, email: "x" })).resolves.toMatchObject({ ok: false });
    expect(mocks.createBooking).not.toHaveBeenCalled();
  });

  it("returns ok on success", async () => {
    mocks.createBooking.mockResolvedValue({});
    const { bookMeetingAction } = await load();
    await expect(bookMeetingAction(input)).resolves.toEqual({ ok: true });
    expect(mocks.createBooking).toHaveBeenCalledWith(input);
  });

  it.each([
    [429, "محاولات كثيرة، حاول لاحقاً"],
    [400, "بيانات غير صالحة، راجع اليوم والبريد"],
    [502, "تعذّر إرسال رسالة التأكيد"],
    [503, "خدمة البريد غير مفعّلة"],
  ])("maps API status %s to a visitor-friendly message", async (status, message) => {
    mocks.createBooking.mockRejectedValue(new ApiError(message, status));
    const { bookMeetingAction } = await load();
    await expect(bookMeetingAction(input)).resolves.toEqual({ ok: false, error: message });
  });

  it("reports an unreachable server for anything else", async () => {
    mocks.createBooking.mockRejectedValue(new TypeError("fetch failed"));
    const { bookMeetingAction } = await load();
    await expect(bookMeetingAction(input)).resolves.toEqual({ ok: false, error: "تعذّر الاتصال بالخادم، حاول مرة أخرى" });
  });
});
