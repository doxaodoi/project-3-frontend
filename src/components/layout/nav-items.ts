import type { ComponentType } from "react";
import { Grid, Plus, Bell, User, ChatBubble } from "@/components/ui/Icon";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number }>;
};

/** Primary desktop nav (top bar). */
export const desktopNav: NavItem[] = [
  { label: "Browse", href: "/", icon: Grid },
  { label: "My reports", href: "/my-reports", icon: Grid },
  { label: "Messages", href: "/messages", icon: ChatBubble },
  { label: "Dashboard", href: "/dashboard", icon: Grid },
];

/** Compact mobile bottom nav — 5 items like a standard mobile app. */
export const mobileNav: NavItem[] = [
  { label: "Browse", href: "/", icon: Grid },
  { label: "Report", href: "/report", icon: Plus },
  { label: "Messages", href: "/messages", icon: ChatBubble },
  { label: "Alerts", href: "/notifications", icon: Bell },
  { label: "Menu", href: "/dashboard", icon: User },
];
