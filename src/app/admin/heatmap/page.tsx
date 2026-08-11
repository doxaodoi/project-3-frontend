"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { HeatMap, type Hotspot } from "@/components/map/HeatMap";
import { admin as adminApi, type AdminStats } from "@/lib/api";
import { cn } from "@/lib/cn";

type Filter = "all" | "lost" | "found";

export default function HeatmapPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const source =
    filter === "lost"
      ? stats?.byLocationLost
      : filter === "found"
        ? stats?.byLocationFound
        : stats?.byLocation;

  const hotspots: Hotspot[] = Object.entries(source ?? {}).map(
    ([location, count]) => ({ location, count: Number(count) }),
  );

  return (
    <AdminShell active="Heatmap">
      <div className="flex flex-col items-start justify-between gap-4 pt-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-[26px] font-medium tracking-[-0.01em] sm:text-[28px]">
            Where things get lost
          </h1>
          <p className="mt-1.5 text-[13.5px] text-ink3">
            Hotspots help you place drop-boxes and signage.
          </p>
        </div>
        <div className="flex overflow-hidden rounded-[9px] border border-line bg-card text-[13px] font-semibold">
          {(["all", "lost", "found"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "px-[15px] py-[9px] capitalize transition-colors",
                filter === f
                  ? "bg-ink text-paper"
                  : "text-ink2 hover:bg-panel",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="py-4">
        {loading ? (
          <div className="flex h-[440px] items-center justify-center rounded-xl border border-line text-ink3">
            Loading heatmap...
          </div>
        ) : hotspots.length === 0 ? (
          <div className="flex h-[440px] items-center justify-center rounded-xl border border-line text-ink3">
            No {filter === "all" ? "" : filter + " "}items with a location yet.
          </div>
        ) : (
          <HeatMap hotspots={hotspots} />
        )}
      </div>
    </AdminShell>
  );
}
