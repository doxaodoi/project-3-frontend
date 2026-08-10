"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { items as itemsApi, matches as matchesApi, claims as claimsApi, type ItemDTO, type MatchDTO, type ClaimDTO } from "@/lib/api";
import { mapItem } from "@/lib/mappers";
import { Gallery } from "@/components/item/Gallery";
import { ItemActions } from "@/components/item/ItemActions";
import { Sparkle, MapPin, ChatBubble } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth-context";
import type { Item } from "@/lib/types";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [dto, setDto] = useState<ItemDTO | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [matchList, setMatchList] = useState<MatchDTO[]>([]);
  const [myClaims, setMyClaims] = useState<ClaimDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    itemsApi
      .get(id)
      .then((d) => {
        setDto(d);
        setItem(mapItem(d));
        return Promise.all([
          matchesApi.forItem(id).catch(() => [] as MatchDTO[]),
          claimsApi.mine().catch(() => [] as ClaimDTO[]),
        ]);
      })
      .then(([m, c]) => {
        setMatchList(m);
        setMyClaims(c.filter((cl) => cl.itemId === Number(id)));
      })
      .catch(() => setError("Item not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[980px] px-4 py-20 text-center text-ink3">
        Loading...
      </div>
    );
  }

  if (error || !item || !dto) {
    return (
      <div className="mx-auto max-w-[980px] px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-semibold">Item not found</h1>
        <p className="mt-2 text-sm text-ink3">
          This item may have been removed or resolved.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-semibold text-rust hover:text-rustdark"
        >
          Back to board
        </Link>
      </div>
    );
  }

  const isOwner = user && dto.reporter?.id === user.id;
  const photoUrl = dto.photos?.[0]?.url;

  return (
    <div className="mx-auto max-w-[980px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-5 text-[12.5px] text-ink3">
        <Link href="/" className="hover:text-ink">
          Board
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{item.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left — photos */}
        <div>
          <Gallery item={item} photoUrl={photoUrl} />

          {/* Description */}
          <div className="mt-6">
            <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink3">
              Description
            </h2>
            <p className="text-[14.5px] leading-relaxed text-ink">
              {item.description || "No description provided."}
            </p>
          </div>

          {/* Tags */}
          {dto.tags && dto.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {dto.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line bg-panel px-2.5 py-1 text-[11.5px] font-medium text-ink2"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Smart Matches */}
          {matchList.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rust text-white">
                  <Sparkle size={11} />
                </span>
                <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink3">
                  Smart Matches ({matchList.length})
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {matchList.slice(0, 5).map((m) => {
                  const other =
                    dto.type === "LOST" ? m.foundItem : m.lostItem;
                  return (
                    <Link
                      key={m.id}
                      href={`/items/${other.id}`}
                      className="flex items-center gap-4 rounded-xl border border-line2 bg-card p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex-1">
                        <div className="font-serif text-[15px] font-semibold">
                          {other.title}
                        </div>
                        <div className="mt-0.5 text-[12.5px] text-ink3">
                          {other.category} · {other.location}
                        </div>
                        {m.aiExplanation && (
                          <div className="mt-2 rounded-lg bg-rusttint px-3 py-2 text-[12.5px] leading-relaxed text-rustdark">
                            <ChatBubble size={12} className="mb-0.5 mr-1 inline" />
                            {m.aiExplanation}
                          </div>
                        )}
                      </div>
                      <div className="flex-none text-right">
                        <div className="text-lg font-bold text-rust">
                          {Math.round(m.score * 100)}%
                        </div>
                        <div className="text-[10px] text-ink3">match</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right — details & actions */}
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-serif text-[28px] font-semibold leading-tight text-ink">
              {item.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink3">
              <span className="font-semibold text-ink">
                {item.type === "LOST" ? "Lost" : "Found"}
              </span>
              <span>{item.category}</span>
              {item.color && <span>Color: {item.color}</span>}
              {item.brand && <span>Brand: {item.brand}</span>}
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-line2 bg-card p-4">
            <div className="mb-1 flex items-center gap-2 text-[13px] font-semibold text-ink2">
              <MapPin size={15} />
              {item.type === "LOST" ? "Last seen" : "Found at"}
            </div>
            <div className="text-[14.5px] text-ink">{item.location || "Unknown"}</div>
            {item.heldAt && (
              <div className="mt-2 text-[13px] text-ink3">
                Currently held at: <span className="font-medium text-ink">{item.heldAt}</span>
              </div>
            )}
            <div className="mt-2 text-[12.5px] text-ink3">
              {item.date} · {item.timeAgo}
            </div>
          </div>

          {/* Reporter */}
          <div className="rounded-xl border border-line2 bg-card p-4">
            <div className="mb-1 text-[12.5px] font-semibold text-ink3">
              Reported by
            </div>
            <div className="text-[14.5px] font-medium text-ink">
              {item.postedBy}
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-line2 bg-card p-4">
            <div className="mb-1 text-[12.5px] font-semibold text-ink3">
              Status
            </div>
            <div className="text-[14.5px] font-medium text-ink">
              {item.status === "OPEN"
                ? "Open — still looking"
                : item.status === "MATCHED"
                  ? "Potential match found"
                  : item.status === "CLAIMED"
                    ? "Claim in review"
                    : "Resolved"}
            </div>
          </div>

          {/* AI badge */}
          {item.aiDescribed && (
            <div className="flex items-center gap-2 rounded-lg bg-rusttint px-3 py-2.5 text-[12.5px] text-rustdark">
              <Sparkle size={14} className="text-rust" />
              <span className="font-semibold">Analyzed by Reclaim AI</span>
            </div>
          )}

          {/* Claim status — show if user has submitted a claim */}
          {myClaims.length > 0 && (
            <div className="rounded-xl border border-line2 bg-card p-4">
              <div className="mb-1 text-[12.5px] font-semibold text-ink3">
                Your claim
              </div>
              {myClaims.map((cl) => {
                const statusMap: Record<string, { label: string; color: string }> = {
                  PENDING: { label: "Pending review", color: "text-amber-600 bg-amber-50 border-amber-200" },
                  APPROVED: { label: "Approved", color: "text-green-700 bg-green-50 border-green-200" },
                  REJECTED: { label: "Rejected", color: "text-red-600 bg-red-50 border-red-200" },
                  WITHDRAWN: { label: "Withdrawn", color: "text-ink3 bg-panel border-line" },
                };
                const s = statusMap[cl.status] ?? statusMap.PENDING;
                return (
                  <div key={cl.id} className={`mt-1 inline-block rounded-full border px-3 py-1 text-[12.5px] font-semibold ${s.color}`}>
                    {s.label}
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions — only show for items not owned by the current user and no existing claim */}
          {!isOwner && item.status === "OPEN" && myClaims.length === 0 && (
            <ItemActions item={item} />
          )}

          {isOwner && (
            <div className="rounded-xl border border-line2 bg-panel p-4 text-center text-[13px] text-ink3">
              This is your report.{" "}
              <Link
                href="/my-reports"
                className="font-semibold text-rust hover:text-rustdark"
              >
                Manage it
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
