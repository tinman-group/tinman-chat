"use client";

import { PlusIcon } from "@/components/icons";
import { MainSidebar } from "@/components/main-sidebar";
import { SidebarHistory } from "@/components/sidebar-history";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import { SidebarContent, useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import type { User } from "next-auth";
import { useRouter } from "next/navigation";

export function ChatSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <MainSidebar>
      <MainSidebar.Header title="Chat">
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
      </MainSidebar.Header>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <MainSidebar.Footer>
        {user && <SidebarUserNav user={user} />}
      </MainSidebar.Footer>
    </MainSidebar>
  );
}
