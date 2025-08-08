import { auth } from "@/app/(auth)/auth";
import { Main } from "@/components/main-container";
import { PropsWithChildren } from "react";
import { AgentsSidebar } from "./sidebar";

export const experimental_ppr = true;

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <Main.Root>
      <AgentsSidebar user={session?.user} />
      {children}
    </Main.Root>
  );
}
