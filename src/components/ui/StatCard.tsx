import { cn } from "@/lib/cn";

type Tone = "default" | "accent" | "dark" | "good";

const tones: Record<Tone, { card: string; label: string; value: string }> = {
  default: { card: "border border-line2 bg-card", label: "text-faint", value: "text-ink" },
  accent: { card: "border border-rustline bg-rusttint", label: "text-rust", value: "text-rust" },
  dark: { card: "bg-ink", label: "text-[#e0a488]", value: "text-paper" },
  good: { card: "border border-line2 bg-card", label: "text-faint", value: "text-found" },
};

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: React.ReactNode;
  tone?: Tone;
}) {
  const t = tones[tone];
  return (
    <div className={cn("rounded-[11px] p-[18px]", t.card)}>
      <div className={cn("eyebrow mb-2 text-[10px]", t.label)}>{label}</div>
      <div className={cn("font-serif text-[32px] font-semibold leading-none", t.value)}>
        {value}
      </div>
      {hint && (
        <div
          className={cn(
            "mt-1 text-[11.5px]",
            tone === "dark" ? "text-[#c9c1b2]" : "text-ink3",
          )}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
