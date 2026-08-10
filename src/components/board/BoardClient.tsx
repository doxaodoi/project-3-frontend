"use client";

import { useMemo, useState, useCallback } from "react";
import type { Item, ItemType } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { ItemCard } from "./ItemCard";
import { BoardMap } from "@/components/map/BoardMap";
import { Search, Grid, MapPin, Sparkle } from "@/components/ui/Icon";
import { ai as aiApi } from "@/lib/api";
import { cn } from "@/lib/cn";

type TypeFilter = "ALL" | ItemType | "RESOLVED";
type Sort = "newest" | "oldest";
type View = "list" | "map";

/** Map AI category names to the frontend CATEGORIES list. */
function matchCategory(aiCat: string): string {
  const lower = aiCat.toLowerCase();
  const match = CATEGORIES.find((c) => c.toLowerCase() === lower);
  if (match) return match;
  // Fuzzy: "electronics" → "Electronics", "bags" → "Bags"
  const partial = CATEGORIES.find((c) => c.toLowerCase().includes(lower) || lower.includes(c.toLowerCase()));
  return partial ?? "";
}

export function BoardClient({ items }: { items: Item[] }) {
  const [type, setType] = useState<TypeFilter>("ALL");
  const [query, setQuery] = useState("");
  const [textFilter, setTextFilter] = useState("");
  const [category, setCategory] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [view, setView] = useState<View>("list");
  const [aiParsing, setAiParsing] = useState(false);
  const [aiParsed, setAiParsed] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const handleAiSearch = useCallback(async () => {
    const q = query.trim();
    if (!q || q.length < 5) {
      // Too short for AI — use as plain text search
      setTextFilter(q);
      setAiParsed(false);
      setAiSummary("");
      return;
    }

    setAiParsing(true);
    try {
      const res = await aiApi.parseSearch(q);
      if (res.aiParsed && Object.keys(res.filters).length > 0) {
        const f = res.filters;

        // Apply parsed filters
        if (f.type === "LOST" || f.type === "FOUND") {
          setType(f.type);
        }
        if (f.category) {
          setCategory(matchCategory(f.category));
        }
        if (f.color) {
          setColorFilter(f.color.toLowerCase());
        }
        if (f.q) {
          setTextFilter(f.q);
        } else {
          setTextFilter("");
        }

        // Build a summary of what AI understood
        const parts: string[] = [];
        if (f.type) parts.push(f.type.toLowerCase());
        if (f.category) parts.push(f.category);
        if (f.color) parts.push(f.color);
        if (f.location) parts.push("near " + f.location);
        if (f.q) parts.push(`"${f.q}"`);
        setAiSummary(parts.join(" · "));
        setAiParsed(true);
      } else {
        // AI couldn't parse — fall back to text search
        setTextFilter(q);
        setAiParsed(false);
        setAiSummary("");
      }
    } catch {
      // AI unavailable — plain text search
      setTextFilter(q);
      setAiParsed(false);
      setAiSummary("");
    }
    setAiParsing(false);
  }, [query]);

  function clearAiSearch() {
    setType("ALL");
    setCategory("");
    setColorFilter("");
    setTextFilter("");
    setQuery("");
    setAiParsed(false);
    setAiSummary("");
  }

  const filtered = useMemo(() => {
    const q = textFilter.trim().toLowerCase();
    const col = colorFilter.trim().toLowerCase();
    let result = items.filter((item) => {
      // Hide resolved items unless the "Resolved" filter is active
      if (type !== "RESOLVED" && item.status === "RESOLVED") return false;
      if (type === "RESOLVED" && item.status !== "RESOLVED") return false;
      if (type !== "ALL" && type !== "RESOLVED" && item.type !== type) return false;
      if (category && item.category !== category) return false;
      if (col && item.color && !item.color.toLowerCase().includes(col)) return false;
      if (q) {
        const hay =
          `${item.title} ${item.description} ${item.category} ${item.location} ${item.brand ?? ""} ${item.color ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === "oldest") result = [...result].reverse();
    return result;
  }, [items, type, category, colorFilter, textFilter, sort]);

  return (
    <>
      {/* Filter bar */}
      <div className="-mx-4 flex flex-wrap items-center gap-3 border-b border-line bg-panel px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {/* List / Map view toggle */}
        <div className="flex overflow-hidden rounded-[9px] border border-line bg-card text-[13px] font-semibold">
          <button
            onClick={() => setView("list")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-[11px] transition-colors",
              view === "list" ? "bg-ink text-paper" : "text-ink2 hover:bg-panel",
            )}
          >
            <Grid size={15} /> List
          </button>
          <button
            onClick={() => setView("map")}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-[11px] transition-colors",
              view === "map" ? "bg-ink text-paper" : "text-ink2 hover:bg-panel",
            )}
          >
            <MapPin size={15} /> Map
          </button>
        </div>

        <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-[9px] border border-line bg-card px-3.5 py-[11px]">
          {aiParsing ? (
            <div className="h-[17px] w-[17px] animate-spin rounded-full border-2 border-rust/30 border-t-rust" />
          ) : (
            <Search size={17} className="text-muted" />
          )}
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              // If user clears the input, reset everything
              if (!e.target.value.trim()) {
                clearAiSearch();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAiSearch();
              }
            }}
            placeholder='Try "black phone lost near JQB last week"'
            className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
          {query.trim().length >= 5 && !aiParsing && (
            <button
              onClick={handleAiSearch}
              className="flex flex-none items-center gap-1 rounded-md bg-rust px-2 py-1 text-[11px] font-semibold text-paper hover:bg-rustdark"
              title="AI Search"
            >
              <Sparkle size={11} /> Search
            </button>
          )}
        </div>

        <div className="flex overflow-hidden rounded-[9px] border border-line bg-card text-[13px] font-semibold">
          {(["ALL", "LOST", "FOUND", "RESOLVED"] as TypeFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "px-4 py-[11px] transition-colors",
                type === t ? "bg-ink text-paper" : "text-ink2 hover:bg-panel",
              )}
            >
              {t === "ALL" ? "All" : t === "LOST" ? "Lost" : t === "FOUND" ? "Found" : "Resolved"}
            </button>
          ))}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="cursor-pointer rounded-[9px] border border-line bg-card px-4 py-[11px] text-[13px] font-medium text-ink2 focus:border-rust focus:outline-none"
        >
          <option value="">Category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="cursor-pointer rounded-[9px] border border-line bg-card px-4 py-[11px] text-[13px] font-medium text-ink2 focus:border-rust focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* AI search result banner */}
      {aiParsed && aiSummary && (
        <div className="flex items-center gap-3 border-b border-rustline bg-rusttint px-4 py-3 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8">
          <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-rust text-white">
            <Sparkle size={11} />
          </span>
          <span className="flex-1 text-[13px] text-rustdark">
            <span className="font-semibold">AI understood:</span> {aiSummary}
          </span>
          <button
            onClick={clearAiSearch}
            className="text-[12px] font-semibold text-rust hover:text-rustdark"
          >
            Clear
          </button>
        </div>
      )}

      {view === "map" ? (
        <BoardMap items={filtered} />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 py-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="font-serif text-2xl font-semibold text-ink">
            Nothing matches yet
          </div>
          <p className="mt-2 text-sm text-ink3">
            {aiParsed
              ? "AI couldn't find items matching that description. Try different words."
              : "Try a different search or clear your filters."}
          </p>
          {aiParsed && (
            <button
              onClick={clearAiSearch}
              className="mt-3 text-sm font-semibold text-rust hover:text-rustdark"
            >
              Clear AI search
            </button>
          )}
        </div>
      )}
    </>
  );
}
