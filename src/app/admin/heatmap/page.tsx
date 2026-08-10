import { AdminShell } from "@/components/layout/AdminShell";
import { HeatMap, type Hotspot } from "@/components/map/HeatMap";

const HOTSPOTS: Hotspot[] = [
  { location: "Balme Library", count: 84 },
  { location: "Bush Canteen", count: 51 },
  { location: "JQB", count: 33 },
  { location: "N-Block", count: 22 },
  { location: "Dept. of Physics", count: 18 },
  { location: "Night Ward Lodge", count: 14 },
];

export default function HeatmapPage() {
  return (
    <AdminShell active="Heatmap">
      <div className="flex flex-col items-start justify-between gap-4 pt-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-[26px] font-medium tracking-[-0.01em] sm:text-[28px]">
            Where things get lost
          </h1>
          <p className="mt-1.5 text-[13.5px] text-ink3">
            Hotspots help you place drop-boxes and signage.
          </p>
        </div>
        <div className="flex overflow-hidden rounded-[9px] border border-line bg-card text-[13px] font-semibold">
          <span className="bg-ink px-[15px] py-[9px] text-paper">Lost</span>
          <span className="px-[15px] py-[9px] text-ink2">Found</span>
        </div>
      </div>

      <div className="py-4">
        <HeatMap hotspots={HOTSPOTS} />
      </div>
    </AdminShell>
  );
}
