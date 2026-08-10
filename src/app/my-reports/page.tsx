"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { ReportsList } from "@/components/dashboard/ReportsList";

export default function MyReportsPage() {
  return (
    <AppShell>
      <div className="flex items-end justify-between pt-8">
        <div>
          <h1 className="font-serif text-[28px] font-medium tracking-[-0.01em] sm:text-[32px]">
            My reports
          </h1>
          <p className="mt-1.5 text-sm text-ink3">
            Everything you&apos;ve reported lost or found.
          </p>
        </div>
        <Link href="/report" className="hidden sm:block">
          <Button>+ Report an item</Button>
        </Link>
      </div>

      <div className="my-6 overflow-hidden rounded-xl border border-line2 bg-card">
        <ReportsList />
      </div>
    </AppShell>
  );
}
