import { AppShell } from "@/components/layout/AppShell";
import { ReportForm } from "@/components/report/ReportForm";

export default function ReportPage() {
  return (
    <AppShell>
      <div className="pt-7">
        <h1 className="mb-1 font-serif text-[28px] font-semibold tracking-[-0.01em]">
          Report an item
        </h1>
        <p className="mb-6 text-sm text-ink3">
          Add a photo and let Smart-Describe do the typing — then review and
          post.
        </p>
      </div>
      <ReportForm />
    </AppShell>
  );
}
