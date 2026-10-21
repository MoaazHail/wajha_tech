import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils/cn.util";

/** Caps content at the design's 1240px and centres it. */
export function Shell({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1240px]", className)} {...props} />;
}

type BandProps = ComponentProps<"section">;

/** A full-width page band: fluid gutter outside, Shell inside. */
export function Band({ className, children, ...props }: BandProps) {
  return (
    <section className={cn("px-gutter py-band", className)} {...props}>
      <Shell>{children}</Shell>
    </section>
  );
}
