"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { NotifIcon } from "@/components/ui/NotifIcon";
import {
  notifications as notifApi,
  type NotificationDTO,
} from "@/lib/api";
import { cn } from "@/lib/cn";

function notifKind(type: string) {
  if (type === "MATCH") return "match";
  if (type === "CLAIM" || type === "CLAIM_APPROVED" || type === "CLAIM_REJECTED") return "claim";
  if (type === "MESSAGE") return "message";
  return "system";
}

function timeLabel(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "JUST NOW";
  if (mins < 60) return `${mins} MINUTES AGO`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} HOUR${hours > 1 ? "S" : ""} AGO`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "YESTERDAY";
  return `${days} DAYS AGO`;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notifApi
      .list()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = () => {
    notifApi.markAllRead().then(() => {
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    });
  };

  if (loading)
    return (
      <AppShell>
        <div className="py-20 text-center text-ink3">Loading...</div>
      </AppShell>
    );

  return (
    <AppShell>
      <div className="mx-auto max-w-[600px]">
        <div className="flex items-center justify-between py-6">
          <h1 className="font-serif text-2xl font-semibold">Notifications</h1>
          <button
            onClick={markAllRead}
            className="text-[13px] font-semibold text-rust hover:text-rustdark"
          >
            Mark all read
          </button>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-sm text-ink3">
            No notifications yet.
          </div>
        ) : (
          <div className="flex flex-col gap-1 pb-16">
            {items.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex gap-3 rounded-[10px] p-3.5 transition-colors",
                  !n.isRead ? "bg-rusttint" : "opacity-70",
                )}
              >
                <NotifIcon kind={notifKind(n.type)} />
                <div className="flex-1">
                  <div className="text-[13.5px] leading-snug text-ink">
                    <b>{n.title}</b>
                    {n.body && <> — {n.body}</>}
                  </div>
                  <div className="mt-1 font-mono text-[11.5px] text-faint">
                    {timeLabel(n.createdAt)}
                  </div>
                </div>
                {!n.isRead && (
                  <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-rust" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
