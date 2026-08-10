export type ItemType = "LOST" | "FOUND";

export type ItemStatus = "OPEN" | "MATCHED" | "CLAIMED" | "RESOLVED";

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  category: string;
  /** Where it was lost / found near. */
  location: string;
  /** For FOUND items: where it is currently held. */
  heldAt?: string;
  /** Human display date, e.g. "7 Aug 2026". */
  date: string;
  /** Relative label, e.g. "2 days ago". */
  timeAgo: string;
  description: string;
  color?: string;
  brand?: string;
  /** Placeholder photo gradient [from, to] until real photos exist. */
  gradient: [string, string];
  aiDescribed?: boolean;
  /** Number of suggested smart matches (LOST items). */
  smartMatches?: number;
  status: ItemStatus;
  /** Reporter label, e.g. "a verified finder". */
  postedBy: string;
}

export const CATEGORIES = [
  "Electronics",
  "Keys & Access",
  "Bags & Wallets",
  "Clothing",
  "Books & Notes",
  "ID & Documents",
  "Water Bottles",
  "Jewelry",
  "Sports Equipment",
  "Other",
] as const;

export const LOCATIONS = [
  "Balme Library",
  "Bush Canteen",
  "JQB (Dept. of CS)",
  "Great Hall",
  "Main Gate",
  "Legon Hall",
  "Akuafo Hall",
  "Pentagon Hall",
  "N Block",
  "Security Office",
  "Science Block",
  "Athletic Oval",
] as const;
