import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

/** My reports page loading skeleton. */
export default function MyReportsLoading() {
  return (
    <AppShell>
      <div className="py-8">
        <Skeleton className="mb-2 h-8 w-36" />
        <Skeleton className="mb-8 h-4 w-64" />

        {/* Report rows */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-[11px] border border-line bg-paper p-4">
              <Skeleton className="h-20 w-20 flex-none rounded-lg" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-5 w-2/3" />
                <Skeleton className="mb-2 h-3 w-full" />
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
