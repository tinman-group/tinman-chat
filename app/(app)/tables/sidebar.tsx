"use client";

import { MainSidebar } from "@/components/main-sidebar";
import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu
} from "@/components/ui/sidebar";
import { User } from "@/lib/db/schema";
import { Database, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  icon: React.ComponentType;
  label: string;
  href: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

interface TablesSidebarProps {
  user?: User;
  menuGroups?: MenuGroup[];
}

export function TablesSidebar({
  user,
  menuGroups = defaultMenuGroups
}: TablesSidebarProps) {
  const pathname = usePathname();

  return (
    <MainSidebar>
      <MainSidebar.Header title="Tables"></MainSidebar.Header>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroup.Label>{group.label}</SidebarGroup.Label>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenu.Item key={item.href}>
                    <SidebarMenu.Button asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenu.Button>
                  </SidebarMenu.Item>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <MainSidebar.Footer>
        {user && (
          <div className="text-muted-foreground px-2 py-1.5 text-xs">
            Welcome, {user.email}
          </div>
        )}
      </MainSidebar.Footer>
    </MainSidebar>
  );
}

const defaultMenuGroups: MenuGroup[] = [
  {
    label: "Tables",
    items: [
      { icon: Database, label: "All Tables", href: "/tables" },
      { icon: Plus, label: "Create Table", href: "/tables/create" }
    ]
  },
  {
    label: "Configuration",
    items: [
      { icon: Settings, label: "Table Settings", href: "/tables/settings" }
    ]
  }
];
