import type { ProjectStatus } from "@/shared/lib/types/api";

/** Label and badge colours per project status, for the light and dark tables. */
export const PROJECT_STATUS: Record<
  ProjectStatus,
  { label: string; className: string; darkClassName: string }
> = {
  done: { label: "مكتمل", className: "bg-emerald-50 text-emerald-700", darkClassName: "bg-emerald-400/15 text-emerald-300" },
  active: { label: "قيد التنفيذ", className: "bg-brand/10 text-brand", darkClassName: "bg-brand/25 text-blue-200" },
  review: { label: "قيد المراجعة", className: "bg-accent/10 text-accent", darkClassName: "bg-accent/20 text-orange-300" },
};
