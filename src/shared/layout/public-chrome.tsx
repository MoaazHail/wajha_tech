"use client";

import { usePathname } from "next/navigation";

import { BackToTop } from "@/shared/layout/back-to-top";
import { SiteFooter } from "@/shared/layout/site-footer";
import { SiteHeader } from "@/shared/layout/site-header";
import { SplashScreen } from "@/shared/layout/splash-screen";

/** The marketing site's header, footer and extras. The dashboard brings its own layout. */
export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return children;

  return (
    <>
      <SplashScreen />
      <SiteHeader />
      {children}
      <SiteFooter />
      <BackToTop />
    </>
  );
}
