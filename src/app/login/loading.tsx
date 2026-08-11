import { Skeleton } from "@/components/ui/Skeleton";

/** Login page loading skeleton — no AppShell (auth pages are outside the shell). */
export default function LoginLoading() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel (brand) */}
      <div className="hidden w-1/2 items-center justify-center bg-panel lg:flex">
        <Skeleton className="h-12 w-48" />
      </div>

      {/* Right panel (form) */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Tabs */}
          <div className="mb-8 flex gap-4">
            <Skeleton className="h-9 w-20 rounded-[9px]" />
            <Skeleton className="h-9 w-20 rounded-[9px]" />
          </div>

          {/* Fields */}
          <div className="space-y-5">
            <div>
              <Skeleton className="mb-2 h-3 w-14" />
              <Skeleton className="h-11 w-full rounded-[9px]" />
            </div>
            <div>
              <Skeleton className="mb-2 h-3 w-20" />
              <Skeleton className="h-11 w-full rounded-[9px]" />
            </div>
            <Skeleton className="h-11 w-full rounded-[9px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
