/**
 * Brand and document constants. Contact details, tagline and description are
 * edited in the dashboard and come from the API (`Settings`).
 */
export const SITE = {
  name: "واجهة",
  wordmark: "WAJHA",
  locale: "ar_SA",
  lang: "ar",
  dir: "rtl",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
