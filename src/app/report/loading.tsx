import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

/** Report form loading skeleton. */
export default function ReportLoading() {
  return (
    <AppShell>
      <div className="py-8">
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="mb-6 h-4 w-80" />

        {/* Mode toggle */}
        <Skeleton className="mb-6 h-10 w-72 rounded-[9px]" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[420px_1fr]">
          {/* Photo area */}
          <Skeleton className="h-[250px] rounded-[11px]" />

          {/* Form fields */}
          <div className="flex flex-col gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-3 w-20" />
                <Skeleton className="h-11 w-full rounded-[9px]" />
              </div>
            ))}
            <Skeleton className="mt-2 h-11 w-40 rounded-[9px]" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
