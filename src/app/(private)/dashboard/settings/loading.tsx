import { Skeleton } from "@/shared/skeletons/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="جارٍ التحميل" className="grid gap-6">
      <Skeleton className="h-9 w-40" />
      <div className="grid max-w-3xl gap-5 rounded-lg border border-white/10 bg-night-tile p-4 sm:p-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-full" />
          </div>
        ))}
        <Skeleton className="h-11 w-full sm:w-28" />
      </div>
    </div>
  );
}
