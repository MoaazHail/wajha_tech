import type { SVGProps } from "react";

/** Inline SVGs lifted from the design file. All are decorative. */

type IconProps = SVGProps<SVGSVGElement>;

const line = {
  stroke: "currentColor",
  strokeWidth: 1.4,
} as const;

export function LayoutIcon(props: IconProps) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect x="3" y="3.5" width="18" height="17" rx="2.5" {...line} />
      <path d="M3 8.5h18M8.5 8.5v12" {...line} />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M13.5 2.5L5 13.6h5.2L9.8 21.5 19 10.2h-5.4l-.1-7.7z"
        {...line}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M3.5 20.5h17" {...line} strokeLinecap="round" />
      <rect x="5" y="12" width="3.6" height="6" {...line} />
      <rect x="10.2" y="8" width="3.6" height="10" {...line} />
      <rect x="15.4" y="4" width="3.6" height="14" {...line} />
    </svg>
  );
}

export function HeadsetIcon(props: IconProps) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M4 15v-3a8 8 0 0116 0v3" {...line} strokeLinecap="round" />
      <rect x="2.6" y="13.6" width="4" height="6.4" rx="1.6" {...line} />
      <rect x="17.4" y="13.6" width="4" height="6.4" rx="1.6" {...line} />
      <path d="M19.4 20c0 1.4-1.4 2.4-3.4 2.4h-2.6" {...line} strokeLinecap="round" />
    </svg>
  );
}

/** Thick tick used in the package list. */
export function CheckIcon(props: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M4.5 12.5l4.6 4.6L19.5 6.8"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Circled tick used in the single-service cards. */
export function CheckCircleIcon(props: IconProps) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.2 12.2l2.6 2.6 5-5.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MonitorIcon(props: IconProps) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x="2.8"
        y="4"
        width="18.4"
        height="12.6"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M9 20h6M12 16.8V20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function FileIcon(props: IconProps) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M5.8 3.4h7.6L18.4 8.4v12.2H5.8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M13.1 3.7v4.9h4.9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8.8 13h6.4M8.8 16.4h4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BriefIcon(props: IconProps) {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M6 3.5h7.4L18.5 8.6v11.9H6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M13.2 3.8v5.1h5.1" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.8 12.6h6.4M8.8 15.6h6.4M8.8 18h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DesignIcon(props: IconProps) {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M5 3.5h9l4.8 4.8V16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M5 3.5v17h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M19.6 11.4l2.2 2.2-6.4 6.4-2.9.7.7-2.9 6.4-6.4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TestIcon(props: IconProps) {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="10.8" cy="10.8" r="7.3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.6 10.9l2.4 2.4 4.2-4.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16.2 16.3l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function AwardIcon(props: IconProps) {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="9" r="5.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 6.4v1.2M12 10.4v1.2M9.4 9h1.2M13.4 9h1.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.6 13.8L7 21l5-2.4 5 2.4-1.6-7.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M12 2.6l7 2.6v6.1c0 4.3-2.9 8-7 9.1-4.1-1.1-7-4.8-7-9.1V5.2l7-2.6z" fill="#DCE8FF" />
      <path
        d="M8.6 12.1l2.3 2.3 4.5-4.6"
        stroke="#1C5CF5"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronIcon({
  direction = "start",
  ...props
}: IconProps & { direction?: "start" | "end" }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d={direction === "start" ? "M14.5 5L7.5 12l7 7" : "M9.5 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M12 20V5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M5.5 11.5L12 5l6.5 6.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M21.6 7.2c-.2-1-1-1.8-2-2C17.8 4.8 12 4.8 12 4.8s-5.8 0-7.6.4c-1 .2-1.8 1-2 2C2 9 2 12 2 12s0 3 .4 4.8c.2 1 1 1.8 2 2 1.8.4 7.6.4 7.6.4s5.8 0 7.6-.4c1-.2 1.8-1 2-2C22 15 22 12 22 12s0-3-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.02-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4V9z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.7 3h3.3l-7.2 8.2L22 21h-6.3l-4.6-6-5.3 6H2.5l7.5-8.6L2.3 3h6.4l4.3 5.7L17.7 3zm-1.2 16h1.8L7.6 4.9H5.7L16.5 19z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M16.5 3.8l3.7 3.7L8.4 19.3l-4.6.9.9-4.6L16.5 3.8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M4 7h16M9.5 7V4.5h5V7M6.5 7l.8 12.5h9.4L17.5 7M10 11v5.5M14 11v5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <circle cx="12" cy="5.5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="18.5" r="1.8" />
    </svg>
  );
}
