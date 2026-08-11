import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

/** Notifications page loading skeleton. */
export default function NotificationsLoading() {
  return (
    <AppShell>
      <div className="py-8">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Notification rows */}
        <div className="space-y-1 rounded-[11px] border border-line bg-paper">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-line px-4 py-4 last:border-b-0">
              <Skeleton className="mt-0.5 h-8 w-8 flex-none rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-1.5 h-4 w-48" />
                <Skeleton className="h-3 w-72" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
