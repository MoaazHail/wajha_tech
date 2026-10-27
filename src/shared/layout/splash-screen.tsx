"use client";

import { useEffect, useState } from "react";

import { Logo } from "@/shared/ui/logo";
import { cn } from "@/shared/lib/utils/cn.util";

const HOLD_MS = 1000;
const FADE_MS = 350;

/** Full-screen intro: the animated door mark for a second, then it fades away. */
export function SplashScreen() {
  const [phase, setPhase] = useState<"show" | "leaving" | "gone">("show");

  useEffect(() => {
    const leave = setTimeout(() => setPhase("leaving"), HOLD_MS);
    const gone = setTimeout(() => setPhase("gone"), HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(leave);
      clearTimeout(gone);
    };
  }, []);

  useEffect(() => {
    if (phase === "gone") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-brand text-white transition-opacity ease-out",
        phase === "leaving" ? "opacity-0" : "opacity-100",
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="animate-rise" style={{ animationDelay: "0ms" }}>
        <Logo size={72} animated />
      </div>
    </div>
  );
}
