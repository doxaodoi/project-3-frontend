import type { ComponentType } from "react";
import { Grid, Plus, Bell, User, ChatBubble } from "@/components/ui/Icon";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

/** Primary desktop nav (top bar). */
export const desktopNav: NavItem[] = [
  { label: "Browse", href: "/", icon: Grid },
  { label: "My reports", href: "/my-reports", icon: Grid },
  { label: "Messages", href: "/messages", icon: ChatBubble },
  { label: "Dashboard", href: "/dashboard", icon: Grid },
];

/** Compact mobile bottom nav — 4 primary items; a hamburger provides the rest. */
export const mobileNav: NavItem[] = [
  { label: "Browse", href: "/", icon: Grid },
  { label: "Report", href: "/report", icon: Plus },
  { label: "Messages", href: "/messages", icon: ChatBubble },
  { label: "Alerts", href: "/notifications", icon: Bell },
];

/** Items shown in the mobile "More" hamburger sheet. */
export const mobileMenu: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Grid },
  { label: "My reports", href: "/my-reports", icon: Grid },
  { label: "Profile", href: "/profile", icon: User },
];
