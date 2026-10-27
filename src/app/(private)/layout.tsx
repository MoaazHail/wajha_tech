import { DashboardSidebar } from "@/shared/layout/private/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-night/95 lg:flex">
      <DashboardSidebar />
      <main className="min-w-0 flex-1 p-gutter">{children}</main>
    </div>
  );
}
