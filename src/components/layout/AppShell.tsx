import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { MobileNav } from "./MobileNav";

/**
 * Authenticated app frame: desktop top bar, mobile bottom nav, and a
 * centered content column. Auth screens render outside this shell.
 */
export function AppShell({ children }: { children: ReactNode }) {
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
