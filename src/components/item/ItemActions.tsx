"use client";

import { useState } from "react";
import type { Item } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Heart, Lock } from "@/components/ui/Icon";
import { claims as claimsApi } from "@/lib/api";

export function ItemActions({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [justification, setJustification] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isFound = item.type === "FOUND";
  const itemId = Number(item.id);

  async function handleClaim() {
    if (!justification.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await claimsApi.create(itemId, justification.trim());
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit claim.";
      setError(msg);
    }
    setSubmitting(false);
  }

  return (
    <>
      <div className="mb-4 flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={() => {
            setSubmitted(false);
            setError("");
            setOpen(true);
          }}
        >
          {isFound ? "This is mine — claim it" : "I found this item"}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setSaved((s) => !s)}
          aria-pressed={saved}
        >
          <Heart
            size={18}
            className={saved ? "fill-rust text-rust" : ""}
          />
          {saved ? "Saved" : "Save"}
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-panel px-[13px] py-[11px] text-[12.5px] text-ink3">
        <Lock size={16} className="flex-none text-ink3" />
        Your contact details stay private. Claims are reviewed before any
        messaging opens.
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-[1.5px]"
          role="dialog"
          aria-modal="true"
          aria-label="Claim this item"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[480px] overflow-hidden rounded-[14px] bg-paper shadow-[0_30px_70px_-20px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div className="px-7 py-9 text-center">
                <h3 className="mb-2 font-serif text-2xl font-semibold">
                  Claim submitted
                </h3>
                <p className="mx-auto max-w-[320px] text-[13.5px] leading-relaxed text-ink3">
                  The finder will review your claim. If it checks out, a private
                  message thread opens — we&apos;ll notify you.
                </p>
                <Button className="mt-6" onClick={() => setOpen(false)}>
                  Done
                </Button>
              </div>
            ) : (
              <>
                <div className="px-7 pt-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-2xl font-semibold">
                      Claim this item
                    </h3>
                    <button
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="text-xl text-faint hover:text-ink2"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-snug text-ink3">
                    Tell the finder why this is yours. They&apos;ll review before
                    contact opens — this keeps everyone safe.
                  </p>
                </div>

                <div className="px-7 pt-5">
                  <label
                    htmlFor="justification"
                    className="mb-[7px] block text-[12.5px] font-semibold text-ink2"
                  >
                    Your justification
                  </label>
                  <textarea
                    id="justification"
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    rows={4}
                    placeholder="Describe details only the owner would know..."
                    className="min-h-[88px] w-full resize-y rounded-[9px] border border-line bg-card px-3.5 py-[13px] text-sm leading-snug text-ink focus:border-rust focus:outline-none"
                  />
                  <div className="mt-2 text-[11.5px] text-faint">
                    Mentioning details not shown in photos makes your claim
                    stronger.
                  </div>
                  {error && (
                    <div className="mt-2 text-[12px] text-rust">{error}</div>
                  )}
                </div>

                <div className="flex gap-3 px-7 pb-7 pt-[22px]">
                  <Button
                    className="flex-1"
                    disabled={!justification.trim() || submitting}
                    onClick={handleClaim}
                  >
                    {submitting ? "Submitting..." : "Submit claim"}
                  </Button>
                  <Button variant="secondary" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
