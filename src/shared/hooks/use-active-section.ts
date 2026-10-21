"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** How long to trust a click before letting scroll position take over again. */
const PIN_TIMEOUT = 1200;

/**
 * Tracks which anchor section the reader is currently in.
 *
 * `select` is called when a nav link is clicked: it highlights that link right
 * away and pins it, so the highlight does not flicker through every section the
 * smooth scroll passes over on the way down. The pin lifts once the section is
 * actually reached, or after `PIN_TIMEOUT` for short sections at the end of the
 * page that can never scroll all the way to the top.
 */
export function useActiveSection(hrefs: readonly string[]) {
  const [active, setActive] = useState(hrefs[0]);
  const pinned = useRef<string | null>(null);
  const pinTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const readCurrent = () => {
      const headerOffset =
        Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
      const line = window.scrollY + headerOffset + 12;

      // The last section whose top has passed under the header wins.
      let current = hrefs[0];
      for (const href of hrefs) {
        const el = document.getElementById(href.slice(1));
        if (el && el.getBoundingClientRect().top + window.scrollY <= line) current = href;
      }

      // At the very bottom nothing further can pass the line, so snap to the end.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = hrefs[hrefs.length - 1];

      if (pinned.current) {
        if (pinned.current === current) pinned.current = null;
        return;
      }

      setActive(current);
    };

    readCurrent();
    window.addEventListener("scroll", readCurrent, { passive: true });
    window.addEventListener("resize", readCurrent);

    return () => {
      window.removeEventListener("scroll", readCurrent);
      window.removeEventListener("resize", readCurrent);
    };
  }, [hrefs]);

  useEffect(() => () => clearTimeout(pinTimer.current), []);

  const select = useCallback((href: string) => {
    setActive(href);
    pinned.current = href;
    clearTimeout(pinTimer.current);
    pinTimer.current = setTimeout(() => {
      pinned.current = null;
    }, PIN_TIMEOUT);
  }, []);

  return { active, select };
}
