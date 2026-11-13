import type { Metadata, Viewport } from "next";

import { getLanding } from "@/shared/lib/apis/landing.api";
import { fontVariables } from "@/shared/lib/constants/fonts.constant";
import { SITE } from "@/shared/lib/constants/site.constant";
import type { Settings } from "@/shared/lib/types/api";
import { getAdmin } from "@/shared/lib/services/session.service";
import { PublicChrome } from "@/shared/layout/public-chrome";

import "./globals.css";

/**
 * Header, footer and metadata need the site settings, but a down API must not
 * take the whole site with it: without settings they simply omit the contact details.
 */
async function loadSettings(): Promise<Settings | null> {
  try {
    return (await getLanding()).settings;
  } catch {
    return null;
  }
}

/** Signed-in admins see an extra strip and a dashboard button; a down API just means "not an admin". */
async function loadIsAdmin(): Promise<boolean> {
  try {
    return (await getAdmin()) !== null;
  } catch {
    return false;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await loadSettings();
  const title = `${SITE.name} — تصميم مواقع وبروفايلات شركات`;
  // The dashboard text wins; the built-in one keeps the link preview (WhatsApp, X, Telegram) from being empty.
  const description = settings?.description || SITE.description;

  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: `%s | ${SITE.name}` },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      url: "/",
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const viewport: Viewport = {
  themeColor: "#0d56f2",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, isAdmin] = await Promise.all([loadSettings(), loadIsAdmin()]);

  return (
    <html
      lang={SITE.lang}
      dir={SITE.dir}
      className={fontVariables}
      style={isAdmin ? ({ "--admin-bar": "40px" } as React.CSSProperties) : undefined}
    >
      <body className="overflow-x-hidden bg-white antialiased">
        <PublicChrome settings={settings} isAdmin={isAdmin}>{children}</PublicChrome>
      </body>
    </html>
  );
}
