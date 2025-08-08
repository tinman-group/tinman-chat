import { auth } from "@/app/(auth)/auth";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { Main } from "@/components/main-container";
import { PropsWithChildren } from "react";
import { ChatSidebar } from "./sidebar";

export const experimental_ppr = true;

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <Main.Root>
      <DataStreamProvider>
        <ChatSidebar user={session?.user} />
        <Main.Content>{children}</Main.Content>
      </DataStreamProvider>
    </Main.Root>
  );
}
