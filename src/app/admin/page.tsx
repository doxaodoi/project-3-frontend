"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { StatCard } from "@/components/ui/StatCard";
import { admin as adminApi } from "@/lib/api";
import { cn } from "@/lib/cn";

const BAR_COLORS = ["#b5451f", "#c8703f", "#2f6d3a", "#6b8f5e", "#a89a84"];

export default function AdminPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .stats()
      .then((s) => setStats(s as unknown as Record<string, unknown>))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <AdminShell>
        <div className="py-20 text-center text-ink3">Loading stats...</div>
      </AdminShell>
    );

  const totalItems = Number(stats?.totalItems ?? 0);
  const lostCount = Number(stats?.lostCount ?? 0);
  const foundCount = Number(stats?.foundCount ?? 0);
  const resolvedCount = Number(stats?.resolvedCount ?? 0);
  const pendingClaims = Number(stats?.pendingClaims ?? 0);
  const totalUsers = Number(stats?.totalUsers ?? 0);
  const resolutionRate = totalItems > 0
    ? Math.round((resolvedCount / totalItems) * 100)
    : 0;

  const byCategory = (stats?.byCategory ?? {}) as Record<string, number>;
  const maxCat = Math.max(...Object.values(byCategory), 1);
  const categoryBars = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([label, count], i) => ({
      label,
      count,
      pct: Math.round((count / maxCat) * 100),
      color: BAR_COLORS[i % BAR_COLORS.length],
    }));

  return (
    <AdminShell>
      <h1 className="pt-7 font-serif text-[26px] font-medium tracking-[-0.01em] sm:text-[30px]">
        Overview
      </h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 py-5 lg:grid-cols-4">
        <StatCard label="Total items" value={totalItems} hint={`${lostCount} lost · ${foundCount} found`} />
        <StatCard label="Resolved" value={resolvedCount} tone="good" />
        <StatCard
          label="Resolution rate"
          value={`${resolutionRate}%`}
          tone="dark"
        />
        <StatCard
          label="Pending claims"
          value={pendingClaims}
          tone="accent"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 pb-5 lg:grid-cols-[1.3fr_1fr]">
        {/* Users */}
        <div className="rounded-xl border border-line2 bg-card p-[18px]">
          <div className="mb-4 font-serif text-lg font-semibold">System</div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total users" value={totalUsers} />
            <StatCard label="Total items" value={totalItems} />
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-xl border border-line2 bg-card p-[18px]">
          <div className="mb-4 font-serif text-lg font-semibold">By category</div>
          {categoryBars.length > 0 ? (
            <div className="flex flex-col gap-3.5">
              {categoryBars.map((c) => (
                <div key={c.label}>
                  <div className="mb-1.5 flex justify-between text-[12.5px]">
                    <span>{c.label}</span>
                    <span className="text-ink3">{c.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-panel">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-sm text-ink3">No data yet.</div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
