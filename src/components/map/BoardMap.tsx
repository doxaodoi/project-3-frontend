"use client";

import Link from "next/link";
import type { Item } from "@/lib/types";
import { MAPBOX_TOKEN, coordsForLocation, project, type LngLat } from "@/lib/geo";
import { StyledMap, StyledPin, MapLegend } from "./StyledMap";
import { LiveMapDynamic, MapErrorBoundary } from "./liveMapDynamic";
import type { MapPoint } from "./LiveMap";
import { gradientStyle } from "@/components/board/ItemCard";
import { TypeBadge } from "@/components/ui/Badge";

const LEGEND = [
  { color: "#221c15", label: "Lost" },
  { color: "#2f6d3a", label: "Found" },
  { color: "#b5451f", label: "Has match" },
];

function pinMeta(item: Item) {
  if (item.smartMatches) return { color: "#b5451f", glyph: "✦" };
  return item.type === "LOST"
    ? { color: "#221c15", glyph: "L" }
    : { color: "#2f6d3a", glyph: "F" };
}

/** Use actual lat/lng from the item DTO if available, else fall back to location name lookup. */
function itemCoords(it: Item): LngLat {
  const dto = it._dto;
  if (dto?.latitude != null && dto?.longitude != null) {
    return { lat: dto.latitude, lng: dto.longitude };
  }
  return coordsForLocation(it.location);
}

export function BoardMap({ items }: { items: Item[] }) {
  const styled = (
    <StyledMap className="h-full w-full">
      {items.map((it) => {
        const { x, y } = project(itemCoords(it));
        const { color, glyph } = pinMeta(it);
        return (
          <StyledPin
            key={it.id}
            x={x}
            y={y}
            color={color}
            glyph={glyph}
            size={it.smartMatches ? 34 : 28}
          />
        );
      })}
    </StyledMap>
  );

  const points: MapPoint[] = items.map((it) => {
    const c = itemCoords(it);
    const { color, glyph } = pinMeta(it);
    return { id: it.id, lng: c.lng, lat: c.lat, color, glyph };
  });

  return (
    <div className="my-5 flex overflow-hidden rounded-[14px] border border-line2">
      <div className="relative h-[520px] flex-1">
        {MAPBOX_TOKEN ? (
          <MapErrorBoundary fallback={styled}>
            <LiveMapDynamic points={points} />
          </MapErrorBoundary>
        ) : (
          styled
        )}
        <MapLegend items={LEGEND} className="bottom-4 left-4" />
      </div>

      <aside className="hidden w-80 flex-none flex-col border-l border-line bg-paper p-[18px] lg:flex">
        <div className="eyebrow mb-3.5 text-faint">{items.length} items in view</div>
        <div className="flex flex-col overflow-y-auto">
          {items.map((it) => (
            <Link
              key={it.id}
              href={`/items/${it.id}`}
              className="flex gap-3 border-b border-panel py-3 last:border-0"
            >
              <div
                className="h-14 w-14 flex-none rounded-[9px]"
                style={gradientStyle(it.gradient)}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <TypeBadge type={it.type} />
                  {it.smartMatches ? (
                    <span className="text-[11px] font-semibold text-rust">
                      ✦ match
                    </span>
                  ) : null}
                </div>
                <div className="mt-0.5 font-serif text-base font-semibold">
                  {it.title}
                </div>
                <div className="text-[11.5px] text-ink3">
                  {it.location} · {it.timeAgo}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
