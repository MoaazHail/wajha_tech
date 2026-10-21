import { Band } from "@/shared/layout/shell";
import { BoltIcon, ChartIcon, HeadsetIcon, LayoutIcon } from "@/shared/ui/icons";

import { FEATURES } from "../_lib/constants/landing.constant";

const ICONS = {
  layout: LayoutIcon,
  bolt: BoltIcon,
  chart: ChartIcon,
  headset: HeadsetIcon,
} as const;

export function Why() {
  return (
    <Band id="why" className="bg-surface">
      <h2 className="text-center text-[clamp(23px,2.6vw,34px)] font-bold">
        نساعد الشركات على النمو رقمياً
      </h2>

      <div className="mt-[clamp(26px,3.2vw,44px)] grid grid-cols-4 max-[960px]:grid-cols-2 max-[960px]:gap-y-6 max-[640px]:grid-cols-1">
        {FEATURES.map((feature, index) => {
          const Icon = ICONS[feature.icon];
          const isLast = index === FEATURES.length - 1;

          return (
            <div
              key={feature.title}
              className={`flex items-start gap-3 px-[clamp(12px,1.6vw,26px)] ${
                isLast ? "" : "border-e border-line max-[960px]:border-e-0"
              }`}
            >
              <span className="flex-none text-[#A9B7D6]">
                <Icon />
              </span>
              <div className="min-w-0">
                <h3 className="text-[clamp(15px,1.15vw,18px)] leading-[1.5] font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm leading-[1.7] text-muted">{feature.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Band>
  );
}
