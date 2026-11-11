import type { Content, LandingSection, SectionType } from "@/shared/lib/types/api";

/**
 * The landing page's copy. It lives here, not in the database: edit this file to
 * change the text. Only the WhatsApp link comes from the dashboard settings.
 */

type Item = Partial<Omit<Content, "id" | "section" | "order" | "isActive">>;

const section = (
  key: string,
  type: SectionType,
  order: number,
  items: Item[],
  meta: { title?: string; subtitle?: string } = {},
): LandingSection => ({
  id: key,
  key,
  name: key,
  type,
  title: meta.title ?? "",
  subtitle: meta.subtitle ?? "",
  order,
  isVisible: true,
  contents: items.map((item, index) => ({
    id: `${key}-${index}`,
    section: key,
    title: "",
    body: "",
    items: [],
    order: index,
    isActive: true,
    ...item,
  })),
});

const PACKAGE_IMAGE = {
  src: "/assets/images/package-mockup.png",
  alt: "موقع احترافي وبروفايل شركة من واجهة",
  width: 1672,
  height: 941,
};
const WEBSITE_IMAGE = {
  src: "/assets/images/website-mockup.png",
  alt: "موقع إلكتروني احترافي من واجهة",
  width: 1448,
  height: 1086,
};
const PROFILE_IMAGE = {
  src: "/assets/images/profile-mockup.png",
  alt: "بروفايل شركة مطبوع من واجهة",
  width: 1448,
  height: 1086,
};

const PACKAGE_BENEFITS = [
  "تصميم وتطوير موقع احترافي متجاوب مع جميع الأجهزة",
  "بروفايل شركة احترافي جاهز للعرض والطباعة PDF",
  "تصميم متناسق يعكس هوية شركتك",
  "تحسين الموقع لمحركات البحث SEO",
  "سرعة وأداء وتجربة استخدام مميزة",
  "دعم فني بعد التسليم",
];

export const buildLandingSections = (whatsapp: string): LandingSection[] => [
  section("hero", "hero", 0, [
    {
      badge: "موقع + ملف تعريفي لشركتك",
      title: "عميلك يحكم عليك\nقبل أن يكلّمك.",
      body: "واجهة رقمية وبروفايل بهوية واحدة، يجعلان قرار التعامل معك محسوماً من أول نظرة.",
      cta: { label: "اطلب موقعك الآن", href: whatsapp },
    },
  ]),
  section("proof", "proof", 1, [
    {
      title: "تم تنفيذ أكثر من 50 مَوقعًا\nوبروفايل شركة باحترافية عالية",
      body: "حلول رقمية تزيد ثقة عميلك ومبيعاتك",
    },
    ...[1, 2, 3].map((n) => ({ title: `avatar-${n}`, image: { src: `/assets/images/avatar-${n}.png`, alt: "" } })),
  ]),
  section(
    "why",
    "features",
    2,
    [
      { icon: "layout", title: "تصميم احترافي", body: "يعكس هوية شركتك" },
      { icon: "bolt", title: "سرعة وأداء عالي", body: "مواقع سريعة ومتجاوبة" },
      { icon: "chart", title: "جاهز لمحركات البحث SEO", body: "لظهور أفضل في النتائج" },
      { icon: "headset", title: "دعم فني مستمر", body: "نرافقك بعد الإطلاق" },
    ],
    { title: "نساعد الشركات على النمو رقمياً" },
  ),
  section(
    "package",
    "package",
    3,
    [
      {
        badge: "عرض خاص",
        title: "موقع احترافي + بروفايل شركة متكامل",
        body: "كل ما تحتاجه شركتك لتظهر بصورة احترافية أمام عملائك في مكان واحد. نصمم لك موقعاً يعكس قوة علامتك التجارية، وبروفايل شركة منظّماً يعرّف بخدماتك وأعمالك ويعزّز ثقة العملاء بك.",
        items: PACKAGE_BENEFITS,
        price: 1200,
        priceBefore: 2000,
        currency: "ريال",
        cta: { label: "اطلب الباقة الآن", href: whatsapp },
        image: PACKAGE_IMAGE,
      },
    ],
    { title: "باقة الشركات والأعمال" },
  ),
  section(
    "services",
    "services",
    4,
    [
      {
        icon: "monitor",
        title: "إنشاء موقع إلكتروني",
        body: "موقع احترافي متجاوب يعكس هوية شركتك ويجهّزك للظهور في محركات البحث.",
        items: ["تصميم متجاوب مع جميع الأجهزة", "تهيئة لمحركات البحث SEO", "دعم فني بعد التسليم"],
        price: 1500,
        currency: "ريال",
        cta: { label: "اطلب خدمة الموقع", href: whatsapp },
        image: WEBSITE_IMAGE,
      },
      {
        icon: "file",
        title: "إنشاء بروفايل شركة",
        body: "ملف تعريفي منظّم يعرّف بخدماتك وأعمالك، جاهز للعرض والطباعة.",
        items: ["تصميم حديث يعكس الهوية", "نسخة PDF جاهزة للطباعة", "مراجعتان مجاناً"],
        price: 500,
        currency: "ريال",
        cta: { label: "اطلب خدمة البروفايل", href: whatsapp },
        image: PROFILE_IMAGE,
      },
    ],
    { title: "أو اطلب خدمة منفصلة" },
  ),
  section(
    "process",
    "process",
    5,
    [
      { num: "01", icon: "brief", title: "نستمع لاحتياجاتك", body: "نفهم أهدافك ومتطلبات مشروعك بالتفصيل." },
      { num: "02", icon: "design", title: "نخطط ونصمم", body: "نضع خطة ونصمم واجهات عصرية وتجربة مميزة." },
      { num: "03", icon: "test", title: "نطوّر ونختبر", body: "نقوم بالتطوير والاختبار لضمان أعلى جودة." },
      { num: "04", icon: "award", title: "نسلّم وندعم", body: "نسلّم المشروع مع دعم فني لضمان نجاحك." },
    ],
    { title: "كيف نعمل؟", subtitle: "عملية واضحة وشفافة من البداية للنهاية" },
  ),
  section("work", "portfolio", 6, [], {
    title: "نماذج من أعمالنا",
    subtitle: "نفخر بثقة عملائنا ونجاح مشاريعهم.",
  }),
  section("cta", "cta", 7, [
    {
      title: "جاهز للانطلاق بواجهة رقمية تميّزك؟",
      body: "دعنا نساعدك في بناء حضور قوي على الإنترنت.",
      cta: { label: "تواصل معنا الآن", href: whatsapp },
    },
  ]),
];
