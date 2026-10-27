/** Sample data for the dashboard until a backend exists. */

export const STATS = [
  { id: "projects", label: "إجمالي المشاريع", value: "24", note: "+3 هذا الشهر" },
  { id: "active", label: "مشاريع قيد التنفيذ", value: "7", note: "2 تنتهي هذا الأسبوع" },
  { id: "clients", label: "العملاء", value: "18", note: "+2 هذا الشهر" },
  { id: "revenue", label: "الإيرادات (ريال)", value: "31,400", note: "+12% عن الشهر الماضي" },
] as const;

export type ProjectStatus = "done" | "active" | "review";

export const PROJECT_STATUS: Record<
  ProjectStatus,
  { label: string; className: string; darkClassName: string }
> = {
  done: { label: "مكتمل", className: "bg-emerald-50 text-emerald-700", darkClassName: "bg-emerald-400/15 text-emerald-300" },
  active: { label: "قيد التنفيذ", className: "bg-brand/10 text-brand", darkClassName: "bg-brand/25 text-blue-200" },
  review: { label: "قيد المراجعة", className: "bg-accent/10 text-accent", darkClassName: "bg-accent/20 text-orange-300" },
};

export interface Project {
  id: string;
  name: string;
  client: string;
  plan: string;
  status: ProjectStatus;
  date: string;
}

export const PROJECT_PLANS = ["موقع + بروفايل", "موقع", "بروفايل"] as const;

export const PROJECTS: ReadonlyArray<Project> = [
  { id: "p-1", name: "موقع عيادة الأمل", client: "عيادة الأمل", plan: "موقع + بروفايل", status: "active", date: "2026-10-18" },
  { id: "p-2", name: "بروفايل شركة نخبة", client: "شركة نخبة للاستشارات", plan: "بروفايل", status: "review", date: "2026-10-12" },
  { id: "p-3", name: "موقع مقاولات الرياض", client: "مقاولات الرياض", plan: "موقع", status: "done", date: "2026-09-30" },
  { id: "p-4", name: "موقع أسئلة", client: "منصة أسئلة", plan: "موقع", status: "done", date: "2026-09-14" },
  { id: "p-5", name: "بروفايل مكتب الريادة", client: "مكتب الريادة", plan: "بروفايل", status: "done", date: "2026-08-27" },
  { id: "p-6", name: "موقع وبروفايل مطعم السلطان", client: "مطعم السلطان", plan: "موقع + بروفايل", status: "active", date: "2026-08-05" },
];

export interface Plan {
  id: string;
  name: string;
  price: string;
  currency: string;
  orders: number;
  features: ReadonlyArray<string>;
}

export const PLANS: ReadonlyArray<Plan> = [
  {
    id: "plan-package",
    name: "موقع احترافي + بروفايل شركة",
    price: "1,200",
    currency: "ريال",
    orders: 11,
    features: ["موقع متجاوب", "بروفايل PDF", "تهيئة SEO", "دعم فني"],
  },
  {
    id: "plan-website",
    name: "إنشاء موقع إلكتروني",
    price: "1,500",
    currency: "ريال",
    orders: 9,
    features: ["تصميم متجاوب", "تهيئة SEO", "دعم فني بعد التسليم"],
  },
  {
    id: "plan-profile",
    name: "إنشاء بروفايل شركة",
    price: "500",
    currency: "ريال",
    orders: 4,
    features: ["تصميم حديث", "نسخة PDF للطباعة", "مراجعتان مجاناً"],
  },
];
