import { CtaArrow, CtaLink } from "@/shared/components/cta-link";
import type { LandingSection } from "@/shared/lib/types/api";
import { Shell } from "@/shared/layout/shell";

import { safeHref } from "../_lib/utils/landing.util";

/** Closing band; shares the dark backdrop with the work rail and the footer. */
export function CtaBand({ section }: { section: LandingSection }) {
  const content = section.contents[0];
  const ctaHref = safeHref(content?.cta?.href);

  return (
    <section id="faq" className="bg-night px-gutter pb-[clamp(40px,4.5vw,68px)] text-white">
      <Shell>
        <div className="flex items-center justify-between gap-6 rounded-[14px] bg-brand px-[clamp(24px,3vw,46px)] py-[clamp(24px,2.8vw,42px)] max-[900px]:flex-col max-[900px]:items-start">
          <div>
            <h2 className="text-[clamp(20px,2.1vw,28px)] font-bold">
              {content?.title}
            </h2>
            <p className="mt-2.5 text-[15.5px] text-white/85">
              {content?.body}
            </p>
          </div>

          {ctaHref && (
            <CtaLink
              href={ctaHref}
              target="_blank"
              rel="noreferrer"
              tone="white"
              size="lg"
              className="flex-none"
            >
              {content?.cta?.label}
              <CtaArrow />
            </CtaLink>
          )}
        </div>
      </Shell>
    </section>
  );
}
