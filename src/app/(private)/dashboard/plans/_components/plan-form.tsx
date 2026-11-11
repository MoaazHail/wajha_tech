"use client";

import { useState, useTransition } from "react";

import { Dialog } from "@/shared/components/dialog";
import type { Plan } from "@/shared/lib/types/api";

import type { PlanInput } from "../../_lib/schemes/plan.scheme";
import type { ActionResult } from "../../_lib/types/action";

interface PlanFormProps {
  open: boolean;
  /** The plan being edited; leave empty to add a new one. */
  plan?: Plan | null;
  onClose: () => void;
  onSubmit: (data: PlanInput) => Promise<ActionResult>;
}

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px] outline-none transition-colors focus:border-brand";

export function PlanForm({ open, plan, onClose, onSubmit }: PlanFormProps) {
  return (
    <Dialog open={open} onClose={onClose} title={plan ? "تعديل الخطة" : "إضافة خطة"}>
      {/* Keyed so each open starts from the right values. */}
      <FormBody key={plan?.id ?? "new"} plan={plan} onClose={onClose} onSubmit={onSubmit} />
    </Dialog>
  );
}

function FormBody({ plan, onClose, onSubmit }: Omit<PlanFormProps, "open">) {
  const [title, setTitle] = useState(plan?.title ?? "");
  const [price, setPrice] = useState(plan ? String(plan.price) : "");
  const [benefits, setBenefits] = useState(plan?.benefits.join("\n") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);

        startTransition(async () => {
          const result = await onSubmit({
            title,
            price: Number(price),
            benefits: benefits
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean),
          });

          if (result.ok) onClose();
          else setError(result.error);
        });
      }}
    >
      <label className="grid gap-1.5 text-sm text-muted">
        اسم الخطة
        <input required value={title} onChange={(event) => setTitle(event.target.value)} className={fieldClass} />
      </label>

      <label className="grid gap-1.5 text-sm text-muted">
        السعر (ريال)
        <input
          required
          type="number"
          min={0}
          inputMode="numeric"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="grid gap-1.5 text-sm text-muted">
        المميزات (ميزة في كل سطر)
        <textarea
          rows={4}
          value={benefits}
          onChange={(event) => setBenefits(event.target.value)}
          className={fieldClass}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-line px-4 py-2 text-[15px] transition-colors hover:bg-surface"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand px-4 py-2 text-[15px] font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {plan ? "حفظ" : "إضافة"}
        </button>
      </div>
    </form>
  );
}
