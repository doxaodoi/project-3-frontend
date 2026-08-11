"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { TopNav } from "./TopNav";
import { MobileNav } from "./MobileNav";

/**
 * Authenticated app frame: desktop top bar, mobile bottom nav, and a
 * centered content column. Redirects to /login if not authenticated.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // While checking auth, render nothing (loading.tsx skeleton shows)
  if (loading || !user) return null;

  return (
    <div className="min-h-full">
      <TopNav />
      <main className="mx-auto max-w-[1160px] px-4 pb-28 sm:px-6 md:pb-12 lg:px-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
