"use client";

import { useLocalCollection } from "@/shared/hooks/use-local-collection";

import { PLANS, type Plan } from "../constants/dashboard-data.constant";

export function usePlans() {
  const { items, ...actions } = useLocalCollection<Plan>("wajha:dashboard:plans", PLANS, "plan");
  return { plans: items, ...actions };
}
