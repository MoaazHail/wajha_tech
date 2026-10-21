import Image from "next/image";

import { CtaArrow, CtaLink } from "@/shared/components/cta-link";
import { SITE } from "@/shared/lib/constants/site.constant";
import { Band } from "@/shared/layout/shell";
import { CheckIcon } from "@/shared/ui/icons";

import { PACKAGE } from "../_lib/constants/landing.constant";

export function Pricing() {
  return (
    <Band id="pricing" className="bg-surface">
      <div className="text-center">
        <p className="font-mono text-[12.5px] font-medium tracking-[.22em] text-brand">إنشاء موقعك</p>
        <h2 className="mt-2.5 text-[clamp(24px,2.7vw,36px)] font-bold">باقة الشركات والأعمال</h2>
      </div>

      <div className="mt-[clamp(26px,3.2vw,44px)] grid grid-cols-[1.06fr_.94fr] overflow-hidden rounded-[14px] border border-line bg-white max-[900px]:grid-cols-1">
        <div className="p-[clamp(26px,3vw,46px)]">
          <div className="flex items-center gap-3">
            <span className="rounded bg-accent px-3.5 py-1.5 font-display text-[12.5px] font-semibold text-white">
              {PACKAGE.badge}
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <h3 className="mt-[18px] text-[clamp(19px,1.8vw,25px)] leading-[1.45] font-bold">
            {PACKAGE.title}
          </h3>
          <p className="mt-3 max-w-[52ch] text-[15.5px] leading-[1.95] text-muted">{PACKAGE.body}</p>

          <p className="mt-[clamp(20px,2.2vw,28px)] font-mono text-xs font-medium tracking-[.2em] text-faint">
            {PACKAGE.includesLabel}
          </p>
          <ul className="mt-3.5 grid grid-cols-2 gap-x-[clamp(16px,2vw,30px)] gap-y-3 text-[14.5px] leading-[1.7] text-ink-soft max-[900px]:grid-cols-1">
            {PACKAGE.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckIcon className="mt-1.5 flex-none text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-[clamp(24px,2.6vw,34px)] flex flex-wrap items-center justify-between gap-5 border-t border-line pt-[clamp(20px,2.2vw,26px)]">
            <div>
              <p className="text-[13.5px] whitespace-nowrap text-faint line-through decoration-[1.5px]">
                {PACKAGE.priceBefore} {PACKAGE.currency}
              </p>
              <p className="mt-1 flex items-baseline gap-2 whitespace-nowrap">
                <span className="font-display text-[clamp(30px,3.1vw,44px)] leading-none font-bold text-brand">
                  {PACKAGE.price}
                </span>
                <span className="font-display text-[clamp(15px,1.3vw,18px)] font-semibold text-brand">
                  {PACKAGE.currency}
                </span>
                <span className="text-sm text-faint">فقط</span>
              </p>
            </div>

            <CtaLink href={SITE.whatsapp} target="_blank" rel="noreferrer" tone="blue" size="lg">
              {PACKAGE.cta}
              <CtaArrow />
            </CtaLink>
          </div>
        </div>

        <div className="relative flex items-center justify-center overflow-hidden bg-brand px-[clamp(18px,2.4vw,34px)] py-[clamp(26px,3vw,44px)] max-[900px]:order-first">
          {/* Folded orange corner. */}
          <span
            aria-hidden
            className="absolute top-0 right-0 size-0 border-t-[64px] border-l-[64px] border-t-accent border-l-transparent"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_46%,rgba(255,255,255,.16),rgba(255,255,255,0)_70%)]"
          />
          <Image
            src={PACKAGE.image.src}
            alt={PACKAGE.image.alt}
            width={PACKAGE.image.width}
            height={PACKAGE.image.height}
            sizes="(max-width: 900px) 100vw, 46vw"
            className="relative h-auto w-full max-w-[520px]"
          />
        </div>
      </div>
    </Band>
  );
}
