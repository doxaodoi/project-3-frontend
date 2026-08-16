"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { EditReportForm } from "@/components/report/EditReportForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/lib/auth-context";
import { items as itemsApi, type ItemDTO } from "@/lib/api";

export default function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [item, setItem] = useState<ItemDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!id || authLoading) return;
    itemsApi
      .get(id)
      .then((dto) => {
        const isOwner = user && dto.reporter?.id === user.id;
        const isAdmin = user?.role === "ADMIN";
        if (!isOwner && !isAdmin) {
          setDenied(true);
        } else {
          setItem(dto);
        }
      })
      .catch(() => setDenied(true))
      .finally(() => setLoading(false));
  }, [id, user, authLoading]);

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-[640px] py-8">
          <Skeleton className="mb-6 h-8 w-48" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-[9px]" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (denied || !item) {
    return (
      <AppShell>
        <div className="py-20 text-center">
          <h1 className="font-serif text-2xl font-semibold">Can&apos;t edit this report</h1>
          <p className="mt-2 text-sm text-ink3">
            You can only edit reports you created.
          </p>
          <Link href="/my-reports" className="mt-4 inline-block text-sm font-semibold text-rust hover:text-rustdark">
            Back to my reports
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="py-8">
        <button
          onClick={() => router.push(`/items/${item.id}`)}
          className="mb-4 text-[13px] text-ink3 hover:text-ink"
        >
          ‹ Back to item
        </button>
        <h1 className="mb-1 font-serif text-[28px] font-medium tracking-[-0.01em]">
          Edit report
        </h1>
        <p className="mb-6 text-sm text-ink3">
          Update the details of your {item.type === "FOUND" ? "found" : "lost"} item.
        </p>
        <EditReportForm item={item} />
      </div>
    </AppShell>
  );
}
