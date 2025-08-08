"use client";

import { Button } from "@/components/ui/button";
import { HelpCircle, MessagesSquare, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";

interface NavButtonProps {
  to: string;
  icon: ReactNode;
  className?: string;
}

const NavButton = ({ to, icon, className = "" }: NavButtonProps) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to}>
      <Button
        variant="ghost"
        size="icon"
        className={`hover:bg-sidebar-foreground/20 h-[36px] w-[36px] rounded-sm ${
          isActive
            ? "bg-sidebar-foreground/15 text-sidebar-foreground/80"
            : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
        } ${className}`}
      >
        {icon}
      </Button>
    </Link>
  );
};

const NavGroup = ({ children, ...props }: PropsWithChildren) => (
  <div className="flex flex-col items-center py-3" {...props}>
    {children}
  </div>
);

export function NavSidebar() {
  return (
    <aside className="flex h-full w-[48px] flex-col px-2">
      <NavGroup>
        <NavButton
          to="/chat"
          icon={<MessagesSquare className="h-[18px] w-[18px]" />}
          className="mb-1"
        />
      </NavGroup>

      {/* Spacer to push bottom items down */}
      <div className="flex-1" />

      {/* Bottom section with settings and help */}
      <NavGroup>
        <NavButton
          to="/settings"
          icon={<Settings className="h-[18px] w-[18px]" />}
          className="mb-1"
        />
        <NavButton
          to="/help"
          icon={<HelpCircle className="h-[18px] w-[18px]" />}
        />
      </NavGroup>
    </aside>
  );
}
