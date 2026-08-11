"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Item } from "@/lib/types";
import { items as itemsApi } from "@/lib/api";
import { mapItem } from "@/lib/mappers";
import { StatusChip, statusTone } from "@/components/ui/Badge";
import { gradientStyle } from "@/components/board/ItemCard";
import { Skeleton } from "@/components/ui/Skeleton";

interface Props {
  /** Pass items directly (dashboard already fetches them). */
  items?: Item[];
}

export function ReportsList({ items: propItems }: Props) {
  const [reports, setReports] = useState<Item[]>(propItems ?? []);
  const [loading, setLoading] = useState(!propItems);

  // If no items passed as props, fetch from API
  useEffect(() => {
    if (propItems) return;
    itemsApi
      .mine()
      .then((list) => setReports(list.map(mapItem)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [propItems]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 px-[18px] py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3.5 py-2">
            <Skeleton className="h-11 w-11 flex-none rounded-lg" />
            <div className="flex-1">
              <Skeleton className="mb-1.5 h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="px-[18px] py-8 text-center text-sm text-ink3">
        No reports yet.{" "}
        <Link href="/report" className="font-semibold text-rust hover:text-rustdark">
          Report an item →
        </Link>
      </div>
    );
  }

  return (
    <div className="px-[18px] pb-3 pt-1.5">
      {reports.map((r, i) => (
        <Link
          key={r.id}
          href={`/items/${r.id}`}
          className="flex items-center gap-3.5 py-3.5"
          style={
            i < reports.length - 1
              ? { borderBottom: "1px solid #f1ece1" }
              : undefined
          }
        >
          <div
            className="h-11 w-11 flex-none rounded-lg"
            style={gradientStyle(r.gradient)}
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-ink">
              {r.title}
            </div>
            <div className="text-xs text-ink3">
              {r.type === "LOST" ? "Lost" : "Found"} · {r.location}
            </div>
          </div>
          <StatusChip tone={statusTone(r.status)}>{r.status}</StatusChip>
        </Link>
      ))}
    </div>
  );
}
