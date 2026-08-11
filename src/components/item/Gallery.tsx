"use client";

import { useState } from "react";
import type { Item } from "@/lib/types";
import { TypeBadge } from "@/components/ui/Badge";
import { gradientStyle } from "@/components/board/ItemCard";
import { cn } from "@/lib/cn";
import { assetUrl } from "@/lib/api";

interface Props {
  item: Item;
  /** Primary photo URL from the API, if any. */
  photoUrl?: string;
}

export function Gallery({ item, photoUrl }: Props) {
  const photos = item._dto?.photos ?? [];
  const urls = photos.map((p) => assetUrl(p.url)).filter(Boolean) as string[];
  const [active, setActive] = useState(0);

  // If we have real photos, show them; otherwise show gradient fallback
  if (urls.length > 0) {
    return (
      <div>
        <div className="relative h-[280px] overflow-hidden rounded-xl sm:h-[360px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urls[active]}
            alt={item.title}
            className="h-full w-full object-cover"
          />
          <TypeBadge type={item.type} className="absolute left-3.5 top-3.5" />
        </div>
        {urls.length > 1 && (
          <div className="mt-3 flex gap-3">
            {urls.map((url, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Photo ${i + 1}`}
                className={cn(
                  "h-16 w-20 flex-none overflow-hidden rounded-lg border-2 transition-colors",
                  active === i ? "border-rust" : "border-transparent",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback: gradient placeholders
  const thumbs: [string, string][] = [
    item.gradient,
    ["#2f5a66", "#4a8892"],
    ["#3a6570", "#5590a0"],
  ];

  return (
    <div>
      <div
        className="relative h-[280px] overflow-hidden rounded-xl sm:h-[360px]"
        style={gradientStyle(thumbs[active])}
      >
        <TypeBadge type={item.type} className="absolute left-3.5 top-3.5" />
      </div>
      <div className="mt-3 flex gap-3">
        {thumbs.map((g, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Photo ${i + 1}`}
            className={cn(
              "h-16 w-20 flex-none rounded-lg border-2 transition-colors",
              active === i ? "border-rust" : "border-transparent",
            )}
            style={gradientStyle(g)}
          />
        ))}
      </div>
    </div>
  );
}
