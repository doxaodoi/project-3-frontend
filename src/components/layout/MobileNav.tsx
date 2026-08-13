"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNav, mobileMenu } from "./nav-items";
import { Menu, X, LogOut, Grid } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/cn";

export function MobileNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initial = user?.fullName?.charAt(0).toUpperCase() ?? "?";

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line bg-paper px-2 pb-6 pt-3 md:hidden"
        aria-label="Primary"
      >
        {mobileNav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-[52px] flex-col items-center gap-1 font-mono text-[10px]",
                active ? "text-rust" : "text-faint",
              )}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}

        {/* Hamburger — opens the account/menu sheet */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex min-w-[52px] flex-col items-center gap-1 font-mono text-[10px] text-faint"
        >
          <Menu size={20} />
          Menu
        </button>
      </nav>

      {/* Bottom sheet */}
      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/45 backdrop-blur-[1px]"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[18px] border-t border-line bg-paper pb-8 pt-2 shadow-[0_-10px_40px_-12px_rgba(0,0,0,0.4)]">
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-line" />

            {/* Account header */}
            <div className="flex items-center gap-3 px-5 py-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-rust to-[#c8703f] text-base font-bold text-white">
                {initial}
              </span>
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold text-ink">
                  {user?.fullName ?? "Guest"}
                </div>
                <div className="truncate text-[12.5px] text-ink3">
                  {user?.email ?? ""}
                </div>
              </div>
            </div>

            <div className="my-1 h-px bg-line" />

            {/* Menu links */}
            <div className="flex flex-col px-2 py-1">
              {mobileMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3.5 rounded-[10px] px-3.5 py-3 text-[15px] text-ink hover:bg-panel"
                  >
                    <Icon size={19} className="flex-none text-ink3" />
                    {item.label}
                  </Link>
                );
              })}

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3.5 rounded-[10px] px-3.5 py-3 text-[15px] font-semibold text-ink hover:bg-panel"
                >
                  <Grid size={19} className="flex-none text-rust" />
                  Admin dashboard
                </Link>
              )}
            </div>

            <div className="my-1 h-px bg-line" />

            {/* Sign out */}
            <div className="px-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-3.5 rounded-[10px] px-3.5 py-3 text-left text-[15px] font-semibold text-rust hover:bg-rusttint"
              >
                <LogOut size={19} className="flex-none" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
