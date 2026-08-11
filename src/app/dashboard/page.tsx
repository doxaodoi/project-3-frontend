"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { ReportsList } from "@/components/dashboard/ReportsList";
import { Sparkle, Check, ChatBubble, Grid } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth-context";
import {
  items as itemsApi,
  notifications as notifApi,
  claims as claimsApi,
  type ItemDTO,
} from "@/lib/api";
import { mapItem } from "@/lib/mappers";

export default function DashboardPage() {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState<ItemDTO[]>([]);
  const [claimCount, setClaimCount] = useState(0);
  const [unread, setUnread] = useState(0);
  const [matchTotal, setMatchTotal] = useState(0);

  useEffect(() => {
    itemsApi.mine().then((list) => {
      setMyItems(list);
      setMatchTotal(list.reduce((s, i) => s + i.matchCount, 0));
    }).catch(() => {});

    claimsApi.mine().then((c) => {
      setClaimCount(c.filter((cl) => cl.status === "PENDING").length);
    }).catch(() => {});

    notifApi.unreadCount().then((r) => setUnread(r.count)).catch(() => {});
  }, []);

  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  // Best match for the sidebar callout
  const bestMatchItem = myItems.find((i) => i.matchCount > 0 && i.type === "LOST");

  const reports = myItems.map(mapItem);

  return (
    <AppShell>
      <div className="pt-8">
        <h1 className="font-serif text-[28px] font-medium tracking-[-0.01em] sm:text-[32px]">
          Good afternoon, {firstName}
        </h1>
        <p className="mt-1.5 text-sm text-ink3">
          Here&apos;s what&apos;s happening with your items.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 py-5 lg:grid-cols-4">
        <StatCard label="My reports" value={myItems.length} />
        <StatCard label="Open claims" value={claimCount} />
        <StatCard label="Suggested matches" value={matchTotal} tone="accent" />
        <StatCard label="Unread" value={unread} />
      </div>

      <div className="grid grid-cols-1 gap-5 pb-16 lg:grid-cols-[1.5fr_1fr]">
        {/* My reports */}
        <div className="overflow-hidden rounded-xl border border-line2 bg-card">
          <div className="flex items-center justify-between border-b border-[#ede4d5] px-[18px] py-4">
            <span className="font-serif text-lg font-semibold">My reports</span>
            <Link
              href="/my-reports"
              className="text-[13px] font-semibold text-rust hover:text-rustdark"
            >
              View all
            </Link>
          </div>
          <ReportsList items={reports} />
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-5">
          {bestMatchItem && (
            <div className="rounded-xl bg-ink p-[18px] text-[#f1ece1]">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-rust text-white">
                  <Sparkle size={10} />
                </span>
                <span className="font-mono text-[11px] tracking-[0.08em] text-[#e0a488]">
                  TOP SUGGESTED MATCH
                </span>
              </div>
              <div className="mb-1 font-serif text-lg font-semibold">
                {bestMatchItem.matchCount} match{bestMatchItem.matchCount > 1 ? "es" : ""} for {bestMatchItem.title}
              </div>
              <div className="mb-3.5 text-[12.5px] text-[#c9c1b2]">
                Review suggested matches for your lost item
              </div>
              <Link
                href={`/items/${bestMatchItem.id}/matches`}
                className="inline-block rounded-lg bg-rust px-4 py-2.5 text-[13px] font-semibold text-paper hover:bg-rustdark"
              >
                Review match →
              </Link>
            </div>
          )}

          <div className="rounded-xl border border-line2 bg-card p-[18px]">
            <div className="mb-3 font-serif text-[17px] font-semibold">
              Quick actions
            </div>
            <div className="flex flex-col gap-3 text-[13px] text-ink2">
              <Link href="/report" className="flex items-center gap-2.5 hover:text-rust">
                <Sparkle size={15} className="flex-none text-rust" />
                <span>Report a new item</span>
              </Link>
              <Link href="/messages" className="flex items-center gap-2.5 hover:text-rust">
                <ChatBubble size={15} className="flex-none text-rust" />
                <span>View messages</span>
              </Link>
              <Link href="/notifications" className="flex items-center gap-2.5 hover:text-rust">
                <Check size={15} className="flex-none text-rust" />
                <span>Check notifications</span>
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 border-t border-line pt-3 font-semibold text-ink hover:text-rust"
                >
                  <Grid size={15} className="flex-none text-rust" />
                  <span>Admin dashboard</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
