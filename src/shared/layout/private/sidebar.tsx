"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { DASHBOARD_NAV, type DashboardNavIcon } from "@/shared/lib/constants/dashboard.constant";
import { cn } from "@/shared/lib/utils/cn.util";
import { ChevronIcon, CloseIcon, LayoutIcon, MenuIcon } from "@/shared/ui/icons";
import { Logo } from "@/shared/ui/logo";

const NAV_ICONS: Record<DashboardNavIcon, typeof LayoutIcon> = {
  overview: LayoutIcon,
};

/**
 * Dashboard navigation. From 1024px up it is a sticky column beside the content;
 * below that it becomes an off-canvas drawer opened from a sticky top bar, with
 * an overlay, Escape to close and the page scroll locked while it is open.
 */
export function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const drawerId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Leaving the drawer open when the viewport grows would keep the scroll lock.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const close = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener("change", close);
    return () => query.removeEventListener("change", close);
  }, []);

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-night px-gutter text-white lg:hidden">
        <Logo size={32} compact />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls={drawerId}
          aria-label="فتح القائمة"
          className="flex size-10 items-center justify-center rounded-md border border-white/30 transition-colors hover:bg-white/10"
        >
          <MenuIcon />
        </button>
      </div>

      {open && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="إغلاق القائمة"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        id={drawerId}
        aria-label="قائمة لوحة التحكم"
        className={cn(
          "z-50 flex w-72 flex-col bg-night text-white transition-[transform,visibility] duration-250 ease-out",
          "fixed inset-y-0 start-0 lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:flex-none",
          // The closed state only applies below lg, so it can never hide the desktop column.
          !open && "max-lg:invisible max-lg:ltr:-translate-x-full max-lg:rtl:translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5 lg:h-20">
          <Logo size={34} compact />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="إغلاق القائمة"
            className="flex size-9 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="روابط لوحة التحكم" className="grid flex-1 content-start gap-1 overflow-y-auto p-3">
          {DASHBOARD_NAV.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            const isActive =
              item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md border-s-2 px-4 py-3 text-[15px] transition-colors",
                  isActive
                    ? "border-accent bg-white/10 font-medium text-white"
                    : "border-transparent text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon width={20} height={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-4 py-3 text-[15px] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ChevronIcon direction="end" />
            العودة إلى الموقع
          </Link>
        </div>
      </aside>
    </>
  );
}
