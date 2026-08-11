import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

/** Matches page loading skeleton. */
export default function MatchesLoading() {
  return (
    <AppShell>
      <div className="py-8">
        <Skeleton className="mb-2 h-4 w-24" />
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="mb-8 h-4 w-80" />

        {/* Match cards */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-[11px] border border-line bg-paper p-5">
              <Skeleton className="h-24 w-24 flex-none rounded-lg" />
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="mb-2 h-5 w-3/4" />
                <Skeleton className="mb-3 h-3 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24 rounded-[9px]" />
                  <Skeleton className="h-9 w-24 rounded-[9px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
