"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/cn";

const tabs: { label: string; href?: string }[] = [
  { label: "Overview", href: "/admin" },
  { label: "Heatmap", href: "/admin/heatmap" },
  { label: "Moderation", href: "/admin/moderation" },
  { label: "Users", href: "/admin/users" },
];

export function AdminShell({
  children,
  active = "Overview",
}: {
  children: ReactNode;
  active?: string;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Guard: only admins may view; everyone else is bounced.
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "ADMIN") return null;

  return (
    <div className="min-h-full">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-4 px-4 py-[18px] sm:px-6 lg:px-8">
          <div className="flex flex-none items-center gap-3">
            <Link href="/">
              <Logo />
            </Link>
            <span className="font-mono text-[10px] tracking-[0.1em] rounded-[5px] bg-ink px-2 py-1 text-paper">
              ADMIN
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-ink2 md:flex">
            {tabs.map((t) => {
              const isActive = t.label === active;
              const cls = cn(
                "pb-1",
                isActive
                  ? "border-b-2 border-rust text-ink"
                  : "border-b-2 border-transparent",
                !t.href && "cursor-default",
              );
              return t.href ? (
                <Link key={t.label} href={t.href} className={cls}>
                  {t.label}
                </Link>
              ) : (
                <span key={t.label} className={cls}>
                  {t.label}
                </span>
              );
            })}
          </nav>

          <Link
            href="/profile"
            aria-label="Profile"
            className="h-8 w-8 flex-none rounded-full bg-[#d8cbb6]"
          />
        </div>

        {/* Mobile tab strip */}
        <div className="flex gap-5 overflow-x-auto border-t border-line px-4 py-2.5 text-[13px] font-medium text-ink2 md:hidden">
          {tabs.map((t) => {
            const isActive = t.label === active;
            const cls = cn("whitespace-nowrap", isActive && "font-semibold text-rust");
            return t.href ? (
              <Link key={t.label} href={t.href} className={cls}>
                {t.label}
              </Link>
            ) : (
              <span key={t.label} className={cls}>
                {t.label}
              </span>
            );
          })}
        </div>
      </header>

      <main className="mx-auto max-w-[1160px] px-4 pb-16 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
