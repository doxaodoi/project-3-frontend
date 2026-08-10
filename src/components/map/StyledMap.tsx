import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Decorative roads + blocks so the fallback map reads as a campus. */
function CampusBackdrop() {
  return (
    <>
      {/* roads (percentage-based so they scale) */}
      <div className="rmap-road" style={{ left: 0, right: 0, top: "30%", height: "4%" }} />
      <div className="rmap-road" style={{ left: 0, right: 0, top: "70%", height: "4%" }} />
      <div className="rmap-road" style={{ top: 0, bottom: 0, left: "30%", width: "3.5%" }} />
      <div className="rmap-road" style={{ top: 0, bottom: 0, left: "66%", width: "3.5%" }} />
      {/* blocks */}
      <div className="rmap-block" style={{ left: "4%", top: "8%", width: "20%", height: "16%" }} />
      <div className="rmap-block" style={{ left: "36%", top: "6%", width: "24%", height: "17%" }} />
      <div className="rmap-block" style={{ left: "74%", top: "9%", width: "20%", height: "15%" }} />
      <div className="rmap-block" style={{ left: "5%", top: "42%", width: "18%", height: "22%" }} />
      <div className="rmap-block" style={{ left: "38%", top: "42%", width: "22%", height: "22%" }} />
      <div className="rmap-block" style={{ left: "75%", top: "40%", width: "19%", height: "24%" }} />
      <div className="rmap-block" style={{ left: "15%", top: "80%", width: "26%", height: "14%" }} />
      <div className="rmap-block" style={{ left: "55%", top: "82%", width: "28%", height: "14%" }} />
    </>
  );
}

export function StyledMap({
  className,
  children,
  backdrop = true,
}: {
  className?: string;
  children?: ReactNode;
  backdrop?: boolean;
}) {
  return (
    <div className={cn("rmap", className)}>
      {backdrop && <CampusBackdrop />}
      {children}
    </div>
  );
}

/** Teardrop map pin positioned by x/y percentage. */
export function StyledPin({
  x,
  y,
  color,
  glyph,
  size = 28,
}: {
  x: number;
  y: number;
  color: string;
  glyph: ReactNode;
  size?: number;
}) {
  return (
    <div
      className="rmap-pin"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color }}
    >
      <i style={{ fontSize: size * 0.4 }}>{glyph}</i>
    </div>
  );
}

/** Bottom-left legend chip. */
export function MapLegend({
  items,
  className,
}: {
  items: { color: string; label: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute z-[1] flex flex-wrap gap-x-3.5 gap-y-1 rounded-lg border border-line bg-paper px-3 py-2 text-[11.5px]",
        className,
      )}
    >
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span
            className="h-[11px] w-[11px] rounded-full"
            style={{ background: i.color }}
          />
          {i.label}
        </span>
      ))}
    </div>
  );
}
