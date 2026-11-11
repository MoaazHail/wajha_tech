/** Dashboard sidebar links. Add an entry here when a new dashboard page ships. */
export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "نظرة عامة", icon: "overview" },
  { href: "/dashboard/users", label: " العملاء", icon: "overview" },
  { href: "/dashboard/projects", label: "مشاريع", icon: "overview" },
  { href: "/dashboard/plans", label: " الخطط", icon: "overview" },
  { href: "/dashboard/booking", label: "الحجوزات", icon: "overview" },
  { href: "/dashboard/contents", label: " المحتوى", icon: "overview" },
  { href: "/dashboard/settings", label: "الإعدادات", icon: "overview" },



] as const;

export type DashboardNavIcon = (typeof DASHBOARD_NAV)[number]["icon"];
