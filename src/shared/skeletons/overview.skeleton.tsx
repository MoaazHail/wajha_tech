import { Skeleton } from "@/shared/skeletons/skeleton";

export function OverviewSkeleton() {
  return (
    <div role="status" aria-label="جارٍ التحميل" className="grid gap-8">
      <Skeleton className="h-9 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
