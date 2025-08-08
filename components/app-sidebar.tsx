"use client";

import { PlusIcon } from "@/components/icons";
import { Main } from "@/components/main-container";
import { SidebarHistory } from "@/components/sidebar-history";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import { SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { useResizable } from "@/hooks/use-resizable";
import type { User } from "next-auth";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const { width, startResizing, sidebarRef } = useResizable({
    initialWidth: 280,
    minWidth: 200,
    maxWidth: 500
  });

  return (
    <Main.Sidebar
      ref={sidebarRef}
      collapsible="none"
      width={width}
      onResizeStart={startResizing}
    >
      <Main.SidebarHeader>
        <h2 className="text-[13px] font-normal">Chat</h2>
        <span className="flex-auto">&nbsp;</span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              className="h-fit p-2"
              onClick={() => {
                setOpenMobile(false);
                router.push("/");
                router.refresh();
              }}
            >
              <PlusIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent align="end">New Chat</TooltipContent>
        </Tooltip>
      </Main.SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <Main.SidebarFooter>
        {user && <SidebarUserNav user={user} />}
      </Main.SidebarFooter>
    </Main.Sidebar>
  );
}
