"use client";

import { MainSidebar } from "@/components/main-sidebar";
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu 
} from "@/components/ui/sidebar";
import {
  Bell,
  Database,
  HelpCircle,
  Key,
  Palette,
  Settings,
  Shield,
  User
} from "lucide-react";
import type { User as NextAuthUser } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SettingsSidebarProps {
  user?: NextAuthUser;
}

export function SettingsSidebar({ user }: SettingsSidebarProps) {
  const pathname = usePathname();

  const settingsGroups = [
    {
      label: "General",
      items: [
        { icon: User, label: "Profile", href: "/settings/profile" },
        { icon: Settings, label: "Preferences", href: "/settings/preferences" },
        { icon: Palette, label: "Appearance", href: "/settings/appearance" },
        { icon: Bell, label: "Notifications", href: "/settings/notifications" }
      ]
    },
    {
      label: "AI & Chat",
      items: [
        { icon: Settings, label: "Model Settings", href: "/settings/models" },
        { icon: Database, label: "Chat History", href: "/settings/history" }
      ]
    },
    {
      label: "Security", 
      items: [
        { icon: Key, label: "Authentication", href: "/settings/auth" },
        { icon: Shield, label: "Privacy", href: "/settings/privacy" }
      ]
    },
    {
      label: "Support",
      items: [
        { icon: HelpCircle, label: "Help & Docs", href: "/settings/help" }
      ]
    }
  ];

  return (
    <MainSidebar>
      <MainSidebar.Header title="Settings" />
      <SidebarContent>
        {settingsGroups.map((group) => (
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
        <div className="flex items-center gap-2 px-2">
          <div className="bg-sidebar-accent flex h-8 w-8 items-center justify-center rounded-md">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sidebar-foreground truncate text-sm font-medium">
              {user?.email || "Guest User"}
            </p>
            <p className="text-sidebar-foreground/60 text-xs">Settings</p>
          </div>
        </div>
      </MainSidebar.Footer>
    </MainSidebar>
  );
}
