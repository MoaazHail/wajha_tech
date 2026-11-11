import type { LandingSection, SectionType } from "@/shared/lib/types/api";

/** The visible section of a given type, or undefined when the dashboard hid or never created it. */
export const findSection = (sections: ReadonlyArray<LandingSection>, type: SectionType) =>
  sections.find((section) => section.type === type);

/** Only http(s) and in-page anchors reach an `href`; anything else from the CMS is dropped. */
export const safeHref = (href?: string) => (href && /^(https?:\/\/|#|\/(?!\/)|mailto:|tel:)/i.test(href) ? href : undefined);
