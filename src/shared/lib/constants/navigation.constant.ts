/** Single-page anchors, shared by the header and the footer. */
export const MAIN_NAV = [
  { label: "الرئيسية", href: "#top" },
  { label: "مميزات الخدمة", href: "#why" },
  { label: "نماذج أعمالنا", href: "#work" },
  { label: "الباقات والأسعار", href: "#pricing" },
  { label: "الأسئلة الشائعة", href: "#faq" },
] as const;

export const FOOTER_SERVICE_LINKS = [
  { label: "تصميم مواقع", href: "#pricing" },
  { label: "تصميم بروفايل", href: "#pricing" },
  { label: "تطوير الهوية الرقمية", href: "#pricing" },
  { label: "دعم فني", href: "#why" },
] as const;
