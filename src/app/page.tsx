"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { BoardClient } from "@/components/board/BoardClient";
import { BoardGridSkeleton } from "@/components/ui/Skeleton";
import { items as itemsApi } from "@/lib/api";
import { mapItem } from "@/lib/mappers";
import type { Item } from "@/lib/types";

export default function Home() {
  const [list, setList] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    itemsApi
      .list({ size: 50 })
      .then((page) => {
        setList(page.content.map(mapItem));
        setTotal(page.totalElements);
      })
      .catch(() => {
        setList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      {/* Masthead */}
      <section className="border-b border-line py-8 sm:py-9">
        <div className="eyebrow mb-3 text-rust">
          Campus Notice Board · {total} open items
        </div>
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <h1 className="max-w-[640px] font-serif text-[32px] font-medium leading-[1.02] tracking-[-0.02em] sm:text-[46px]">
            Lost something? Someone may have already found it.
          </h1>
          <Link href="/report" className="flex-none">
            <Button size="lg">+ Report an item</Button>
          </Link>
        </div>
      </section>

      {loading ? (
        <BoardGridSkeleton />
      ) : (
        <BoardClient items={list} />
      )}
    </AppShell>
  );
}
