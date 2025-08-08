import { auth } from "@/app/(auth)/auth";
import { Main } from "@/components/main-container";
import { PropsWithChildren } from "react";
import { SettingsSidebar } from "./sidebar";

export const experimental_ppr = true;

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <Main.Root>
      <SettingsSidebar user={session?.user} />
      {children}
    </Main.Root>
  );
}
