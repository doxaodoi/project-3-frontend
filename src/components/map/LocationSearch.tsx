"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAPBOX_TOKEN, CAMPUS_CENTER, LOCATION_COORDS } from "@/lib/geo";
import type { LngLat } from "@/lib/geo";
import { MapPin } from "@/components/ui/Icon";

interface Suggestion {
  id: string;
  name: string;
  detail?: string;
  coords: LngLat;
  source: "campus" | "mapbox";
}

/** Known campus locations — always available, no API call needed. */
const CAMPUS_LOCATIONS: Suggestion[] = Object.entries(LOCATION_COORDS)
  // Remove duplicates (e.g. "JQB" and "JQB (Dept. of CS)" point to the same coords)
  .filter(([name]) => !name.includes("("))
  .map(([name, coords]) => ({
    id: `campus-${name}`,
    name,
    detail: "University of Ghana",
    coords,
    source: "campus" as const,
  }));

/**
 * Hybrid location search: local campus locations first (instant),
 * then Mapbox geocoding for broader results.
 */
export function LocationSearch({
  value,
  onSelect,
  label,
  placeholder,
}: {
  value: string;
  onSelect: (name: string, coords: LngLat) => void;
  label: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /** Filter local campus locations by typed query. */
  function filterCampus(q: string): Suggestion[] {
    const lower = q.toLowerCase();
    return CAMPUS_LOCATIONS.filter((s) =>
      s.name.toLowerCase().includes(lower),
    );
  }

  /** Call Mapbox Geocoding API for broader results. */
  const geocodeMapbox = useCallback(async (q: string): Promise<Suggestion[]> => {
    if (!MAPBOX_TOKEN || q.length < 3) return [];

    try {
      const params = new URLSearchParams({
        access_token: MAPBOX_TOKEN,
        proximity: `${CAMPUS_CENTER.lng},${CAMPUS_CENTER.lat}`,
        country: "GH",
        limit: "4",
        language: "en",
      });

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?${params}`,
      );

      if (!res.ok) return [];

      const data = await res.json();
      return (data.features ?? []).map(
        (f: Record<string, unknown>) => ({
          id: f.id as string,
          name: (f.place_name as string).split(",")[0].trim(),
          detail: (f.place_name as string).split(",").slice(1).join(",").trim(),
          coords: {
            lng: (f.center as [number, number])[0],
            lat: (f.center as [number, number])[1],
          },
          source: "mapbox" as const,
        }),
      );
    } catch {
      return [];
    }
  }, []);

  async function search(q: string) {
    if (q.length < 1) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    // Local campus matches appear immediately
    const local = filterCampus(q);
    setSuggestions(local);
    if (local.length > 0) setOpen(true);

    // Also try Mapbox for broader results (if query long enough)
    if (q.length >= 3) {
      setLoading(true);
      const remote = await geocodeMapbox(q);
      // Merge: campus first, then Mapbox (skip duplicates)
      const localNames = new Set(local.map((s) => s.name.toLowerCase()));
      const merged = [
        ...local,
        ...remote.filter((r) => !localNames.has(r.name.toLowerCase())),
      ];
      setSuggestions(merged);
      if (merged.length > 0) setOpen(true);
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (v.trim().length >= 1) {
      debounceRef.current = setTimeout(() => search(v.trim()), 200);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  }

  function handleSelect(s: Suggestion) {
    setQuery(s.name);
    setOpen(false);
    onSelect(s.name, s.coords);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-[7px] block text-[12.5px] font-semibold text-ink2">
        {label}
      </label>
      <div className="relative">
        <MapPin
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink3"
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
            else if (query.trim().length >= 1) search(query.trim());
          }}
          placeholder={placeholder ?? "Type a place name..."}
          autoComplete="off"
          className="w-full rounded-[9px] border border-line bg-card py-3 pl-9 pr-3.5 text-sm text-ink placeholder:text-muted focus:border-rust focus:outline-none"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-rust/30 border-t-rust" />
          </div>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-[260px] w-full overflow-y-auto rounded-[9px] border border-line bg-paper shadow-lg">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-panel"
              >
                <MapPin size={14} className={`mt-0.5 flex-none ${s.source === "campus" ? "text-rust" : "text-ink3"}`} />
                <span className="flex-1">
                  <span className="text-ink">{s.name}</span>
                  {s.detail && (
                    <span className="ml-1.5 text-[11.5px] text-ink3">{s.detail}</span>
                  )}
                  {s.source === "campus" && (
                    <span className="ml-1.5 rounded bg-rusttint px-1.5 py-0.5 text-[10px] font-semibold text-rust">
                      Campus
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
