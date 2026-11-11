"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/utils/cn.util";
import { formatMonth, parseDay, toDayString, weekdayNames } from "@/shared/lib/utils/date.util";
import { ChevronIcon } from "@/shared/ui/icons";

interface CalendarProps {
  /** The selected day, `YYYY-MM-DD`. */
  value?: string;
  /** Called with the clicked day, `YYYY-MM-DD`. */
  onChange: (day: string) => void;
  /** Earliest selectable day, `YYYY-MM-DD`. Earlier days are shown but disabled. */
  min?: string;
  /** Latest selectable day, `YYYY-MM-DD`. */
  max?: string;
  /** Extra rule for days inside the range, e.g. weekends. Return true to disable. */
  isDisabled?: (day: string) => boolean;
  /** 0 = Sunday. */
  weekStartsOn?: 0 | 1 | 6;
  className?: string;
}

/**
 * A month grid for picking one day. Fluid: the seven columns share the width, so it
 * fits a phone and a dialog alike. Month arrows stop at `min` and `max`.
 */
export function Calendar({ value, onChange, min, max, isDisabled, weekStartsOn = 0, className }: CalendarProps) {
  const selected = value ? parseDay(value) : null;
  const minDate = min ? parseDay(min) : null;
  const maxDate = max ? parseDay(max) : null;
  const todayString = toDayString(new Date());

  const start = selected ?? minDate ?? new Date();
  const [view, setView] = useState({ year: start.getFullYear(), month: start.getMonth() });

  const first = new Date(view.year, view.month, 1);
  const leading = (first.getDay() - weekStartsOn + 7) % 7;
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  const cells: Array<string | null> = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => toDayString(new Date(view.year, view.month, index + 1))),
  ];

  const canGoBack = !minDate || new Date(view.year, view.month, 1) > new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const canGoForward =
    !maxDate || new Date(view.year, view.month, 1) < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  const shift = (amount: number) =>
    setView((current) => {
      const next = new Date(current.year, current.month + amount, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });

  const disabled = (day: string) =>
    Boolean((min && day < min) || (max && day > max) || isDisabled?.(day));

  const navClass =
    "flex size-10 items-center justify-center rounded-md border border-line text-ink transition-colors hover:bg-surface disabled:pointer-events-none disabled:opacity-35";

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-2">
        {/* RTL: "previous" points right, "next" points left. */}
        <button type="button" onClick={() => shift(-1)} disabled={!canGoBack} aria-label="الشهر السابق" className={navClass}>
          <ChevronIcon direction="end" />
        </button>
        <p aria-live="polite" className="text-base font-semibold">
          {formatMonth(view.year, view.month)}
        </p>
        <button type="button" onClick={() => shift(1)} disabled={!canGoForward} aria-label="الشهر التالي" className={navClass}>
          <ChevronIcon direction="start" />
        </button>
      </div>

      <div role="grid" aria-label={formatMonth(view.year, view.month)} className="mt-3">
        <div role="row" className="grid grid-cols-7 text-center text-xs text-muted">
          {weekdayNames(weekStartsOn).map((name) => (
            <span key={name} role="columnheader" className="py-2">
              {name}
            </span>
          ))}
        </div>

        <div role="row" className="grid grid-cols-7 gap-y-1">
          {cells.map((day, index) =>
            day === null ? (
              <span key={`blank-${index}`} role="gridcell" />
            ) : (
              <span key={day} role="gridcell" className="flex justify-center">
                <button
                  type="button"
                  disabled={disabled(day)}
                  aria-pressed={day === value}
                  aria-current={day === todayString ? "date" : undefined}
                  aria-label={day}
                  onClick={() => onChange(day)}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-md font-mono text-[15px] transition-colors sm:size-11",
                    "disabled:cursor-not-allowed disabled:text-faint/50",
                    day === value
                      ? "bg-brand font-semibold text-white"
                      : "text-ink enabled:hover:bg-brand/10",
                    day === todayString && day !== value && "border border-brand/40",
                  )}
                >
                  {Number(day.slice(8))}
                </button>
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
