import Link from "next/link";

import { formatNumber } from "@/shared/lib/utils/format.util";

import Header from "./_components/header";
import { PlansSummary } from "./_components/plans-summary";
import { RecentProjects } from "./_components/recent-projects";
import { getStats, listPlans, listProjects } from "./_lib/apis/dashboard.api";

export default async function DashboardPage() {
  const [stats, projects, plans] = await Promise.all([getStats(), listProjects(4), listPlans()]);

  const cards = [
    {
      id: "projects",
      label: "إجمالي المشاريع",
      value: formatNumber(stats.projects),
      note: `+${stats.projectsThisMonth} هذا الشهر`,
    },
    { id: "active", label: "مشاريع قيد التنفيذ", value: formatNumber(stats.active) },
    {
      id: "clients",
      label: "العملاء",
      value: formatNumber(stats.clients),
      note: `+${stats.clientsThisMonth} هذا الشهر`,
    },
    { id: "revenue", label: "الإيرادات (ريال)", value: formatNumber(stats.revenue) },
  ];

  return (
    <div className="grid gap-8">
      <Header title="لوحة التحكم" />

      <section aria-label="الإحصائيات" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.id} className="rounded-lg border border-ink bg-accent/75 p-5">
            <p className="text-sm font-bold text-ink">{card.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-white">{card.value}</p>
            {card.note && <p className="mt-1 text-xs text-white/75">{card.note}</p>}
          </div>
        ))}
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <Header h2 title="أحدث المشاريع" />
          <h2 className="text-lg text-ink"> </h2>
          <Link href="/dashboard/projects" className="text-sm text-blue-300 hover:underline">
            عرض الكل
          </Link>
        </div>
        <RecentProjects projects={projects} />
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <Header h2 title="الخطط" />
          <h2 className="text-lg text-ink"></h2>
          <Link href="/dashboard/plans" className="text-sm text-blue-300 hover:underline">
            عرض الكل
          </Link>
        </div>
        <PlansSummary plans={plans} />
      </section>
    </div>
  );
}
