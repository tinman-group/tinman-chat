"use client";

import { MainSidebar } from "@/components/main-sidebar";
import { Button } from "@/components/ui/button";
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

interface SettingsSidebarProps {
  user?: NextAuthUser;
}

const SettingsNavItem = ({
  icon: Icon,
  label,
  isActive = false
}: {
  icon: any;
  label: string;
  isActive?: boolean;
}) => (
  <Button
    variant="ghost"
    className={`h-9 w-full justify-start px-3 ${
      isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
    }`}
  >
    <Icon className="mr-3 h-4 w-4" />
    {label}
  </Button>
);

export function SettingsSidebar({ user }: SettingsSidebarProps) {
  return (
    <MainSidebar>
      <MainSidebar.Header title="Settings"></MainSidebar.Header>

      <div className="flex-1 p-2">
        <nav className="space-y-1">
          <div className="pb-2">
            <p className="text-sidebar-foreground/60 px-3 pb-2 text-xs font-medium">
              GENERAL
            </p>
            <SettingsNavItem icon={User} label="Profile" isActive />
            <SettingsNavItem icon={Settings} label="Preferences" />
            <SettingsNavItem icon={Palette} label="Appearance" />
            <SettingsNavItem icon={Bell} label="Notifications" />
          </div>

          <div className="pb-2">
            <p className="text-sidebar-foreground/60 px-3 pb-2 text-xs font-medium">
              AI & CHAT
            </p>
            <SettingsNavItem icon={Settings} label="Model Settings" />
            <SettingsNavItem icon={Database} label="Chat History" />
          </div>

          <div className="pb-2">
            <p className="text-sidebar-foreground/60 px-3 pb-2 text-xs font-medium">
              SECURITY
            </p>
            <SettingsNavItem icon={Key} label="Authentication" />
            <SettingsNavItem icon={Shield} label="Privacy" />
          </div>

          <div className="pb-2">
            <p className="text-sidebar-foreground/60 px-3 pb-2 text-xs font-medium">
              SUPPORT
            </p>
            <SettingsNavItem icon={HelpCircle} label="Help & Docs" />
          </div>
        </nav>
      </div>

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
