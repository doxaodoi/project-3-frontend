import { cn } from "@/lib/cn";

type ItemType = "LOST" | "FOUND";

/** Status pill used on item photos — dark ink for LOST, green for FOUND. */
export function TypeBadge({
  type,
  className,
}: {
  type: ItemType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[9px] tracking-[0.1em] rounded-[5px] px-2 py-1",
        type === "LOST" ? "bg-ink text-paper" : "bg-found text-white",
        className,
      )}
    >
      {type}
    </span>
  );
}

type ChipTone = "neutral" | "accent" | "open" | "resolved";

const chipTones: Record<ChipTone, string> = {
  neutral: "bg-panel text-ink2",
  accent: "bg-rusttint text-rust",
  open: "bg-[#eef1e8] text-[#4a6b3a]",
  resolved: "bg-[#e6efe4] text-found",
};

/** Small mono status chip, e.g. MATCHED / OPEN / RESOLVED. */
export function StatusChip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: ChipTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] font-bold tracking-[0.06em] rounded-full px-[9px] py-[5px]",
        chipTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Map an item status to its chip tone. */
export function statusTone(status: string): ChipTone {
  if (status === "MATCHED") return "accent";
  if (status === "RESOLVED") return "resolved";
  return "open";
}
