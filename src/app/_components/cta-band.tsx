import { CtaArrow, CtaLink } from "@/shared/components/cta-link";
import { SITE } from "@/shared/lib/constants/site.constant";
import { Shell } from "@/shared/layout/shell";

/** Closing band; shares the dark backdrop with the work rail and the footer. */
export function CtaBand() {
  return (
    <section id="faq" className="bg-night px-gutter pb-[clamp(40px,4.5vw,68px)] text-white">
      <Shell>
        <div className="flex items-center justify-between gap-6 rounded-[14px] bg-brand px-[clamp(24px,3vw,46px)] py-[clamp(24px,2.8vw,42px)] max-[900px]:flex-col max-[900px]:items-start">
          <div>
            <h2 className="text-[clamp(20px,2.1vw,28px)] font-bold">
              جاهز للانطلاق بواجهة رقمية تميّزك؟
            </h2>
            <p className="mt-2.5 text-[15.5px] text-white/85">
              دعنا نساعدك في بناء حضور قوي على الإنترنت.
            </p>
          </div>

          <CtaLink
            href={SITE.whatsapp}
            target="_blank"
            rel="noreferrer"
            tone="white"
            size="lg"
            className="flex-none"
          >
            تواصل معنا الآن
            <CtaArrow />
          </CtaLink>
        </div>
      </Shell>
    </section>
  );
}
