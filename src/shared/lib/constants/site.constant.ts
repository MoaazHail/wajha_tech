/**
 * The public origin. NEXT_PUBLIC_SITE_URL wins; on Vercel the production domain is the next best thing,
 * so link previews never point at localhost when the variable was forgotten.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

/**
 * Brand and document constants. Contact details, tagline and description are
 * edited in the dashboard and come from the API (`Settings`); `description` here is
 * only the fallback for when the API is down, so link previews are never empty.
 */
export const SITE = {
  name: "واجهة",
  wordmark: "WAJHA",
  locale: "ar_SA",
  lang: "ar",
  dir: "rtl",
  url: siteUrl,
  description:
    "واجهة رقمية وبروفايل بهوية واحدة، يجعلان قرار التعامل معك محسوماً من أول نظرة. تصميم مواقع وبروفايلات شركات باحترافية عالية.",
} as const;
