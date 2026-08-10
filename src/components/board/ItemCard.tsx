import Link from "next/link";
import type { Item } from "@/lib/types";
import { TypeBadge } from "@/components/ui/Badge";
import { Sparkle } from "@/components/ui/Icon";

export function gradientStyle([from, to]: [string, string]) {
  return { backgroundImage: `linear-gradient(135deg, ${from}, ${to})` };
}

export function ItemCard({ item }: { item: Item }) {
  const photoUrl = item._dto?.photos?.[0]?.url;

  return (
    <Link
      href={`/items/${item.id}`}
      className="group block overflow-hidden rounded-[11px] border border-line2 bg-card transition-shadow hover:shadow-[0_10px_30px_-16px_rgba(40,30,15,0.45)]"
    >
      <div className="relative h-[130px]" style={photoUrl ? undefined : gradientStyle(item.gradient)}>
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        )}
        <TypeBadge type={item.type} className="absolute left-3 top-3" />
      </div>
      <div className="p-3.5">
        <div className="mb-1 font-serif text-lg font-semibold text-ink">
          {item.title}
        </div>
        <div className="text-[12.5px] leading-relaxed text-ink3">
          {item.category} · {item.location}
          <br />
          {item.timeAgo}
        </div>

        {item.smartMatches ? (
          <div className="mt-[11px] flex items-center gap-1.5 rounded-[7px] border border-rustline bg-rusttint px-[9px] py-[7px]">
            <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-rust text-white">
              <Sparkle size={9} />
            </span>
            <span className="text-[11.5px] font-semibold text-rust">
              {item.smartMatches} smart match{item.smartMatches > 1 ? "es" : ""}
            </span>
          </div>
        ) : item.aiDescribed ? (
          <div className="mt-[11px] font-mono text-[10px] tracking-wide text-muted">
            AI-DESCRIBED
          </div>
        ) : null}
      </div>
    </Link>
  );
}
