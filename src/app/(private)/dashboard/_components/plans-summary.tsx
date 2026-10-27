"use client";

import { usePlans } from "../_lib/hooks/use-plans";

/** Compact plan list for the overview. */
export function PlansSummary() {
  const { plans } = usePlans();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <div key={plan.id} className="rounded-lg border border-line bg-night-tile p-5">
          <p className="font-medium text-white">{plan.name}</p>
          <p className="mt-2 text-sm text-white/75">
            {plan.price} {plan.currency} · {plan.orders} طلب
          </p>
        </div>
      ))}
    </div>
  );
}
