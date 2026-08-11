import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

/** Messages page loading skeleton. */
export default function MessagesLoading() {
  return (
    <AppShell>
      <div className="py-8">
        <Skeleton className="mb-2 h-8 w-32" />
        <Skeleton className="mb-8 h-4 w-56" />

        {/* Conversation list */}
        <div className="space-y-1 rounded-[11px] border border-line bg-paper">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-line px-4 py-4 last:border-b-0">
              <Skeleton className="h-10 w-10 flex-none rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-1.5 h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
