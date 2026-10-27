/** Agency identity. The contact details are placeholders from the design file. */
export const SITE = {
  name: "واجهة",
  wordmark: "WAJHA",
  tagline: "نحو واجهة رقمية تفتح لك الأبواب.",
  description:
    "واجهة رقمية وبروفايل بهوية واحدة، يجعلان قرار التعامل معك محسوماً من أول نظرة. تصميم مواقع وبروفايلات شركات باحترافية عالية.",
  locale: "ar_SA",
  lang: "ar",
  dir: "rtl",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+966501234567",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "hello@wajha.sa",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/+966501234567",
  address: "الرياض، المملكة العربية السعودية",
  foundedYear: 2025,
} as const;

/** `tel:` needs the digits only. */
export const PHONE_HREF = `tel:${SITE.phone.replace(/[^0-9+]/g, "")}`;
export const EMAIL_HREF = `mailto:${SITE.email}`;
