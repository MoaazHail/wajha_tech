"use server";

import { createPlan, deletePlan, updatePlan } from "../apis/dashboard.api";
import { planScheme, type PlanInput } from "../schemes/plan.scheme";
import { runMutation } from "../services/mutation.service";
import type { ActionResult } from "../types/action";

export async function createPlanAction(input: PlanInput): Promise<ActionResult> {
  const parsed = planScheme.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };

  return runMutation(() => createPlan(parsed.data));
}

export async function updatePlanAction(id: string, input: PlanInput): Promise<ActionResult> {
  const parsed = planScheme.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };

  return runMutation(() => updatePlan(id, parsed.data));
}

export async function deletePlanAction(id: string): Promise<ActionResult> {
  return runMutation(() => deletePlan(id));
}
