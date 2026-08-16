/**
 * Converts backend API response shapes into the UI types that existing
 * components (ItemCard, BoardClient, ReportsList, etc.) already consume.
 */

import type { Item, ItemType, ItemStatus } from "./types";
import type { ItemDTO } from "./api";

/* ---------- colour gradients per category ---------- */

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  Electronics: ["#2f3b4a", "#4a5a6e"],
  Accessories: ["#356b7a", "#5aa0aa"],
  Keys: ["#7a5b35", "#a8824e"],
  Cards: ["#7a3535", "#aa5a5a"],
  Bags: ["#4a4a4a", "#6e6e6e"],
  Jewelry: ["#5a4a6e", "#8a72a8"],
  Clothing: ["#3a5a3f", "#6e8f5e"],
  Documents: ["#35507a", "#5a7baa"],
  Books: ["#5a3a3f", "#8f5e6e"],
  Other: ["#555555", "#888888"],
};

function gradient(category: string | null): [string, string] {
  return CATEGORY_GRADIENTS[category ?? ""] ?? CATEGORY_GRADIENTS.Other;
}

/* ---------- relative time ---------- */

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  return `${weeks} weeks ago`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ---------- API → UI mapper ---------- */

export function mapItem(dto: ItemDTO): Item {
  return {
    id: String(dto.id),
    type: dto.type as ItemType,
    title: dto.title,
    category: dto.category ?? "Other",
    location: dto.location ?? "",
    heldAt: dto.heldAt ?? undefined,
    date: dto.eventDate
      ? formatDate(dto.eventDate)
      : formatDate(dto.createdAt),
    timeAgo: timeAgo(dto.createdAt),
    description: dto.description ?? "",
    color: dto.color ?? undefined,
    brand: dto.brand ?? undefined,
    gradient: dto.photos.length > 0
      ? gradient(dto.category)       // has real photo — gradient as fallback
      : gradient(dto.category),
    aiDescribed: dto.isAiDescribed ?? false,
    smartMatches: dto.matchCount > 0 ? dto.matchCount : undefined,
    smartMatchScore: dto.topMatchScore ?? undefined,
    status: dto.status as ItemStatus,
    postedBy: dto.reporter?.fullName ?? "a verified finder",
    // Carry along the raw DTO for pages that need extra fields
    _dto: dto,
  };
}

/* ---------- Extend the Item type with the raw DTO ---------- */
declare module "./types" {
  interface Item {
    _dto?: ItemDTO;
  }
}
