"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { admin as adminApi, type UserDTO } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/cn";

export default function UsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .users()
      .then(setUsers)
      .catch(() => setError("Couldn't load users."))
      .finally(() => setLoading(false));
  }, []);

  async function remove(id: number) {
    if (!confirm("Delete this user permanently?")) return;
    setBusyId(id);
    setError("");
    try {
      await adminApi.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell active="Users">
      <h1 className="pt-7 font-serif text-[26px] font-medium tracking-[-0.01em] sm:text-[30px]">
        Users
      </h1>
      <p className="mt-1 text-[13.5px] text-ink3">
        {users.length} registered {users.length === 1 ? "account" : "accounts"}.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-[#e5c1b0] bg-[#fdf0ea] px-4 py-3 text-sm text-rust">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-ink3">Loading users...</div>
      ) : (
        <div className="my-6 overflow-hidden rounded-xl border border-line2 bg-card">
          {users.map((u, i) => (
            <div
              key={u.id}
              className={cn(
                "flex items-center gap-3 p-4",
                i < users.length - 1 && "border-b border-line",
              )}
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-rust to-[#c8703f] text-sm font-bold text-white">
                {u.fullName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-ink">
                    {u.fullName}
                  </span>
                  {u.role === "ADMIN" && (
                    <span className="flex-none rounded bg-ink px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-paper">
                      ADMIN
                    </span>
                  )}
                </div>
                <div className="truncate text-xs text-ink3">{u.email}</div>
              </div>
              {u.id !== me?.id && u.role !== "ADMIN" && (
                <button
                  onClick={() => remove(u.id)}
                  disabled={busyId === u.id}
                  className="flex-none rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[13px] font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
