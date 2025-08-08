import { NavSidebar } from "@/components/nav-sidebar";
import { FolderOpen, HelpCircle, MessagesSquare, Settings } from "lucide-react";
import Script from "next/script";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <div
        className="bg-sidebar relative flex h-full w-full overflow-hidden"
        style={{ overscrollBehavior: "none" }}
      >
        <NavSidebar
          items={[
            { to: "/chat", icon: <MessagesSquare /> },
            { to: "/agents", icon: <FolderOpen /> }
          ]}
          footer={[
            { to: "/settings", icon: <Settings /> },
            { to: "/help", icon: <HelpCircle /> }
          ]}
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </>
  );
}
