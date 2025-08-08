"use client";

import { PlusIcon } from "@/components/icons";
import { MainSidebar } from "@/components/main-sidebar";
import { SidebarHistory } from "@/components/sidebar-history";
import { SidebarContent, useSidebar } from "@/components/ui/sidebar";
import type { User } from "next-auth";
import { useRouter } from "next/navigation";

export function ChatSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <MainSidebar>
      <MainSidebar.Header title="Chat">
        <MainSidebar.Action
          label="New Chat"
          icon={<PlusIcon />}
          onClick={() => {
            router.push("/chat");
            router.refresh();
          }}
        />
      </MainSidebar.Header>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <MainSidebar.Footer></MainSidebar.Footer>
    </MainSidebar>
  );
}
