"use client";

import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import type { LayerProps } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN, CAMPUS_CENTER, type LngLat } from "@/lib/geo";

const MAP_STYLE = "mapbox://styles/mapbox/light-v11";

export type MapPoint = LngLat & {
  id: string;
  color: string;
  glyph: string;
};

function PinDot({ color, glyph }: { color: string; glyph: string }) {
  return (
    <span
      className="flex items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-md"
      style={{ width: 24, height: 24, background: color }}
    >
      {glyph}
    </span>
  );
}

const heatLayer: LayerProps = {
  id: "loss-heat",
  type: "heatmap",
  paint: {
    "heatmap-weight": ["coalesce", ["get", "weight"], 1],
    "heatmap-intensity": 1.1,
    "heatmap-radius": 46,
    "heatmap-opacity": 0.75,
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0, "rgba(181,69,31,0)",
      0.3, "rgba(200,112,63,0.5)",
      0.7, "rgba(181,69,31,0.75)",
      1, "rgba(143,52,22,0.9)",
    ],
  },
};

interface LiveMapProps {
  className?: string;
  zoom?: number;
  center?: LngLat;
  /** Marker points (board / mini-map). */
  points?: MapPoint[];
  /** Draggable pin mode (report pin-picker). */
  pick?: { value: LngLat; onChange: (c: LngLat) => void };
  /** Heatmap points (admin). */
  heat?: (LngLat & { weight?: number })[];
}

export default function LiveMap({
  className,
  zoom = 14.4,
  center = CAMPUS_CENTER,
  points,
  pick,
  heat,
}: LiveMapProps) {
  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: (pick?.value ?? center).lng,
        latitude: (pick?.value ?? center).lat,
        zoom,
      }}
      mapStyle={MAP_STYLE}
      style={{ width: "100%", height: "100%" }}
      attributionControl={false}
      onClick={pick ? (e) => pick.onChange({ lng: e.lngLat.lng, lat: e.lngLat.lat }) : undefined}
    >
      {points?.map((p) => (
        <Marker key={p.id} longitude={p.lng} latitude={p.lat} anchor="center">
          <PinDot color={p.color} glyph={p.glyph} />
        </Marker>
      ))}

      {pick && (
        <Marker
          longitude={pick.value.lng}
          latitude={pick.value.lat}
          anchor="bottom"
          draggable
          onDrag={(e) => pick.onChange({ lng: e.lngLat.lng, lat: e.lngLat.lat })}
          onDragEnd={(e) => pick.onChange({ lng: e.lngLat.lng, lat: e.lngLat.lat })}
        >
          <PinDot color="#b5451f" glyph="✦" />
        </Marker>
      )}

      {heat && (
        <Source
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: heat.map((h) => ({
              type: "Feature",
              geometry: { type: "Point", coordinates: [h.lng, h.lat] },
              properties: { weight: h.weight ?? 1 },
            })),
          }}
        >
          <Layer {...heatLayer} />
        </Source>
      )}
    </Map>
  );
}
