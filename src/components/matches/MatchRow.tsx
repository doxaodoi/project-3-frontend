"use client";

import { useState } from "react";
import Link from "next/link";
import type { MatchCandidate } from "@/lib/matches";
import { scoreTone } from "@/lib/matches";
import { gradientStyle } from "@/components/board/ItemCard";
import { TypeBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkle } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function MatchRow({
  match,
  primary = false,
}: {
  match: MatchCandidate;
  primary?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "relative rounded-xl border border-line2 bg-card p-4",
        primary && "shadow-[0_2px_0_#b5451f]",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          className="h-24 w-full flex-none rounded-[9px] sm:h-24 sm:w-[120px]"
          style={gradientStyle(match.gradient)}
        />

        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2.5">
            <TypeBadge type="FOUND" />
            <span className="font-serif text-lg font-semibold sm:text-xl">
              {match.title}
            </span>
          </div>
          <div className="text-[13px] text-ink3">{match.meta}</div>
        </div>

        <div className="flex-none text-center">
          <div
            className={cn(
              "font-serif text-[30px] font-semibold leading-none",
              scoreTone(match.score),
            )}
          >
            {match.score}%
          </div>
          <div className="eyebrow mt-0.5 text-faint">Match</div>
        </div>

        <div className="flex flex-none flex-col gap-2">
          {primary ? (
            <Button size="sm">Confirm match</Button>
          ) : (
            <Link href={`/items/${match.foundItemId}`}>
              <Button variant="secondary" size="sm" className="w-full">
                View item
              </Button>
            </Link>
          )}
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-rustline bg-rusttint px-3 py-2 text-xs font-semibold text-rust"
          >
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rust text-white">
              <Sparkle size={8} />
            </span>
            Why this match?
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute right-2 top-[calc(100%-6px)] z-20 w-[min(400px,calc(100vw-2rem))] rounded-xl bg-ink p-5 text-[#f1ece1] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.55)]">
          <div className="absolute right-[60px] -top-[7px] hidden h-3.5 w-3.5 rotate-45 bg-ink sm:block" />
          <div className="mb-3.5 flex items-center gap-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rust text-white">
              <Sparkle size={11} />
            </span>
            <span className="font-mono text-[11px] tracking-[0.08em] text-[#e0a488]">
              SMART MATCH EXPLAINER
            </span>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-[#e7e0d3]">
            {match.explanation}
          </p>
          <div className="flex flex-col gap-2.5">
            {match.factors.map((f) => (
              <div key={f.label} className="flex items-center gap-2.5">
                <span className="w-[150px] flex-none text-xs text-[#c9c1b2]">
                  {f.label}
                </span>
                <div className="h-1.5 flex-1 rounded-full bg-white/10">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${f.value}%`,
                      backgroundColor: f.tone === "good" ? "#4caf7d" : "#e0a488",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
