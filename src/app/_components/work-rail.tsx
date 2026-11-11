"use client";

import { useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import type { Landing, LandingSection } from "@/shared/lib/types/api";
import { Shell } from "@/shared/layout/shell";
import { ChevronIcon } from "@/shared/ui/icons";

import { safeHref } from "../_lib/utils/landing.util";

const arrowClass =
  "absolute top-1/2 flex size-[34px] -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-[0_8px_20px_rgba(4,20,66,.45)] transition-colors hover:bg-brand-dark max-[640px]:hidden";

interface WorkRailProps {
  section: LandingSection;
  projects: Landing["projects"];
}

export function WorkRail({ section, projects }: WorkRailProps) {
  const rail = useRef<HTMLDivElement>(null);  

  /** `direction` is -1 towards the rail's end, +1 back towards its start. */
  const nudge = (direction: -1 | 1) => {
    const el = rail.current;
    if (!el) return;

    el.scrollBy({
      left: direction * Math.min(320, Math.round(el.clientWidth * 0.75)),
      behavior: "smooth",
    });
  };

  return (
    <section
      id="work"
      className="bg-night px-gutter pt-band pb-[clamp(30px,3.4vw,52px)] text-white"
    >
      <Shell>
        <div className="text-center">
          <h2 className="text-[clamp(23px,2.6vw,34px)] font-bold">{section.title}</h2>
          {section.subtitle && <p className="mt-2.5 text-[15.5px] text-white/70">{section.subtitle}</p>}
        </div>

        <div className="relative mt-[clamp(26px,3.2vw,44px)]">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-[clamp(18px,2.2vw,30px)]">
            <div
              ref={rail}
              className="no-scrollbar flex gap-[clamp(14px,1.8vw,24px)] overflow-x-auto pb-0.5 [scroll-snap-type:x_mandatory]"
            >
              {projects.map((project) => {
                const live = safeHref(project.live);
                const tile = (
                  <>
                    {project.bio_image && (
                      <Image src={project.bio_image} alt={project.title} height={300} width={300} />
                    )}
                    <figcaption className="mt-3 text-center text-[14.5px] font-medium text-white/85">
                      {project.title}
                    </figcaption>
                  </>
                );
                const tileClass = "m-0 flex-[0_0_clamp(200px,23%,260px)] [scroll-snap-align:start]";

                return live ? (
                  <Link key={project.id} href={live} target="_blank" rel="noreferrer" className={tileClass}>
                    {tile}
                  </Link>
                ) : (
                  <div key={project.id} className={tileClass}>
                    {tile}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="التالي"
            aria-controls="work"
            className={`${arrowClass} left-[calc(-1*clamp(6px,1.4vw,20px))]`}
          >
            <ChevronIcon direction="start" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="السابق"
            aria-controls="work"
            className={`${arrowClass} right-[calc(-1*clamp(6px,1.4vw,20px))]`}
          >
            <ChevronIcon direction="end" />
          </button>
        </div>
      </Shell>
    </section>
  );
}
