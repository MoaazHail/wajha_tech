import Image from "next/image";

import { ShieldCheckIcon } from "@/shared/ui/icons";

import { HERO_AVATARS } from "../_lib/constants/landing.constant";

/** The gradient card under the hero buttons: track record, badge, client faces. */
export function HeroProofBand() {
  return (
    <div className="relative mt-[clamp(30px,3.2vw,44px)] max-w-[430px] overflow-hidden rounded-[18px] bg-[linear-gradient(115deg,#0B3AC9_0%,#0D4AE0_46%,#1A63FF_100%)] shadow-[0_18px_44px_rgba(4,20,66,.34)]">
      <svg
        aria-hidden
        viewBox="0 0 430 150"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full"
      >
        <defs>
          <radialGradient id="w-glow" cx="16%" cy="112%" r="62%">
            <stop offset="0" stopColor="#5E93FF" stopOpacity=".85" />
            <stop offset="1" stopColor="#5E93FF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="w-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#BFD4FF" stopOpacity="0" />
            <stop offset=".55" stopColor="#CFDEFF" stopOpacity=".75" />
            <stop offset="1" stopColor="#CFDEFF" stopOpacity="0" />
          </linearGradient>
          <pattern id="w-dots" width="11" height="11" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#9FBEFF" fillOpacity=".5" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="430" height="150" fill="url(#w-glow)" />
        <rect x="10" y="20" width="40" height="66" fill="url(#w-dots)" />
        <path d="M0 78 C 70 100, 130 122, 205 150" fill="none" stroke="url(#w-sweep)" strokeWidth="2" />
        <path
          d="M0 108 C 55 120, 105 136, 150 150"
          fill="none"
          stroke="url(#w-sweep)"
          strokeWidth="1.2"
          strokeOpacity=".7"
        />
        <path
          d="M96 116l1.7 6L104 124l-6.3 1.7L96 132l-1.7-6.3L88 124l6.3-1.7L96 116z"
          fill="#CFE0FF"
          fillOpacity=".85"
        />
      </svg>

      <div className="relative flex flex-wrap items-center gap-3 px-[clamp(18px,2vw,24px)] py-[clamp(16px,1.8vw,22px)]">
        <div className="min-w-[min(170px,100%)] flex-[1_1_200px]">
          <p className="font-display text-[clamp(13.5px,1.05vw,15.5px)] leading-[1.55] font-bold tracking-[-0.01em] text-white">
            تم تنفيذ أكثر من <span className="font-mono font-medium tracking-[.02em]">50</span> مَوقعًا
            <br />
            وبروفايل شركة باحترافية عالية
          </p>
          <div className="mt-[11px] flex gap-[9px]">
            <i className="w-0.5 flex-none rounded-sm bg-[#8FB4FF]" />
            <p className="text-[clamp(12.5px,.95vw,13px)] leading-[1.6] whitespace-nowrap text-[#B9CCF7] max-[760px]:whitespace-normal">
              حلول رقمية تزيد ثقة عميلك ومبيعاتك
            </p>
          </div>
        </div>

        <span
          aria-hidden
          className="flex size-[26px] flex-none items-center justify-center rounded-full border border-white/35 bg-[#1C5CF5]"
        >
          <ShieldCheckIcon />
        </span>

        <div dir="ltr" className="flex flex-none items-center">
          {HERO_AVATARS.map((src, index) => (
            <div
              key={src}
              className="size-11 overflow-hidden rounded-full border-2 border-white bg-[#3B77FA] shadow-[0_6px_16px_rgba(4,20,66,.3)] not-first:-ml-3"
            >
              <Image
                src={src}
                alt=""
                width={176}
                height={176}
                priority={index === 0}
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
