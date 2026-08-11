"use client";

import { useEffect, useState } from "react";
import { claims as claimsApi, type ClaimDTO } from "@/lib/api";
import { Button } from "@/components/ui/Button";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "text-amber-700 bg-amber-50 border-amber-200",
  APPROVED: "text-green-700 bg-green-50 border-green-200",
  REJECTED: "text-red-600 bg-red-50 border-red-200",
  WITHDRAWN: "text-ink3 bg-panel border-line",
};

/**
 * Shown to the item owner (or admin) on the item detail page.
 * Lists everyone who has claimed this item, with Approve / Reject actions
 * for pending claims. Approving opens a private message thread.
 */
export function ClaimsReview({ itemId }: { itemId: number }) {
  const [claimList, setClaimList] = useState<ClaimDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    claimsApi
      .forItem(itemId)
      .then(setClaimList)
      .catch(() => setError("Couldn't load claims."))
      .finally(() => setLoading(false));
  }, [itemId]);

  async function review(claimId: number, status: "APPROVED" | "REJECTED") {
    setBusyId(claimId);
    setError("");
    try {
      const updated = await claimsApi.update(claimId, status);
      setClaimList((prev) =>
        prev.map((c) => (c.id === claimId ? updated : c)),
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-line2 bg-card p-4 text-[13px] text-ink3">
        Loading claims...
      </div>
    );
  }

  if (claimList.length === 0) {
    return (
      <div className="rounded-xl border border-line2 bg-card p-4">
        <div className="text-[12.5px] font-semibold text-ink3">Claims</div>
        <div className="mt-1 text-[13.5px] text-ink3">
          No one has claimed this item yet.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line2 bg-card p-4">
      <div className="mb-3 text-[12.5px] font-semibold text-ink3">
        Claims on this item ({claimList.length})
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-[#e5c1b0] bg-[#fdf0ea] px-3 py-2 text-[12.5px] text-rust">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {claimList.map((c) => {
          const statusCls = STATUS_STYLE[c.status] ?? STATUS_STYLE.PENDING;
          return (
            <div
              key={c.id}
              className="rounded-lg border border-line bg-paper p-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-[14px] font-semibold text-ink">
                  {c.claimant.fullName}
                </div>
                <span
                  className={`flex-none rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusCls}`}
                >
                  {c.status}
                </span>
              </div>
              {c.message && (
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink2">
                  “{c.message}”
                </p>
              )}

              {c.status === "PENDING" && (
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    disabled={busyId === c.id}
                    onClick={() => review(c.id, "APPROVED")}
                  >
                    {busyId === c.id ? "..." : "Approve"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busyId === c.id}
                    onClick={() => review(c.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </div>
              )}

              {c.status === "APPROVED" && (
                <div className="mt-2 text-[12.5px] text-found">
                  Approved — a private message thread is now open.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
