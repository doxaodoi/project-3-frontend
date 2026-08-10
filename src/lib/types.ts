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
  "Accessories",
  "Keys",
  "Cards",
  "Bags",
  "Jewelry",
  "Clothing",
  "Documents",
  "Other",
] as const;

export const LOCATIONS = [
  "Balme Library",
  "Security Office",
  "Night Ward Lodge",
  "JQB",
  "Dept. of Physics",
  "Bush Canteen",
  "N-Block",
  "Dept. of Computer Eng.",
] as const;
