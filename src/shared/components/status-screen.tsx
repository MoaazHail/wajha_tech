import { CtaLink } from "@/shared/components/cta-link";

interface StatusScreenProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  children?: React.ReactNode;
}

/** Shared full-page state for the 404 and error screens. */
export function StatusScreen({ title, description, action, children }: StatusScreenProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center gap-5 px-gutter text-center">
      <h1 className="text-[clamp(26px,3vw,38px)] font-bold">{title}</h1>
      {description ? <p className="text-muted">{description}</p> : null}
      {action ? (
        <CtaLink href={action.href} tone="blue" size="lg">
          {action.label}
        </CtaLink>
      ) : null}
      {children}
    </div>
  );
}
