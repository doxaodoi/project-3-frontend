"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  items as itemsApi,
  matches as matchesApi,
  type ItemDTO,
  type MatchDTO,
} from "@/lib/api";
import { Sparkle, ChatBubble } from "@/components/ui/Icon";

export default function ItemMatchesPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemDTO | null>(null);
  const [matchList, setMatchList] = useState<MatchDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      itemsApi.get(id),
      matchesApi.forItem(id).catch(() => [] as MatchDTO[]),
    ])
      .then(([i, m]) => {
        setItem(i);
        setMatchList(m);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[740px] px-4 py-20 text-center text-ink3">
        Loading matches...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-[740px] px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-semibold">Item not found</h1>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-semibold text-rust hover:text-rustdark"
        >
          Back to board
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[740px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-5 text-[12.5px] text-ink3">
        <Link href="/" className="hover:text-ink">
          Board
        </Link>
        <span className="mx-1.5">/</span>
        <Link href={`/items/${id}`} className="hover:text-ink">
          {item.title}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">Matches</span>
      </nav>

      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rust text-white">
          <Sparkle size={14} />
        </span>
        <h1 className="font-serif text-[26px] font-semibold">
          Smart Matches for &ldquo;{item.title}&rdquo;
        </h1>
      </div>

      {matchList.length === 0 ? (
        <div className="py-16 text-center">
          <div className="font-serif text-xl font-semibold text-ink">
            No matches yet
          </div>
          <p className="mt-2 text-sm text-ink3">
            We&apos;ll notify you as soon as a potential match appears.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {matchList.map((m) => {
            const other =
              item.type === "LOST" ? m.foundItem : m.lostItem;
            return (
              <Link
                key={m.id}
                href={`/items/${other.id}`}
                className="flex items-start gap-4 rounded-xl border border-line2 bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex-1">
                  <div className="font-serif text-[17px] font-semibold">
                    {other.title}
                  </div>
                  <div className="mt-1 text-[13px] text-ink3">
                    {other.category} · {other.location} · {other.type === "LOST" ? "Lost" : "Found"}
                  </div>
                  {other.description && (
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink2">
                      {other.description.length > 200
                        ? other.description.slice(0, 200) + "..."
                        : other.description}
                    </p>
                  )}
                  {m.aiExplanation && (
                    <div className="mt-3 rounded-lg bg-rusttint px-3 py-2.5 text-[12.5px] leading-relaxed text-rustdark">
                      <ChatBubble size={12} className="mb-0.5 mr-1 inline" />
                      {m.aiExplanation}
                    </div>
                  )}
                </div>
                <div className="flex-none pt-1 text-right">
                  <div className="text-2xl font-bold text-rust">
                    {Math.round(m.score * 100)}%
                  </div>
                  <div className="text-[11px] text-ink3">match score</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
