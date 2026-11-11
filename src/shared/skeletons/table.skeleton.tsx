import { Skeleton } from "@/shared/skeletons/skeleton";

interface TableSkeletonProps {
  /** Page title placeholder + add button + rows, matching DataTable's layout. */
  columns?: number;
  rows?: number;
}

/** Stand-in for a dashboard page with a title and a DataTable while the API answers. */
export function TableSkeleton({ columns = 4, rows = 6 }: TableSkeletonProps) {
  return (
    <div role="status" aria-label="جارٍ التحميل" className="grid gap-6">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-11 w-full sm:w-36" />

      {/* md+: table */}
      <div className="hidden overflow-hidden rounded-lg border border-white/10 bg-night-tile md:block">
        <div className="flex gap-6 bg-white/5 px-4 py-3.5">
          {Array.from({ length: columns }, (_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        <div className="divide-y divide-white/10">
          {Array.from({ length: rows }, (_, row) => (
            <div key={row} className="flex items-center gap-6 px-4 py-4">
              {Array.from({ length: columns }, (_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* below md: cards */}
      <div className="grid gap-3 md:hidden">
        {Array.from({ length: Math.min(rows, 4) }, (_, row) => (
          <div key={row} className="grid gap-3 rounded-lg border border-white/10 bg-night-tile p-4">
            {Array.from({ length: columns }, (_, i) => (
              <div key={i} className="flex justify-between gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
