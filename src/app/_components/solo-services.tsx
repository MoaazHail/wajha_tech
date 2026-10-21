import Image from "next/image";

import { CtaLink } from "@/shared/components/cta-link";
import { SITE } from "@/shared/lib/constants/site.constant";
import { Shell } from "@/shared/layout/shell";
import { CheckCircleIcon, FileIcon, MonitorIcon } from "@/shared/ui/icons";

import { SOLO_SERVICES } from "../_lib/constants/landing.constant";

const ICONS = { monitor: MonitorIcon, file: FileIcon } as const;

/** Sits directly under the package, sharing its surface, so it has no top padding. */
export function SoloServices() {
  return (
    <section id="services" className="bg-surface px-gutter pb-band">
      <Shell>
        <div className="flex items-center gap-4 pt-[clamp(30px,3.4vw,50px)]">
          <span className="h-px flex-1 bg-line" />
          <span className="font-display text-[15px] font-semibold whitespace-nowrap text-muted">
            أو اطلب خدمة منفصلة
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="mt-[clamp(22px,2.6vw,34px)] grid grid-cols-2 gap-[clamp(16px,2vw,26px)] max-[1150px]:grid-cols-1">
          {SOLO_SERVICES.map((service) => {
            const Icon = ICONS[service.icon];

            return (
              <div
                key={service.title}
                className="relative overflow-hidden rounded-[14px] border border-line bg-white p-[clamp(20px,2.2vw,30px)] shadow-[0_14px_34px_rgba(13,86,242,.06)]"
              >
                <span
                  aria-hidden
                  className="absolute top-[clamp(20px,2.2vw,30px)] left-[clamp(20px,2.2vw,30px)] flex size-11 items-center justify-center rounded-[9px] bg-brand text-white"
                >
                  <Icon />
                </span>

                <div className="grid grid-cols-[1fr_.82fr] items-center gap-[clamp(14px,1.8vw,24px)] max-[760px]:grid-cols-1">
                  <div className="min-w-0 pe-[clamp(52px,4.4vw,62px)] max-[760px]:pt-14 max-[760px]:pe-0">
                    <h3 className="text-[clamp(18px,1.6vw,23px)] leading-[1.4] font-bold">
                      {service.title}
                    </h3>
                    <p className="mt-[11px] text-[14.5px] leading-[1.85] text-muted">{service.body}</p>

                    <ul className="mt-[clamp(16px,1.8vw,22px)] grid gap-3 border-y border-line py-[clamp(16px,1.8vw,22px)] text-[14.5px] text-ink-soft">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-center gap-2.5">
                          <CheckCircleIcon className="flex-none text-brand" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-[clamp(16px,1.8vw,22px)] flex flex-wrap items-center justify-between gap-3.5">
                      <p className="flex items-baseline gap-1.5 whitespace-nowrap">
                        <span className="font-display text-[clamp(24px,2.2vw,32px)] leading-none font-bold text-brand">
                          {service.price}
                        </span>
                        <span className="font-display text-[14.5px] font-semibold text-brand">
                          {service.currency}
                        </span>
                      </p>
                      <CtaLink
                        href={SITE.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        tone="blue"
                        size="md"
                        className="rounded-[7px]"
                      >
                        {service.cta}
                        <span aria-hidden className="text-[13px]">
                          ‹
                        </span>
                      </CtaLink>
                    </div>
                  </div>

                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    width={service.image.width}
                    height={service.image.height}
                    sizes="(max-width: 760px) 340px, (max-width: 1150px) 40vw, 20vw"
                    className="h-auto w-full object-contain max-[760px]:order-first max-[760px]:mx-auto max-[760px]:max-w-[340px]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Shell>
    </section>
  );
}
