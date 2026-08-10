import { cn } from "@/lib/cn";

/** Rounded accent tag — used for AI-suggested attributes on the report form. */
export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full border border-rustline bg-card px-[10px] py-[5px] text-[11.5px] font-semibold text-rustdark",
        className,
      )}
    >
      {children}
    </span>
  );
}
