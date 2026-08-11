import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

/** Item detail page loading skeleton. */
export default function ItemDetailLoading() {
  return (
    <AppShell>
      <div className="py-8">
        {/* Back link */}
        <Skeleton className="mb-6 h-4 w-24" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[420px_1fr]">
          {/* Photo */}
          <div>
            <Skeleton className="h-[320px] w-full rounded-[11px]" />
            {/* Mini map */}
            <Skeleton className="mt-4 h-[160px] w-full rounded-[11px]" />
          </div>

          {/* Details */}
          <div>
            <Skeleton className="mb-1 h-5 w-16 rounded-full" />
            <Skeleton className="mb-3 h-8 w-3/4" />
            <Skeleton className="mb-1 h-4 w-full" />
            <Skeleton className="mb-6 h-4 w-2/3" />

            {/* Meta rows */}
            <div className="space-y-3 border-t border-line pt-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))}
            </div>

            {/* Claim button */}
            <Skeleton className="mt-8 h-11 w-40 rounded-[9px]" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
