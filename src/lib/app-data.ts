import type { ItemType } from "./types";

export const CURRENT_USER = {
  name: "Ama Mensah",
  firstName: "Ama",
  initial: "A",
  email: "ama.mensah@ug.edu.gh",
  phoneMasked: "+233 24 •••  ••89",
  detail: "Level 300 · Computer Engineering",
};

export interface MyReport {
  id: string;
  title: string;
  type: ItemType;
  location: string;
  status: "MATCHED" | "OPEN" | "RESOLVED";
  gradient: [string, string];
}

export const MY_REPORTS: MyReport[] = [
  {
    id: "iphone-14-pro",
    title: "Black iPhone 14 Pro",
    type: "LOST",
    location: "Balme Library",
    status: "MATCHED",
    gradient: ["#2f3b4a", "#4a5a6e"],
  },
  {
    id: "silver-ring",
    title: "Silver ring",
    type: "LOST",
    location: "JQB",
    status: "OPEN",
    gradient: ["#5a4a6e", "#8a72a8"],
  },
  {
    id: "blue-hydro-flask",
    title: "Blue Hydro Flask",
    type: "FOUND",
    location: "Security Office",
    status: "RESOLVED",
    gradient: ["#356b7a", "#5aa0aa"],
  },
];

export type NotifKind = "match" | "claim" | "message" | "system";

export interface Notification {
  id: string;
  kind: NotifKind;
  before?: string;
  strong?: string;
  after?: string;
  time: string;
  unread: boolean;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    kind: "match",
    strong: "New 92% match",
    after: " for your lost iPhone 14 Pro.",
    time: "2 MINUTES AGO",
    unread: true,
  },
  {
    id: "n2",
    kind: "claim",
    before: "Your claim on ",
    strong: "Blue Hydro Flask",
    after: " was approved.",
    time: "1 HOUR AGO",
    unread: true,
  },
  {
    id: "n3",
    kind: "message",
    strong: "Kojo A.",
    after: " sent you a message.",
    time: "3 HOURS AGO",
    unread: true,
  },
  {
    id: "n4",
    kind: "system",
    before: "Your ",
    strong: "silver ring",
    after: " report is now live on the board.",
    time: "YESTERDAY",
    unread: false,
  },
];

export interface Conversation {
  id: string;
  name: string;
  initial: string;
  color: string;
  about: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: { from: "them" | "me" | "system"; text: string }[];
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: "kojo",
    name: "Kojo A.",
    initial: "K",
    color: "#c8703f",
    about: "About: Blue Hydro Flask · Claim approved",
    preview: "Great, I'll bring it to Security…",
    time: "2m",
    unread: true,
    messages: [
      { from: "system", text: "CLAIM APPROVED · TODAY" },
      {
        from: "them",
        text: "Hi! I found your Hydro Flask near Bush Canteen and handed it to Security.",
      },
      { from: "me", text: "Thank you so much! When can I pick it up?" },
      {
        from: "them",
        text: "Great, I'll bring it to Security's front desk. They're open till 6.",
      },
    ],
  },
  {
    id: "efua",
    name: "Efua D.",
    initial: "E",
    color: "#5a7baa",
    about: "About: Silver ring",
    preview: "Is the ring still available?",
    time: "1h",
    unread: false,
    messages: [
      { from: "them", text: "Hi, is the silver ring still available?" },
      { from: "me", text: "Yes it is — where did you find it?" },
    ],
  },
  {
    id: "security",
    name: "Security Office",
    initial: "S",
    color: "#6b8f5e",
    about: "About: Blue Hydro Flask · ref #1039",
    preview: "Item logged — ref #1039.",
    time: "Yesterday",
    unread: false,
    messages: [
      { from: "them", text: "Item logged — ref #1039. Ready for collection." },
    ],
  },
];

export const RECENT_ACTIVITY = [
  { kind: "match" as const, text: "New 92% match on your iPhone" },
  { kind: "message" as const, text: "Kojo replied about the Hydro Flask" },
  { kind: "system" as const, text: "Your ring report was published" },
];
