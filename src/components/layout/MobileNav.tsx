"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNav } from "./nav-items";
import { cn } from "@/lib/cn";

export function MobileNav() {
  const pathname = usePathname();

  return (
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
              "flex min-w-[56px] flex-col items-center gap-1 font-mono text-[10px]",
              active ? "text-rust" : "text-faint",
            )}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
