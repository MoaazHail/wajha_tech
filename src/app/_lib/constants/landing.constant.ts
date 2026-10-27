/**
 * All landing-page copy, lifted from the design file. Icons are referenced by
 * key and mapped to components in the section that renders them, so this file
 * stays free of JSX.
 */

export const FEATURES = [
  { icon: "layout", title: "تصميم احترافي", body: "يعكس هوية شركتك" },
  { icon: "bolt", title: "سرعة وأداء عالي", body: "مواقع سريعة ومتجاوبة" },
  { icon: "chart", title: "جاهز لمحركات البحث SEO", body: "لظهور أفضل في النتائج" },
  { icon: "headset", title: "دعم فني مستمر", body: "نرافقك بعد الإطلاق" },
] as const;

export const PACKAGE = {
  badge: "عرض خاص",
  title: "موقع احترافي + بروفايل شركة متكامل",
  body: "كل ما تحتاجه شركتك لتظهر بصورة احترافية أمام عملائك في مكان واحد. نصمم لك موقعاً يعكس قوة علامتك التجارية، وبروفايل شركة منظّماً يعرّف بخدماتك وأعمالك ويعزّز ثقة العملاء بك.",
  includesLabel: "الباقة تشمل",
  includes: [
    "تصميم وتطوير موقع احترافي متجاوب مع جميع الأجهزة",
    "بروفايل شركة احترافي جاهز للعرض والطباعة PDF",
    "تصميم متناسق يعكس هوية شركتك",
    "تحسين الموقع لمحركات البحث SEO",
    "سرعة وأداء وتجربة استخدام مميزة",
    "دعم فني بعد التسليم",
  ],
  priceBefore: "2,000",
  price: "1,200",
  currency: "ريال",
  cta: "اطلب الباقة الآن",
  image: {
    src: "/assets/images/package-mockup.png",
    alt: "موقع احترافي وبروفايل شركة من واجهة",
    width: 1672,
    height: 941,
  },
} as const;

export const SOLO_SERVICES = [
  {
    icon: "monitor",
    title: "إنشاء موقع إلكتروني",
    body: "موقع احترافي متجاوب يعكس هوية شركتك ويجهّزك للظهور في محركات البحث.",
    items: ["تصميم متجاوب مع جميع الأجهزة", "تهيئة لمحركات البحث SEO", "دعم فني بعد التسليم"],
    price: "1,500",
    currency: "ريال",
    cta: "اطلب خدمة الموقع",
    image: {
      src: "/assets/images/website-mockup.png",
      alt: "موقع إلكتروني احترافي من واجهة",
      width: 1448,
      height: 1086,
    },
  },
  {
    icon: "file",
    title: "إنشاء بروفايل شركة",
    body: "ملف تعريفي منظّم يعرّف بخدماتك وأعمالك، جاهز للعرض والطباعة.",
    items: ["تصميم حديث يعكس الهوية", "نسخة PDF جاهزة للطباعة", "مراجعتان مجاناً"],
    price: "500",
    currency: "ريال",
    cta: "اطلب خدمة البروفايل",
    image: {
      src: "/assets/images/profile-mockup.png",
      alt: "بروفايل شركة مطبوع من واجهة",
      width: 1448,
      height: 1086,
    },
  },
] as const;

export const PROCESS_STEPS = [
  { num: "01", icon: "brief", title: "نستمع لاحتياجاتك", body: "نفهم أهدافك ومتطلبات مشروعك بالتفصيل." },
  { num: "02", icon: "design", title: "نخطط ونصمم", body: "نضع خطة ونصمم واجهات عصرية وتجربة مميزة." },
  { num: "03", icon: "test", title: "نطوّر ونختبر", body: "نقوم بالتطوير والاختبار لضمان أعلى جودة." },
  { num: "04", icon: "award", title: "نسلّم وندعم", body: "نسلّم المشروع مع دعم فني لضمان نجاحك." },
] as const;

/** The rail tiles. The design ships them as empty slots with a caption only. */
export const WORKS = [
  { id: "work-1", caption: "موقع اسئله", href: "/assets/images/exam-app.png", site: '' },
  { id: "work-2", caption: "موقع عيادة طبية", href: "/assets/images/exam-app.png", site: ''  },
  { id: "work-3", caption: "موقع شركة استشارات", href: "/assets/images/exam-app.png", site: '' },
  { id: "work-4", caption: "موقع شركة مقاولات", href: "/assets/images/exam-app.png", site: '' },
  { id: "work-5", caption: "موقع شركة استشارات", href: "/assets/images/exam-app.png", site: '' },
  { id: "work-6", caption: "موقع شركة مقاولات", href: "/assets/images/exam-app.png", site: '' },
] as const;

/** Faces in the hero's proof band. */
export const HERO_AVATARS = [
  "/assets/images/avatar-1.png",
  "/assets/images/avatar-2.png",
  "/assets/images/avatar-3.png",
] as const;
