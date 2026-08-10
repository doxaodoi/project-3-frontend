import { cn } from "@/lib/cn";

/** Reclaim mark: rust disc with a serif "R". */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="flex flex-none items-center justify-center rounded-full bg-rust font-serif font-semibold text-paper"
      style={{ width: size, height: size, fontSize: size * 0.56 }}
    >
      R
    </span>
  );
}

export function Logo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark size={size} />
      <span className="font-serif text-[22px] font-semibold tracking-[-0.01em] text-ink">
        Reclaim
      </span>
    </div>
  );
}
