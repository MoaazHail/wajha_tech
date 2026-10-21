import Image from "next/image";

import { CtaArrow, CtaLink } from "@/shared/components/cta-link";
import { SITE } from "@/shared/lib/constants/site.constant";
import { Shell } from "@/shared/layout/shell";

import { HeroProofBand } from "./hero-proof-band";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[min(92vh,900px)] flex-col overflow-hidden bg-brand px-gutter pt-(--header-h) text-white max-[900px]:min-h-auto"
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
              موقع + ملف تعريفي لشركتك
            </p>

            <h1 className="mt-5 text-[clamp(34px,4.4vw,62px)] font-bold leading-[1.45] tracking-[-0.02em] text-balance">
              عميلك يحكم عليك
              <br />
              قبل أن يكلّمك.
            </h1>

            <p className="mt-6 text-[clamp(12px,1.02vw,15px)] leading-[1.7] whitespace-nowrap text-white/85 max-[760px]:text-base max-[760px]:leading-[1.85] max-[760px]:whitespace-normal">
              واجهة رقمية وبروفايل بهوية واحدة، يجعلان قرار التعامل معك محسوماً من أول نظرة.
            </p>

            <div className="mt-9 flex flex-wrap gap-3.5">
              <CtaLink
                href={SITE.whatsapp}
                target="_blank"
                rel="noreferrer"
                tone="white"
                size="xl"
                shape="cut"
              >
                اطلب موقعك الآن
                <CtaArrow className="text-sm" />
              </CtaLink>
              <CtaLink href="#work" tone="outline" size="xl" shape="square" className="font-medium">
                شاهد نماذج الأعمال
              </CtaLink>
            </div>

            <HeroProofBand />
          </div>
        </Shell>
      </div>
    </section>
  );
}
