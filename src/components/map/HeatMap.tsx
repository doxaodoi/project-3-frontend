"use client";

import { MAPBOX_TOKEN, LOCATION_COORDS, project } from "@/lib/geo";
import { StyledMap } from "./StyledMap";
import { LiveMapDynamic, MapErrorBoundary } from "./liveMapDynamic";

export interface Hotspot {
  location: string;
  count: number;
}

export function HeatMap({ hotspots }: { hotspots: Hotspot[] }) {
  const max = Math.max(...hotspots.map((h) => h.count));

  const styled = (
    <StyledMap className="h-full w-full">
      {hotspots.map((h) => {
        const c = LOCATION_COORDS[h.location];
        if (!c) return null;
        const { x, y } = project(c);
        const scale = 0.45 + (h.count / max) * 0.55;
        const px = Math.round(240 * scale);
        const opacity = 0.35 + (h.count / max) * 0.3;
        return (
          <div
            key={h.location}
            className="pointer-events-none absolute z-[1] rounded-full blur-[4px]"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: px,
              height: px,
              transform: "translate(-50%,-50%)",
              background: `radial-gradient(circle, rgba(181,69,31,${opacity}), rgba(181,69,31,0) 68%)`,
            }}
          />
        );
      })}
      {hotspots
        .filter((h) => h.count >= max * 0.55)
        .map((h) => {
          const c = LOCATION_COORDS[h.location];
          if (!c) return null;
          const { x, y } = project(c);
          return (
            <div
              key={`lbl-${h.location}`}
              className="absolute z-[2] whitespace-nowrap rounded-full bg-ink px-[11px] py-1.5 text-[11.5px] font-semibold text-paper"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
            >
              {h.location} · {h.count}
            </div>
          );
        })}
    </StyledMap>
  );

  const heat = hotspots
    .map((h) => {
      const c = LOCATION_COORDS[h.location];
      return c ? { ...c, weight: h.count / max } : null;
    })
    .filter(Boolean) as { lng: number; lat: number; weight: number }[];

  return (
    <div className="relative h-[440px] overflow-hidden rounded-xl border border-[#cdc3ac]">
      {MAPBOX_TOKEN ? (
        <MapErrorBoundary fallback={styled}>
          <LiveMapDynamic heat={heat} zoom={14.2} />
        </MapErrorBoundary>
      ) : (
        styled
      )}

      {/* Density legend */}
      <div className="absolute bottom-4 right-4 z-[3] rounded-lg border border-line bg-paper px-3 py-2.5 text-[11px]">
        <div className="mb-1.5 font-mono tracking-[0.06em] text-faint">DENSITY</div>
        <div
          className="h-[9px] w-[150px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(181,69,31,0.15), #b5451f)",
          }}
        />
        <div className="mt-1 flex justify-between text-ink3">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
