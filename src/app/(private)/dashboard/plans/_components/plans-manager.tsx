"use client";

import { useState } from "react";

import { CrudCard } from "@/shared/components/crud-card";
import { CheckIcon, PlusIcon } from "@/shared/ui/icons";

import type { Plan } from "../../_lib/constants/dashboard-data.constant";
import { usePlans } from "../../_lib/hooks/use-plans";
import { PlanForm } from "./plan-form";

/** The plans grid with add, edit and delete. */
export function PlansManager() {
  const { plans, add, update, remove } = usePlans();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);

  const openForm = (plan: Plan | null) => {
    setEditing(plan);
    setFormOpen(true);
  };

  return (
    <>
      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => openForm(null)}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-brand-dark"
        >
          <PlusIcon />
          إضافة خطة
        </button>
      </div>

      {plans.length === 0 && <p className="py-10 text-center text-muted">لا توجد خطط بعد</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <CrudCard
            key={plan.id}
            onEdit={() => openForm(plan)}
            onDelete={() => remove(plan.id)}
            deleteMessage={`هل أنت متأكد من حذف «${plan.name}»؟ لا يمكن التراجع عن هذا الإجراء.`}
          >
            <h2 className="pe-20 text-lg text-ink">{plan.name}</h2>
            <p className="mt-2 font-display text-3xl font-semibold text-brand">
              {plan.price} <span className="text-base font-normal text-muted">{plan.currency}</span>
            </p>
            <p className="mt-1 text-sm text-faint">{plan.orders} طلب</p>

            <ul className="mt-4 grid gap-2 text-[15px] text-ink-soft">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckIcon className="flex-none text-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </CrudCard>
        ))}
      </div>

      <PlanForm
        open={formOpen}
        plan={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={(data) => {
          if (editing) update(editing.id, data);
          else add(data);
          setFormOpen(false);
        }}
      />
    </>
  );
}
