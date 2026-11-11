"use client";

import { usePathname } from "next/navigation";

import type { Settings } from "@/shared/lib/types/api";
import { BackToTop } from "@/shared/layout/back-to-top";
import { SiteFooter } from "@/shared/layout/site-footer";
import { SiteHeader } from "@/shared/layout/site-header";
import { SplashScreen } from "@/shared/layout/splash-screen";

/** Routes that bring their own layout, or none: the dashboard and its sign-in page. */
const BARE_ROUTES = ["/dashboard", "/login"];

/** The marketing site's header, footer and extras. */
export function PublicChrome({
  settings,
  isAdmin = false,
  children,
}: {
  settings: Settings | null;
  /** Shows the admin strip and the dashboard button. */
  isAdmin?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (BARE_ROUTES.some((route) => pathname.startsWith(route))) return children;

  return (
    <>
      <SplashScreen />
      {isAdmin && (
        <div
          role="status"
          className="fixed inset-x-0 top-0 z-[60] flex h-10 items-center justify-center bg-amber-400 px-gutter text-sm font-bold text-ink"
        >
          انت في منظور الادمن
        </div>
      )}
      <SiteHeader whatsapp={settings?.whatsapp} isAdmin={isAdmin} />
      {children}
      <SiteFooter settings={settings} />
      <BackToTop />
    </>
  );
}
