import Link from "next/link";

import { PlansSummary } from "./_components/plans-summary";
import { RecentProjects } from "./_components/recent-projects";
import { STATS } from "./_lib/constants/dashboard-data.constant";
import Header from "./_components/header";

export default function DashboardPage() {
  return (
    <div className="grid gap-8">
      <Header title="لوحة التحكم" />

      <section aria-label="الإحصائيات" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.id} className="rounded-lg border border-ink bg-accent/75 p-5">
            <p className="text-sm font-bold text-ink">{stat.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-white/75">{stat.note}</p>
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
        <RecentProjects limit={4} />
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <Header h2 title="الخطط" />
          <h2 className="text-lg text-ink"></h2>
          <Link href="/dashboard/plans" className="text-sm text-blue-300 hover:underline">
            عرض الكل
          </Link>
        </div>
        <PlansSummary />
      </section>
    </div>
  );
}
