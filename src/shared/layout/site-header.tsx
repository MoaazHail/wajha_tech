"use client";

import { useEffect, useId, useRef, useState } from "react";

import { CtaLink } from "@/shared/components/cta-link";
import { useActiveSection } from "@/shared/hooks/use-active-section";
import { MAIN_NAV } from "@/shared/lib/constants/navigation.constant";
import { SITE } from "@/shared/lib/constants/site.constant";
import { cn } from "@/shared/lib/utils/cn.util";
import { Shell } from "@/shared/layout/shell";
import { CloseIcon, MenuIcon } from "@/shared/ui/icons";
import { Logo } from "@/shared/ui/logo";

/** Module scope so the array identity is stable across renders. */
const NAV_HREFS = MAIN_NAV.map((item) => item.href);

/** The width at which the full link row still fits beside the logo and the CTA. */
const DESKTOP_QUERY = "(min-width: 1120px)";

/**
 * Fixed to the top of the viewport on its own brand background. Above 1120px it
 * shows the full link row; below that the links collapse into a toggle panel.
 * The link matching the section in view is marked active, and clicking a link
 * marks it immediately rather than waiting for the smooth scroll to land.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { active, select } = useActiveSection(NAV_HREFS);
  const panelId = useId();
  const headerRef = useRef<HTMLElement>(null);

  // Collapse the panel as soon as the desktop row is available again.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const close = () => {
      if (query.matches) setOpen(false);
    };

    close();
    query.addEventListener("change", close);
    return () => query.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const handleSelect = (href: string) => {
    select(href);
    setOpen(false);
  };

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 bg-brand px-gutter text-white">
      <Shell className="flex h-(--header-h) items-center justify-between gap-7">
        <a href="#top" onClick={() => handleSelect("#top")} aria-label={SITE.name}>
          <Logo size={40} animated />
        </a>

        <nav
          aria-label="التنقل الرئيسي"
          className="hidden items-center gap-[clamp(18px,2.2vw,34px)] text-[15px] font-medium min-[1120px]:flex"
        >
          {MAIN_NAV.map((item) => {
            const isActive = item.href === active;

            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                onClick={() => handleSelect(item.href)}
                className={cn(
                  "border-b-2 pb-1.5 transition-colors",
                  isActive
                    ? "border-accent text-white"
                    : "border-transparent text-white/80 hover:text-white",
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex flex-none items-center gap-2">
          <CtaLink
            href={SITE.whatsapp}
            target="_blank"
            rel="noreferrer"
            tone="outline"
            size="sm"
            shape="square"
            className="border-white/55 max-[640px]:hidden"
          >
            تواصل معنا
          </CtaLink>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            className="flex size-10 items-center justify-center rounded-md border border-white/55 text-white transition-colors hover:bg-white/12 min-[1120px]:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </Shell>

      {/* Drops below the bar, full width, on the same blue. */}
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-white/15 bg-brand px-gutter pb-5 shadow-[0_18px_40px_rgba(4,20,66,.35)] min-[1120px]:hidden"
      >
        <Shell>
          <nav aria-label="التنقل الرئيسي" className="grid gap-1 pt-3">
            {MAIN_NAV.map((item) => {
              const isActive = item.href === active;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => handleSelect(item.href)}
                  className={cn(
                    "rounded-md border-s-2 px-4 py-3 text-base transition-colors",
                    isActive
                      ? "border-accent bg-white/12 font-medium text-white"
                      : "border-transparent text-white/80 hover:bg-white/8 hover:text-white",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <CtaLink
            href={SITE.whatsapp}
            target="_blank"
            rel="noreferrer"
            tone="white"
            size="lg"
            className="mt-4 w-full justify-center sm:hidden"
          >
            تواصل معنا
          </CtaLink>
        </Shell>
      </div>
    </header>
  );
}
