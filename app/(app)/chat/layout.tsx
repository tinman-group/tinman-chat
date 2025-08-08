import { AppSidebar } from "@/components/app-sidebar";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { Main } from "@/components/main-container";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { auth } from "../../(auth)/auth";

export const experimental_ppr = true;

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get("sidebar:state")?.value !== "true";

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <Main.Root>
        <DataStreamProvider>
          <AppSidebar user={session?.user} />
          <Main.Content>{children}</Main.Content>
        </DataStreamProvider>
      </Main.Root>
    </SidebarProvider>
  );
}
