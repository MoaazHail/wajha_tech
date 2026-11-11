"use client";

import { useState, useTransition } from "react";

import { CrudCard } from "@/shared/components/crud-card";
import type { Plan } from "@/shared/lib/types/api";
import { formatNumber } from "@/shared/lib/utils/format.util";
import { CheckIcon, PlusIcon } from "@/shared/ui/icons";

import { createPlanAction, deletePlanAction, updatePlanAction } from "../../_lib/actions/plans.action";
import type { PlanInput } from "../../_lib/schemes/plan.scheme";
import type { ActionResult } from "../../_lib/types/action";
import { PlanForm } from "./plan-form";

/** The plans grid with add, edit and delete. */
export function PlansManager({ plans }: { plans: ReadonlyArray<Plan> }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const openForm = (plan: Plan | null) => {
    setEditing(plan);
    setFormOpen(true);
  };

  const submit = async (data: PlanInput): Promise<ActionResult> =>
    editing ? updatePlanAction(editing.id, data) : createPlanAction(data);

  const remove = (plan: Plan) => {
    setError(null);
    startTransition(async () => {
      const result = await deletePlanAction(plan.id);
      if (!result.ok) setError(result.error);
    });
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

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      {plans.length === 0 && <p className="py-10 text-center text-muted">لا توجد خطط بعد</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <CrudCard
            key={plan.id}
            onEdit={() => openForm(plan)}
            onDelete={() => remove(plan)}
            deleteMessage={`هل أنت متأكد من حذف «${plan.title}»؟ لا يمكن التراجع عن هذا الإجراء.`}
          >
            <h2 className="pe-20 text-lg text-ink">{plan.title}</h2>
            <p className="mt-2 font-display text-3xl font-semibold text-brand">
              {formatNumber(plan.price)} <span className="text-base font-normal text-muted">{plan.currency}</span>
            </p>
            <p className="mt-1 text-sm text-faint">{plan.orders ?? 0} طلب</p>

            <ul className="mt-4 grid gap-2 text-[15px] text-ink-soft">
              {plan.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <CheckIcon className="flex-none text-accent" />
                  {benefit}
                </li>
              ))}
            </ul>
          </CrudCard>
        ))}
      </div>

      <PlanForm open={formOpen} plan={editing} onClose={() => setFormOpen(false)} onSubmit={submit} />
    </>
  );
}
