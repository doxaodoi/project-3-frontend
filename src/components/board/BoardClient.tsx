"use client";

import { useMemo, useState } from "react";
import type { Item, ItemType } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { ItemCard } from "./ItemCard";
import { BoardMap } from "@/components/map/BoardMap";
import { Search, Grid, MapPin } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type TypeFilter = "ALL" | ItemType;
type Sort = "newest" | "oldest";
type View = "list" | "map";

export function BoardClient({ items }: { items: Item[] }) {
  const [type, setType] = useState<TypeFilter>("ALL");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [view, setView] = useState<View>("list");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = items.filter((item) => {
      if (type !== "ALL" && item.type !== type) return false;
      if (category && item.category !== category) return false;
      if (q) {
        const hay =
          `${item.title} ${item.description} ${item.category} ${item.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === "oldest") result = [...result].reverse();
    return result;
  }, [items, type, category, query, sort]);

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
          <Search size={17} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              view === "map" ? "Search this area…" : 'Search "black backpack near JQB"…'
            }
            className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
        </div>

        <div className="flex overflow-hidden rounded-[9px] border border-line bg-card text-[13px] font-semibold">
          {(["ALL", "LOST", "FOUND"] as TypeFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "px-4 py-[11px] transition-colors",
                type === t ? "bg-ink text-paper" : "text-ink2 hover:bg-panel",
              )}
            >
              {t === "ALL" ? "All" : t === "LOST" ? "Lost" : "Found"}
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
            Try a different search or clear your filters.
          </p>
        </div>
      )}
    </>
  );
}
