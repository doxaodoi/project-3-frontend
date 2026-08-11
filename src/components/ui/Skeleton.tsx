import { cn } from "@/lib/cn";

/** Shimmer skeleton block — matches the Reclaim warm palette. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[9px] bg-line/60",
        className,
      )}
    />
  );
}

/** Page-level loading wrapper with consistent padding. */
export function PageSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
      {children}
    </div>
  );
}
