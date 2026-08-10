export type LngLat = { lng: number; lat: number };

/** Publishable Mapbox token (pk.*). Empty → styled fallback map is used. */
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

/** University of Ghana, Legon. */
export const CAMPUS_CENTER: LngLat = { lng: -0.1885, lat: 5.652 };

/** Bounding box used to project lng/lat into the styled fallback map. */
const BBOX = { minLng: -0.198, maxLng: -0.184, minLat: 5.648, maxLat: 5.6575 };

/** Approximate coordinates for the campus locations used across the app. */
export const LOCATION_COORDS: Record<string, LngLat> = {
  "Balme Library": { lng: -0.1866, lat: 5.651 },
  "Security Office": { lng: -0.1869, lat: 5.656 },
  "Night Ward Lodge": { lng: -0.19, lat: 5.654 },
  JQB: { lng: -0.188, lat: 5.6495 },
  "JQB (Dept. of CS)": { lng: -0.188, lat: 5.6495 },
  "Dept. of Physics": { lng: -0.193, lat: 5.652 },
  "Bush Canteen": { lng: -0.1885, lat: 5.6535 },
  "N-Block": { lng: -0.1955, lat: 5.65 },
  "N Block": { lng: -0.1955, lat: 5.65 },
  "Dept. of Computer Eng.": { lng: -0.195, lat: 5.6555 },
  "Great Hall": { lng: -0.1893, lat: 5.6502 },
  "Main Gate": { lng: -0.188, lat: 5.656 },
  "Legon Hall": { lng: -0.1862, lat: 5.6492 },
  "Akuafo Hall": { lng: -0.191, lat: 5.648 },
  "Pentagon Hall": { lng: -0.19, lat: 5.653 },
  "Science Block": { lng: -0.1855, lat: 5.654 },
  "Athletic Oval": { lng: -0.191, lat: 5.6515 },
};

export function coordsForLocation(name?: string): LngLat {
  if (name && LOCATION_COORDS[name]) return LOCATION_COORDS[name];
  // Loose match (handles "Balme Library desk", "Dept. of Physics office", …)
  if (name) {
    const key = Object.keys(LOCATION_COORDS).find((k) => name.startsWith(k));
    if (key) return LOCATION_COORDS[key];
  }
  return CAMPUS_CENTER;
}

const clamp = (n: number) => Math.max(4, Math.min(96, n));

/** Project a coordinate to x/y percentages within the styled fallback map. */
export function project({ lng, lat }: LngLat): { x: number; y: number } {
  const x = ((lng - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)) * 100;
  const y = ((BBOX.maxLat - lat) / (BBOX.maxLat - BBOX.minLat)) * 100;
  return { x: clamp(x), y: clamp(y) };
}

/** Inverse of project — used by the styled pin-picker to report a coordinate. */
export function unproject(xPct: number, yPct: number): LngLat {
  const lng = BBOX.minLng + (xPct / 100) * (BBOX.maxLng - BBOX.minLng);
  const lat = BBOX.maxLat - (yPct / 100) * (BBOX.maxLat - BBOX.minLat);
  return { lng, lat };
}

/** Nearest known campus location to a coordinate (for the pin-picker readout). */
export function nearestLocation({ lng, lat }: LngLat): string {
  let best = "";
  let bestD = Infinity;
  for (const [name, c] of Object.entries(LOCATION_COORDS)) {
    const d = (c.lng - lng) ** 2 + (c.lat - lat) ** 2;
    if (d < bestD) {
      bestD = d;
      best = name;
    }
  }
  return best;
}
