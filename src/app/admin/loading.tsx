import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

/** Admin dashboard loading skeleton. */
export default function AdminLoading() {
  return (
    <AppShell>
      <div className="py-8">
        <Skeleton className="mb-2 h-8 w-52" />
        <Skeleton className="mb-8 h-4 w-72" />

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[11px] border border-line bg-paper p-5">
              <Skeleton className="mb-3 h-3 w-24" />
              <Skeleton className="h-8 w-14" />
            </div>
          ))}
        </div>

        {/* Chart placeholder */}
        <Skeleton className="mb-8 h-[240px] w-full rounded-[11px]" />

        {/* Table */}
        <Skeleton className="mb-3 h-5 w-28" />
        <div className="rounded-[11px] border border-line bg-paper">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-line px-4 py-3 last:border-b-0">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-40 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
