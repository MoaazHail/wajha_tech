import type { Plan } from "@/shared/lib/types/api";
import { formatNumber } from "@/shared/lib/utils/format.util";

/** Compact plan list for the overview. */
export function PlansSummary({ plans }: { plans: ReadonlyArray<Plan> }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <div key={plan.id} className="rounded-lg border border-line bg-night-tile p-5">
          <p className="font-medium text-white">{plan.title}</p>
          <p className="mt-2 text-sm text-white/75">
            {formatNumber(plan.price)} {plan.currency} · {plan.orders ?? 0} طلب
          </p>
        </div>
      ))}
    </div>
  );
}
