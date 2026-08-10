"use client";

import { useRef } from "react";
import type { LngLat } from "@/lib/geo";
import { MAPBOX_TOKEN, project, unproject } from "@/lib/geo";
import { StyledMap, StyledPin } from "./StyledMap";
import { LiveMapDynamic, MapErrorBoundary } from "./liveMapDynamic";
import { MapPin } from "@/components/ui/Icon";

export function PinPicker({
  mode,
  value,
  onChange,
  place,
}: {
  mode: "lost" | "found";
  value: LngLat;
  onChange: (c: LngLat) => void;
  place: string;
}) {
  const { x, y } = project(value);
  const dragging = useRef(false);

  function coordFromPointer(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100));
    const py = Math.max(2, Math.min(98, ((e.clientY - rect.top) / rect.height) * 100));
    onChange(unproject(px, py));
  }

  const styled = (
    <StyledMap className="h-full w-full">
      {/* Circle + pin sit under the drag surface so the cursor drives them live */}
      <div
        className="absolute z-[1] rounded-full border-2 border-dashed border-rust/40 bg-rust/[0.08]"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: 120,
          height: 120,
          transform: "translate(-50%,-50%)",
        }}
      />
      <StyledPin x={x} y={y} color="#b5451f" glyph="✦" size={38} />
      <div
        className="absolute inset-0 z-[2] cursor-grab touch-none active:cursor-grabbing"
        role="button"
        aria-label="Drag to place the pin"
        onPointerDown={(e) => {
          dragging.current = true;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {}
          coordFromPointer(e);
        }}
        onPointerMove={(e) => {
          if (dragging.current) coordFromPointer(e);
        }}
        onPointerUp={(e) => {
          dragging.current = false;
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {}
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      />
    </StyledMap>
  );

  return (
    <div>
      <div className="mb-1 font-serif text-[19px] font-semibold">
        Where did you {mode === "lost" ? "lose" : "find"} it?
      </div>
      <div className="mb-3.5 text-[13px] text-ink3">
        Drop a pin — nearby matches are ranked by distance.
      </div>

      <div className="h-[240px] overflow-hidden rounded-[11px] border border-[#cdc3ac]">
        {MAPBOX_TOKEN ? (
          <MapErrorBoundary fallback={styled}>
            <LiveMapDynamic pick={{ value, onChange }} zoom={15} center={value} />
          </MapErrorBoundary>
        ) : (
          styled
        )}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-[9px] bg-panel px-3.5 py-2.5">
        <span className="flex items-center gap-1.5 text-[13px]">
          <MapPin size={15} className="text-rust" />
          <b>{place}</b>
        </span>
        <span className="text-xs font-semibold text-rust">Adjust</span>
      </div>
    </div>
  );
}
