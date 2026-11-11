import { redirect } from "next/navigation";

import { getAdmin } from "@/shared/lib/services/session.service";
import { DashboardSidebar } from "@/shared/layout/private/sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/login");

  return (
    <div className="min-h-dvh bg-night/95 lg:flex">
      <DashboardSidebar adminName={admin.name} />
      <main className="min-w-0 flex-1 p-gutter">{children}</main>
    </div>
  );
}
