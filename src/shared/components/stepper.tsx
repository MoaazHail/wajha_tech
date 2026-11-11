import { Fragment } from "react";

import { cn } from "@/shared/lib/utils/cn.util";

interface StepperProps {
  /** One label per step, in order. The count of labels is the count of steps. */
  steps: ReadonlyArray<string>;
  /** The step the user is on, starting at 1. */
  current: number;
  className?: string;
}

/**
 * Progress through a multi-step flow: a diamond per step joined by lines. Finished
 * steps are solid, the current one is solid with a halo, the rest are hollow with a
 * dashed line leading to them. Below it, "الخطوة 2 من 4" and the current label.
 */
export function Stepper({ steps, current, className }: StepperProps) {
  const total = steps.length;
  const active = Math.min(Math.max(current, 1), total);

  return (
    <div className={className}>
      <ol aria-label="مراحل الحجز" className="flex items-center">
        {steps.map((label, index) => {
          const number = index + 1;
          const done = number < active;
          const isCurrent = number === active;

          return (
            <Fragment key={label}>
              <li aria-current={isCurrent ? "step" : undefined} className="flex flex-none items-center justify-center">
                <span className="sr-only">{`${number}: ${label}${done ? " (مكتملة)" : ""}`}</span>
                <span
                  aria-hidden
                  className={cn("relative flex size-6 items-center justify-center", isCurrent && "[&>i]:opacity-100")}
                >
                  <i className="absolute size-6 rotate-45 rounded-[3px] bg-brand/15 opacity-0 transition-opacity" />
                  <i
                    className={cn(
                      "relative size-3 rotate-45 rounded-[2px] border-2 border-brand transition-colors",
                      done || isCurrent ? "bg-brand" : "bg-white",
                    )}
                  />
                </span>
              </li>

              {number < total && (
                <li
                  aria-hidden
                  className={cn(
                    "mx-1 h-0 min-w-4 flex-1 border-t transition-colors",
                    number < active ? "border-solid border-brand" : "border-dashed border-brand/70",
                  )}
                />
              )}
            </Fragment>
          );
        })}
      </ol>

      <p className="mt-3 text-sm text-muted">
        <span>
          الخطوة <span className="font-mono">{active}</span> من <span className="font-mono">{total}</span>
        </span>
        <span aria-hidden> · </span>
        <span className="font-medium text-brand">{steps[active - 1]}</span>
      </p>
    </div>
  );
}
