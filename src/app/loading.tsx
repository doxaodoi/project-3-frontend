import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

/** Board / home page loading skeleton. */
export default function HomeLoading() {
  return (
    <AppShell>
      <div className="py-8">
        {/* Hero heading */}
        <Skeleton className="mb-2 h-9 w-64" />
        <Skeleton className="mb-8 h-5 w-96" />

        {/* Filter bar */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>

        {/* Item grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[11px] border border-line bg-paper">
              <Skeleton className="h-[180px] w-full rounded-none" />
              <div className="p-4">
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="mb-3 h-3 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
