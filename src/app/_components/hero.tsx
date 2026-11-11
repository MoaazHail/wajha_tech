import Image from "next/image";

import { CtaArrow, CtaLink } from "@/shared/components/cta-link";
import type { LandingSection } from "@/shared/lib/types/api";
import { Shell } from "@/shared/layout/shell";

import { BookingButton } from "./booking-button";
import { HeroProofBand } from "./hero-proof-band";

interface HeroProps {
  section: LandingSection;
  /** The proof band under the buttons; omitted when the dashboard hides it. */
  proof?: LandingSection;
}

export function Hero({ section, proof }: HeroProps) {
  const content = section.contents[0];

  return (
    <section
      id="top"
      className="relative flex min-h-[min(92vh,900px)] flex-col overflow-hidden bg-brand px-gutter pt-[calc(var(--header-h)+var(--admin-bar))] text-white max-[900px]:min-h-auto"
    >
      {/* Decorative art, masked out towards the copy. Hidden below 900px. */}
      <Image
        src="/assets/images/hero-door.png"
        alt=""
        aria-hidden
        priority
        width={1536}
        height={1024}
        sizes="64vw"
        className="pointer-events-none absolute inset-y-0 left-0 h-full w-[64%] object-cover object-left brightness-[1.07] saturate-[.97] [mask-image:linear-gradient(to_right,#000_0,#000_72%,transparent_100%)] max-[900px]:hidden"
      />

      <div className="relative z-2 flex flex-1 items-center py-[clamp(48px,7vw,96px)]">
        <Shell>
          <div className="max-w-[min(600px,100%)] animate-rise">
            <p className="font-display text-sm font-medium tracking-[.06em] text-white/80">
              {content?.badge}
            </p>

            <h1 className="mt-5 text-[clamp(34px,4.4vw,62px)] font-bold leading-[1.45] tracking-[-0.02em] whitespace-pre-line text-balance">
              {content?.title}
            </h1>

            <p className="mt-6 text-[clamp(12px,1.02vw,15px)] leading-[1.7] whitespace-nowrap text-white/85 max-[760px]:text-base max-[760px]:leading-[1.85] max-[760px]:whitespace-normal">
              {content?.body}
            </p>

            <div className="mt-9 flex flex-wrap gap-3.5">
              <BookingButton tone="white" size="xl" shape="cut">
                {content?.cta?.label ?? "اطلب موقعك الآن"}
                <CtaArrow className="text-sm" />
              </BookingButton>
              <CtaLink href="#work" tone="outline" size="xl" shape="square" className="font-medium">
                شاهد نماذج الأعمال
              </CtaLink>
            </div>

            {proof && <HeroProofBand section={proof} />}
          </div>
        </Shell>
      </div>
    </section>
  );
}
