import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { sidebarNavigation } from "@/config/sidebar-nav";
import type { ISidebarLink, ISidebarSubLink } from "@/config/sidebar-nav"; // Re-enable ISidebarSubLink
import { Link, useLocation } from "react-router-dom"; // IMPORT Link and useLocation
import { useState } from "react"; // IMPORT useState

// REMOVED NavItem interface and mainNavItems constant
// interface NavItem { ... }
// const mainNavItems: NavItem[] = [ ... ];

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path: string, subLinks?: ISidebarSubLink[], isParentCheck?: boolean): boolean => {
    if (path !== "#" && (location.pathname === path || location.pathname.startsWith(path + '/'))) {
      return true;
    }
    if (subLinks) {
      const isActiveSub = subLinks.some(sub => location.pathname === sub.href || location.pathname.startsWith(sub.href + '/'));
      if (isParentCheck) return isActiveSub;
      return isActiveSub;
    }
    return false;
  };

  return (
    <div className={cn("hidden border-r border-border bg-background md:block", className)}>
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-14 items-center border-b border-border px-4 lg:h-[60px] lg:px-6">
          <Link to="/overview" className="flex items-center gap-2 font-semibold text-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-medium text-sm">A</span>
            </div>
            <span className="">Acme Inc</span>
          </Link>
          <p className="ml-2 text-xs text-muted-foreground">Enterprise</p>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-center px-2 text-sm font-medium space-y-1">
            {sidebarNavigation.map((item, index) => {
              const linkItem = item as ISidebarLink;
              const parentItemIsActive = isActive(linkItem.href, linkItem.subLinks, true);
              const isSubmenuCurrentlyOpen = openSubmenus[linkItem.label] || false;

              if (linkItem.subLinks && linkItem.subLinks.length > 0) {
                return (
                  <div key={`parent-group-${index}-${linkItem.label}`}>
                    <div
                      onClick={() => toggleSubmenu(linkItem.label)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSubmenu(linkItem.label); } }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-foreground transition-all hover:bg-accent hover:text-accent-foreground text-left cursor-pointer",
                        parentItemIsActive && "bg-accent text-accent-foreground"
                      )}
                      aria-expanded={isSubmenuCurrentlyOpen}
                      role="button"
                      tabIndex={0}
                    >
                      <linkItem.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
                      {linkItem.label}
                      {isSubmenuCurrentlyOpen ? <ChevronDown className="ml-auto h-4 w-4 shrink-0" /> : <ChevronRight className="ml-auto h-4 w-4 shrink-0" />}
                    </div>
                    {isSubmenuCurrentlyOpen && (
                      <div className="mt-1 ml-4 pl-3.5 border-l border-border space-y-1 py-1">
                        {linkItem.subLinks.map((subLink: ISidebarSubLink, subIndex: number) => {
                          const subItemIsActive = isActive(subLink.href);
                          return (
                          <Link
                            key={`sublink-${subIndex}-${subLink.label}`}
                            to={subLink.href}
                            className={cn(
                              "flex items-center gap-2 rounded-lg py-2 pl-2 pr-2 text-foreground transition-all hover:bg-accent hover:text-accent-foreground",
                              subItemIsActive && "bg-accent text-accent-foreground",
                              subLink.disabled && "pointer-events-none opacity-50"
                            )}
                          >
                            {subLink.label}
                          </Link>
                        );
                        })}
                      </div>
                    )}
                  </div>
                );
              } else {
                const singleItemIsActive = isActive(linkItem.href);
                return (
                  <Link
                    key={`link-${index}-${linkItem.label}`}
                    to={linkItem.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2 py-2 text-foreground transition-all hover:bg-accent hover:text-accent-foreground",
                      singleItemIsActive && "bg-accent text-accent-foreground",
                      linkItem.disabled && "pointer-events-none opacity-50"
                    )}
                  >
                    <linkItem.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
                    {linkItem.label}
                  </Link>
                );
              }
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm">KV</span>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">kreviazuk</p>
              <p className="text-xs text-muted-foreground">kreviazuzhou@gmail.com</p>
            </div>
            <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
} 