import { cn } from "@/lib/cn";

/** Shimmer skeleton block — matches the Reclaim warm palette. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[9px] bg-line/60",
        className,
      )}
    />
  );
}

/** Page-level loading wrapper with consistent padding. */
export function PageSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
      {children}
    </div>
  );
}

/** Board / item grid skeleton — reused by the home page and its loading.tsx. */
export function BoardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[11px] border border-line2 bg-card"
        >
          <Skeleton className="h-[130px] w-full rounded-none" />
          <div className="p-3.5">
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="mb-1 h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Vertical list-row skeleton (messages, notifications, reports). */
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2 py-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-[10px] border border-line2 bg-card p-3.5"
        >
          <Skeleton className="h-10 w-10 flex-none rounded-full" />
          <div className="flex-1">
            <Skeleton className="mb-1.5 h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Four KPI stat cards. */
export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 py-5 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-line2 bg-card p-5">
          <Skeleton className="mb-3 h-3 w-20" />
          <Skeleton className="h-8 w-12" />
        </div>
      ))}
    </div>
  );
}
