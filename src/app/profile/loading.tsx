import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

/** Profile page loading skeleton. */
export default function ProfileLoading() {
  return (
    <AppShell>
      <div className="mx-auto max-w-lg py-8">
        {/* Avatar + name */}
        <div className="mb-8 flex flex-col items-center">
          <Skeleton className="mb-4 h-20 w-20 rounded-full" />
          <Skeleton className="mb-1 h-6 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Profile fields */}
        <div className="space-y-5 rounded-[11px] border border-line bg-paper p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-2 h-3 w-20" />
              <Skeleton className="h-11 w-full rounded-[9px]" />
            </div>
          ))}
          <Skeleton className="mt-2 h-11 w-32 rounded-[9px]" />
        </div>
      </div>
    </AppShell>
  );
}
