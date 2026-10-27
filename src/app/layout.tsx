import type { Metadata, Viewport } from "next";

import { fontVariables } from "@/shared/lib/constants/fonts.constant";
import { SITE } from "@/shared/lib/constants/site.constant";
import { PublicChrome } from "@/shared/layout/public-chrome";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — تصميم مواقع وبروفايلات شركات`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    url: SITE.url,
    title: `${SITE.name} — تصميم مواقع وبروفايلات شركات`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d56f2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.lang} dir={SITE.dir} className={fontVariables}>
      <body className="overflow-x-hidden bg-white antialiased">
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
