"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { Calendar } from "@/shared/components/calendar";
import { Dialog } from "@/shared/components/dialog";
import { Stepper } from "@/shared/components/stepper";
import { addDays, formatDayLong, today } from "@/shared/lib/utils/date.util";

import { bookMeetingAction, getTakenDaysAction } from "../_lib/actions/booking.action";
import { bookingScheme, MAX_DAYS_AHEAD } from "../_lib/schemes/booking.scheme";

const STEPS = ["اختر اليوم", "بريدك الإلكتروني", "تأكيد الحجز", "تم الحجز"] as const;

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-brand";
const primaryClass =
  "rounded-md bg-brand px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60";
const secondaryClass = "rounded-md border border-line px-5 py-2.5 text-[15px] transition-colors hover:bg-surface";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

/** Book a meeting: pick a day, give an email, confirm. Four steps with a progress bar. */
export function BookingModal({ open, onClose }: BookingModalProps) {
  return (
    <Dialog open={open} onClose={onClose} title="احجز موعداً معنا">
      {/* Mounted only while open, so every opening starts again from step 1. */}
      <BookingFlow onClose={onClose} />
    </Dialog>
  );
}

function BookingFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  /** Days another visitor already booked. They are greyed out so the same day cannot be chosen twice. */
  const [taken, setTaken] = useState<ReadonlySet<string>>(new Set());
  const [loadingDays, setLoadingDays] = useState(true);

  const loadTaken = useMemo(
    () => async () => {
      setTaken(new Set(await getTakenDaysAction()));
      setLoadingDays(false);
    },
    [],
  );

  useEffect(() => {
    void loadTaken();
  }, [loadTaken]);

  const goTo = (next: number) => {
    setError(null);
    setStep(next);
  };

  const submitEmail = () => {
    const parsed = bookingScheme.safeParse({ date, email });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "بيانات غير صالحة");

    setEmail(parsed.data.email);
    goTo(3);
  };

  const confirm = () =>
    startTransition(async () => {
      setError(null);
      const result = await bookMeetingAction({ date, email });
      if (result.ok) return setStep(4);

      setError(result.error);
      if (result.conflict) {
        // Someone took the day while this form was open: refresh the calendar and let the visitor pick again.
        setDate("");
        await loadTaken();
        setStep(1);
      }
    });

  return (
    <div className="grid gap-5">
      <Stepper steps={STEPS} current={step} />

      {step === 1 && (
        <div className="grid gap-3">
          <p className="text-muted">اختر اليوم المناسب لك وسنتواصل معك لتحديد الوقت.</p>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <Calendar
            value={date}
            min={today()}
            max={addDays(today(), MAX_DAYS_AHEAD)}
            isDisabled={(day) => taken.has(day)}
            onChange={(day) => {
              setDate(day);
              goTo(2);
            }}
          />
          <p aria-live="polite" className="text-sm text-faint">
            {loadingDays ? "جارٍ تحميل الأيام المتاحة…" : "الأيام الرمادية غير متاحة (محجوزة أو منتهية)."}
          </p>
        </div>
      )}

      {step === 2 && (
        <form
          className="grid gap-4"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            submitEmail();
          }}
        >
          <p className="text-muted">
            اليوم المختار: <strong className="text-ink">{formatDayLong(date)}</strong>{" "}
            <button type="button" onClick={() => goTo(1)} className="text-brand underline underline-offset-4">
              تغيير
            </button>
          </p>

          <label className="grid gap-1.5 text-sm text-muted">
            بريدك الإلكتروني
            <input
              autoFocus
              required
              type="email"
              name="email"
              dir="ltr"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setError(null);
                setEmail(event.target.value);
              }}
              className={`${fieldClass} text-start`}
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => goTo(1)} className={secondaryClass}>
              رجوع
            </button>
            <button type="submit" className={primaryClass}>
              التالي
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="grid gap-4">
          <p className="leading-[1.9]">
            هل أنت متأكد من حجز موعد يوم <strong>{formatDayLong(date)}</strong>؟ سنرسل رسالة تأكيد إلى{" "}
            <strong dir="ltr" className="break-all font-mono">
              {email}
            </strong>
            .
          </p>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => goTo(2)} disabled={pending} className={secondaryClass}>
              لا، رجوع
            </button>
            <button type="button" onClick={confirm} disabled={pending} className={primaryClass}>
              {pending ? "جارٍ الإرسال…" : "نعم، أكّد الحجز"}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div role="status" className="grid gap-4">
          <p className="leading-[1.9]">
            تم استلام طلبك ليوم <strong>{formatDayLong(date)}</strong>. أرسلنا رسالة تأكيد إلى{" "}
            <strong dir="ltr" className="break-all font-mono">
              {email}
            </strong>{" "}
            وسنتواصل معك لتحديد الوقت.
          </p>
          <div className="flex sm:justify-end">
            <button type="button" onClick={onClose} className={`${primaryClass} w-full sm:w-auto`}>
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
