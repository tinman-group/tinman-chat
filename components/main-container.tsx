import { FC, HTMLProps, PropsWithChildren } from "react";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";

export namespace Main {
  export const Root = ({ children }: PropsWithChildren) => {
    return (
      <SidebarProvider>
        <main
          className="border-sidebar-border bg-background relative my-2 mr-2 flex flex-1 flex-row overflow-hidden rounded-md border"
          style={{ overscrollBehavior: "none" }}
        >
          {children}
        </main>
      </SidebarProvider>
    );
  };

  export const Content: FC<PropsWithChildren> = (props) => (
    <SidebarInset className="flex flex-1 flex-col overflow-hidden" {...props} />
  );

  export const Header: FC<PropsWithChildren> = ({ children, ...props }) => (
    <header
      className="border-sidebar-border flex h-[48px] items-center gap-2 border-b px-2"
      {...props}
    >
      {/* <SidebarTrigger />
      <Separator
        orientation="vertical"
        decorative
        className="data-[orientation=vertical]:h-[32px]"
      /> */}
      {children}
    </header>
  );

  export const Body: FC<PropsWithChildren<HTMLProps<HTMLDivElement>>> = (
    props
  ) => <div className="flex min-h-0 flex-1 flex-col" {...props} />;
}
