"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { admin as adminApi, type ItemDTO } from "@/lib/api";
import { cn } from "@/lib/cn";

const STATUSES = ["OPEN", "MATCHED", "RESOLVED", "ARCHIVED"];

export default function ModerationPage() {
  const [items, setItems] = useState<ItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .items(0, 50)
      .then((page) => setItems(page.content))
      .catch(() => setError("Couldn't load items."))
      .finally(() => setLoading(false));
  }, []);

  async function changeStatus(id: number, status: string) {
    setBusyId(id);
    setError("");
    try {
      const updated = await adminApi.moderateItem(id, status);
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: number) {
    if (!confirm("Remove this item permanently?")) return;
    setBusyId(id);
    setError("");
    try {
      await adminApi.removeItem(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell active="Moderation">
      <h1 className="pt-7 font-serif text-[26px] font-medium tracking-[-0.01em] sm:text-[30px]">
        Moderation
      </h1>
      <p className="mt-1 text-[13.5px] text-ink3">
        Change an item&apos;s status or remove it from the board.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-[#e5c1b0] bg-[#fdf0ea] px-4 py-3 text-sm text-rust">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-ink3">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center text-ink3">No items on the board.</div>
      ) : (
        <div className="my-6 overflow-hidden rounded-xl border border-line2 bg-card">
          {items.map((it, i) => (
            <div
              key={it.id}
              className={cn(
                "flex flex-col gap-3 p-4 sm:flex-row sm:items-center",
                i < items.length - 1 && "border-b border-line",
              )}
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/items/${it.id}`}
                  className="truncate text-sm font-semibold text-ink hover:text-rust"
                >
                  {it.title}
                </Link>
                <div className="text-xs text-ink3">
                  {it.type} · {it.location ?? "No location"} ·{" "}
                  {it.reporter?.fullName ?? "Unknown"}
                </div>
              </div>

              <div className="flex flex-none items-center gap-2">
                <select
                  value={it.status}
                  disabled={busyId === it.id}
                  onChange={(e) => changeStatus(it.id, e.target.value)}
                  className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-[13px] text-ink focus:border-rust focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => remove(it.id)}
                  disabled={busyId === it.id}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[13px] font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
