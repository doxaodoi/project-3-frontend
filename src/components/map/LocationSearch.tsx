"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAPBOX_TOKEN, CAMPUS_CENTER } from "@/lib/geo";
import type { LngLat } from "@/lib/geo";
import { MapPin } from "@/components/ui/Icon";

interface Suggestion {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
}

/**
 * Mapbox-powered location search input.
 * Types a place name → geocodes via Mapbox → returns exact coordinates.
 * Biased toward UG Legon campus via proximity.
 * Falls back to plain text input when no Mapbox token is set.
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

  const geocode = useCallback(async (q: string) => {
    if (!MAPBOX_TOKEN) return; // no token — plain text only
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Bias results toward UG Legon campus via proximity only (no bbox —
      // bbox filters out POIs that Mapbox hasn't indexed at that exact area)
      const params = new URLSearchParams({
        access_token: MAPBOX_TOKEN,
        proximity: `${CAMPUS_CENTER.lng},${CAMPUS_CENTER.lat}`,
        country: "GH",
        limit: "6",
        language: "en",
      });

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?${params}`,
      );

      if (!res.ok) throw new Error("Geocoding request failed");

      const data = await res.json();
      const features: Suggestion[] = (data.features ?? []).map(
        (f: Record<string, unknown>) => ({
          id: f.id as string,
          place_name: f.place_name as string,
          center: f.center as [number, number],
        }),
      );

      setSuggestions(features);
      setOpen(features.length > 0);
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    // Commit the typed value immediately as plain text (no coords)
    onSelect(v, CAMPUS_CENTER);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (v.trim().length >= 2) {
      debounceRef.current = setTimeout(() => geocode(v.trim()), 350);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  }

  function handleSelect(s: Suggestion) {
    // Use the short name (first part before the comma) as the stored location name
    const shortName = s.place_name.split(",")[0].trim();
    setQuery(shortName);
    setOpen(false);
    onSelect(shortName, { lng: s.center[0], lat: s.center[1] });
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
        <ul className="absolute z-30 mt-1 max-h-[220px] w-full overflow-y-auto rounded-[9px] border border-line bg-paper shadow-lg">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-panel"
              >
                <MapPin size={14} className="mt-0.5 flex-none text-rust" />
                <span className="text-ink">{s.place_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!MAPBOX_TOKEN && (
        <p className="mt-1 text-[11.5px] text-ink3">
          Type the location name — pin it on the map below for precision.
        </p>
      )}
    </div>
  );
}
