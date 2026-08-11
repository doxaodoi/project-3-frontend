import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

/** Dashboard loading skeleton. */
export default function DashboardLoading() {
  return (
    <AppShell>
      <div className="py-8">
        {/* Greeting */}
        <Skeleton className="mb-1 h-8 w-72" />
        <Skeleton className="mb-8 h-4 w-52" />

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[11px] border border-line bg-paper p-5">
              <Skeleton className="mb-3 h-3 w-20" />
              <Skeleton className="h-8 w-12" />
            </div>
          ))}
        </div>

        {/* Reports list */}
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="rounded-[11px] border border-line bg-paper p-5">
          <Skeleton className="mb-4 h-12 w-full" />
          <Skeleton className="mb-4 h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Quick actions */}
        <Skeleton className="mt-8 mb-3 h-5 w-28" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[11px] border border-line bg-paper p-5">
              <Skeleton className="mb-2 h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
