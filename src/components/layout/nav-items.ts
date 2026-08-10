import type { ComponentType } from "react";
import { Grid, Plus, Bell, User } from "@/components/ui/Icon";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number }>;
};

/** Primary desktop nav (top bar). */
export const desktopNav: NavItem[] = [
  { label: "Browse", href: "/", icon: Grid },
  { label: "My reports", href: "/my-reports", icon: Grid },
  { label: "Messages", href: "/messages", icon: Bell },
  { label: "Dashboard", href: "/dashboard", icon: Grid },
];

/** Compact mobile bottom nav. */
export const mobileNav: NavItem[] = [
  { label: "Browse", href: "/", icon: Grid },
  { label: "Report", href: "/report", icon: Plus },
  { label: "Alerts", href: "/notifications", icon: Bell },
  { label: "You", href: "/profile", icon: User },
];
