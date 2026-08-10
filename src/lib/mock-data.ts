import type { Item } from "./types";

/**
 * Static sample data mirroring the design mockup. Replaced by real API
 * calls in P6 (backend integration).
 */
export const ITEMS: Item[] = [
  {
    id: "iphone-14-pro",
    type: "LOST",
    title: "iPhone 14 Pro",
    category: "Electronics",
    location: "Balme Library",
    date: "5 Aug 2026",
    timeAgo: "2 days ago",
    description:
      "Black iPhone 14 Pro in a clear case, cracked top-right corner of the screen. Lock screen is a photo of the UG campus.",
    color: "Black",
    brand: "Apple",
    gradient: ["#2f3b4a", "#4a5a6e"],
    smartMatches: 1,
    status: "MATCHED",
    postedBy: "Ama Mensah",
  },
  {
    id: "blue-hydro-flask",
    type: "FOUND",
    title: "Blue Hydro Flask",
    category: "Accessories",
    location: "Bush Canteen",
    heldAt: "Security Office",
    date: "7 Aug 2026",
    timeAgo: "Yesterday",
    description:
      "A teal-blue insulated stainless-steel water bottle with a carry loop and a slightly scratched base. Appears to be a 620 ml Hydro Flask.",
    color: "Teal-blue",
    brand: "Hydro Flask",
    gradient: ["#356b7a", "#5aa0aa"],
    aiDescribed: true,
    status: "OPEN",
    postedBy: "a verified finder",
  },
  {
    id: "keys-red-lanyard",
    type: "FOUND",
    title: "Keys, red lanyard",
    category: "Keys",
    location: "Night Ward Lodge",
    heldAt: "Night Ward Lodge",
    date: "4 Aug 2026",
    timeAgo: "3 days ago",
    description:
      "A bunch of three keys on a red lanyard with a small brass bottle-opener charm.",
    color: "Red",
    gradient: ["#7a5b35", "#a8824e"],
    status: "OPEN",
    postedBy: "a verified finder",
  },
  {
    id: "silver-ring",
    type: "LOST",
    title: "Silver ring",
    category: "Jewelry",
    location: "JQB",
    date: "3 Aug 2026",
    timeAgo: "4 days ago",
    description:
      "A thin silver band with a small engraved leaf pattern. Sentimental value.",
    color: "Silver",
    gradient: ["#5a4a6e", "#8a72a8"],
    status: "OPEN",
    postedBy: "Kojo Asare",
  },
  {
    id: "tortoise-glasses",
    type: "FOUND",
    title: "Tortoise glasses",
    category: "Accessories",
    location: "Dept. of Physics",
    heldAt: "Dept. of Physics office",
    date: "7 Aug 2026",
    timeAgo: "Today",
    description:
      "Tortoiseshell-pattern acetate eyeglasses with thin gold temple arms, in a soft grey pouch.",
    color: "Brown",
    gradient: ["#3a5a3f", "#6e8f5e"],
    aiDescribed: true,
    status: "OPEN",
    postedBy: "a verified finder",
  },
  {
    id: "grey-backpack",
    type: "LOST",
    title: "Grey backpack",
    category: "Bags",
    location: "Bush Canteen",
    date: "5 Aug 2026",
    timeAgo: "2 days ago",
    description:
      "A grey Herschel backpack with a laptop and a blue notebook inside. Small keychain on the front zip.",
    color: "Grey",
    brand: "Herschel",
    gradient: ["#4a4a4a", "#6e6e6e"],
    status: "OPEN",
    postedBy: "Efua Osei",
  },
  {
    id: "student-id-card",
    type: "FOUND",
    title: "Student ID card",
    category: "Cards",
    location: "Balme Library",
    heldAt: "Balme Library desk",
    date: "6 Aug 2026",
    timeAgo: "Yesterday",
    description: "A University of Ghana student ID card found between shelves.",
    gradient: ["#7a3535", "#aa5a5a"],
    status: "OPEN",
    postedBy: "a verified finder",
  },
  {
    id: "umbrella-navy",
    type: "LOST",
    title: "Umbrella, navy",
    category: "Accessories",
    location: "N-Block",
    date: "2 Aug 2026",
    timeAgo: "5 days ago",
    description: "A compact navy-blue folding umbrella with a wooden handle.",
    color: "Navy",
    gradient: ["#35507a", "#5a7baa"],
    status: "OPEN",
    postedBy: "Yaw Boateng",
  },
];

export function getItem(id: string): Item | undefined {
  return ITEMS.find((item) => item.id === id);
}

/** Extra thumbnail gradients for the detail gallery. */
export function galleryGradients(item: Item): [string, string][] {
  return [
    item.gradient,
    ["#2f5a66", "#4a8892"],
    ["#3a6570", "#5590a0"],
  ];
}
