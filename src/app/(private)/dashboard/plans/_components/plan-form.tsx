"use client";

import { useState } from "react";

import { Dialog } from "@/shared/components/dialog";

import type { Plan } from "../../_lib/constants/dashboard-data.constant";

type PlanInput = Omit<Plan, "id">;

interface PlanFormProps {
  open: boolean;
  /** The plan being edited; leave empty to add a new one. */
  plan?: Plan | null;
  onClose: () => void;
  onSubmit: (data: PlanInput) => void;
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
  const [name, setName] = useState(plan?.name ?? "");
  const [price, setPrice] = useState(plan?.price ?? "");
  const [orders, setOrders] = useState(String(plan?.orders ?? 0));
  const [features, setFeatures] = useState(plan?.features.join("\n") ?? "");

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          name: name.trim(),
          price: price.trim(),
          currency: plan?.currency ?? "ريال",
          orders: Number(orders) || 0,
          features: features
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        });
      }}
    >
      <label className="grid gap-1.5 text-sm text-muted">
        اسم الخطة
        <input required value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-muted">
          السعر (ريال)
          <input
            required
            inputMode="numeric"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="grid gap-1.5 text-sm text-muted">
          عدد الطلبات
          <input
            type="number"
            min={0}
            value={orders}
            onChange={(event) => setOrders(event.target.value)}
            className={fieldClass}
          />
        </label>
      </div>

      <label className="grid gap-1.5 text-sm text-muted">
        المميزات (ميزة في كل سطر)
        <textarea
          rows={4}
          value={features}
          onChange={(event) => setFeatures(event.target.value)}
          className={fieldClass}
        />
      </label>

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
          className="rounded-md bg-brand px-4 py-2 text-[15px] font-medium text-white transition-colors hover:bg-brand-dark"
        >
          {plan ? "حفظ" : "إضافة"}
        </button>
      </div>
    </form>
  );
}
