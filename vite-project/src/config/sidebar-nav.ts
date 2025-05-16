import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  // Assuming Kanban uses LayoutDashboard as per previous sidebar, or replace with a specific Kanban icon if available
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ISidebarSubLink {
  href: string;
  label: string;
  disabled?: boolean;
}

export interface ISidebarLink {
  type: "link";
  href: string; // For parent items that are toggles, this might be '#' or handled onClick
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  subLinks?: ISidebarSubLink[];
}

export type SidebarNavigationItem = ISidebarLink;

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    type: "link",
    href: "/dashboard", 
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    type: "link",
    href: "/employees", 
    label: "Employee",
    icon: Users,
  },
  {
    type: "link",
    href: "/products", 
    label: "Product",
    icon: Package,
  },
  {
    type: "link",
    href: "#", // '#' indicates it's a toggle, not a direct navigation link
    label: "Account",
    icon: CreditCard,
    subLinks: [
      { href: "/account/profile", label: "Profile" },
    ],
  },
  {
    type: "link",
    href: "/kanban", 
    label: "Kanban",
    icon: LayoutDashboard, // Using LayoutDashboard for Kanban as in example
  },
]; 