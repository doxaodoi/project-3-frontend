"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Bell } from "@/components/ui/Icon";
import { desktopNav } from "./nav-items";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth-context";
import { notifications as notifApi } from "@/lib/api";

export function TopNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    notifApi.unreadCount().then((r) => setUnread(r.count)).catch(() => {});
  }, [user, pathname]);

  const initial = user?.fullName?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="hidden border-b border-line bg-paper md:block">
      <div className="mx-auto flex max-w-[1160px] items-center justify-between px-6 py-[18px] lg:px-8">
        <Link href="/" aria-label="Reclaim home">
          <Logo />
        </Link>

        <nav className="flex items-center gap-7 text-sm font-medium text-ink2">
          {desktopNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "pb-1 transition-colors hover:text-ink",
                  active
                    ? "border-b-2 border-rust text-ink"
                    : "border-b-2 border-transparent",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/notifications"
            className="relative text-ink2 hover:text-ink"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute -right-1.5 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-rust px-1 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>
          {user ? (
            <Link
              href="/profile"
              aria-label="Your profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rust to-[#c8703f] text-sm font-bold text-white"
            >
              {initial}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-rust hover:text-rustdark"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
