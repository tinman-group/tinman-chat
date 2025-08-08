"use client";

import { MainSidebar } from "@/components/main-sidebar";
import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu
} from "@/components/ui/sidebar";
import { Activity, Cpu, Settings, Users } from "lucide-react";
import { User } from "next-auth";
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

interface AgentsSidebarProps {
  user?: User;
  menuGroups?: MenuGroup[];
}

const defaultMenuGroups: MenuGroup[] = [
  {
    label: "Agent Management",
    items: [
      { icon: Users, label: "Active Agents", href: "/agents" },
      { icon: Activity, label: "Agent Activity", href: "/agents/activity" },
      { icon: Cpu, label: "Agent Templates", href: "/agents/templates" }
    ]
  },
  {
    label: "Configuration",
    items: [
      { icon: Settings, label: "Agent Settings", href: "/agents/settings" }
    ]
  }
];

export function AgentsSidebar({
  user,
  menuGroups = defaultMenuGroups
}: AgentsSidebarProps) {
  const pathname = usePathname();

  return (
    <MainSidebar>
      <MainSidebar.Header title="Agents"></MainSidebar.Header>

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
