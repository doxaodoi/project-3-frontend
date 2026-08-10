"use client";

import type { LngLat } from "@/lib/geo";
import { MAPBOX_TOKEN, project } from "@/lib/geo";
import { StyledMap, StyledPin } from "./StyledMap";
import { LiveMapDynamic, MapErrorBoundary } from "./liveMapDynamic";

export function MiniMap({
  label,
  place,
  sub,
  coord,
  color = "#2f6d3a",
  glyph = "✓",
}: {
  label: string;
  place: string;
  sub?: string;
  coord: LngLat;
  color?: string;
  glyph?: string;
}) {
  const { x, y } = project(coord);
  const styled = (
    <StyledMap className="h-full w-full">
      <StyledPin x={x} y={y} color={color} glyph={glyph} size={34} />
    </StyledMap>
  );
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${coord.lat},${coord.lng}`;

  return (
    <div>
      <div className="eyebrow mb-2.5 text-faint">{label}</div>
      <div className="mb-3.5 flex items-center gap-2.5">
        <span
          className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full text-base"
          style={{ background: "#e6efe4", color }}
        >
          {glyph}
        </span>
        <div>
          <div className="font-serif text-lg font-semibold">{place}</div>
          {sub && <div className="text-[12.5px] text-ink3">{sub}</div>}
        </div>
      </div>

      <div className="h-[220px] overflow-hidden rounded-[11px] border border-[#cdc3ac]">
        {MAPBOX_TOKEN ? (
          <MapErrorBoundary fallback={styled}>
            <LiveMapDynamic
              center={coord}
              zoom={15.5}
              points={[{ id: "here", lng: coord.lng, lat: coord.lat, color, glyph }]}
            />
          </MapErrorBoundary>
        ) : (
          styled
        )}
      </div>

      <a
        href={directions}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block w-full rounded-[9px] border border-line py-3 text-center text-[13.5px] font-semibold text-ink2 transition-colors hover:bg-panel"
      >
        Get directions
      </a>
    </div>
  );
}
