import { Skeleton } from "@/shared/skeletons/skeleton";

/** Stand-in for a dashboard page with a title, an add button and a grid of cards. */
export function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-label="جارٍ التحميل" className="grid gap-6">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-11 w-full sm:w-36" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="grid gap-3 rounded-lg border border-white/10 bg-night-tile p-6">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-8 w-2/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
