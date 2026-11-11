import { Band } from "@/shared/layout/shell";
import type { LandingSection } from "@/shared/lib/types/api";
import { AwardIcon, BriefIcon, DesignIcon, TestIcon } from "@/shared/ui/icons";

const ICONS = {
  brief: BriefIcon,
  design: DesignIcon,
  test: TestIcon,
  award: AwardIcon,
} as const;

export function Process({ section }: { section: LandingSection }) {
  return (
    <Band className="bg-white">
      <div className="text-center">
        <h2 className="text-[clamp(23px,2.6vw,34px)] font-bold">{section.title}</h2>
        {section.subtitle && <p className="mt-2.5 text-[15.5px] text-muted">{section.subtitle}</p>}
      </div>

      <div className="relative mt-[clamp(30px,3.6vw,52px)]">
        {/* Dotted rule threading the four circles. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-[clamp(42px,3.6vw,52px)] h-px bg-[repeating-linear-gradient(to_right,#C3CEE4_0_5px,transparent_5px_11px)] max-[900px]:hidden"
        />

        <ol className="relative grid grid-cols-4 gap-[clamp(14px,2vw,28px)] max-[900px]:grid-cols-2 max-[900px]:gap-y-[clamp(30px,4vw,44px)] max-[640px]:grid-cols-1">
          {section.contents.map((step) => {
            const Icon = ICONS[step.icon as keyof typeof ICONS] ?? BriefIcon;

            return (
              <li key={step.id} className="relative flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex size-[clamp(84px,7.2vw,104px)] items-center justify-center rounded-full border border-line bg-white text-brand shadow-[0_10px_26px_rgba(13,86,242,.09)]">
                    <Icon />
                  </div>
                  <span className="absolute -top-1 -left-2.5 flex size-10 items-center justify-center rounded-full border-[3px] border-white bg-brand font-mono text-sm font-medium text-white">
                    {step.num}
                  </span>
                </div>

                <h3 className="mt-[22px] text-[clamp(16px,1.4vw,20px)] font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-[23ch] text-sm leading-[1.75] text-faint">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </Band>
  );
}
