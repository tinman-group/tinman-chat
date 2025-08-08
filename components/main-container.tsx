import { cx } from "class-variance-authority";
import { ComponentProps, FC, PropsWithChildren, forwardRef } from "react";
import { Separator } from "./ui/separator";
import {
  Sidebar as BaseSidebar,
  SidebarHeader as BaseSidebarHeader,
  SidebarInset,
  SidebarTrigger
} from "./ui/sidebar";

export namespace Main {
  export const Root = ({ children, ...props }: PropsWithChildren) => (
    <main
      className="border-sidebar-border bg-background relative my-2 mr-2 flex flex-1 flex-row overflow-hidden rounded-md border"
      style={{ overscrollBehavior: "none" }}
    >
      {children}
    </main>
  );

  export const Sidebar = forwardRef<
    HTMLDivElement,
    ComponentProps<typeof BaseSidebar> & {
      onResizeStart?: (e: React.MouseEvent) => void;
      width?: number;
    }
  >(({ children, className, onResizeStart, width, style, ...props }, ref) => (
    <BaseSidebar
      ref={ref}
      className={cx("border-sidebar-border relative border-r", className)}
      style={{
        width: width ? `${width}px` : undefined,
        minWidth: width ? `${width}px` : undefined,
        maxWidth: width ? `${width}px` : undefined,
        ...style
      }}
      {...props}
    >
      {children}
      {onResizeStart && (
        <div
          className="hover:bg-sidebar-accent/80 group absolute top-0 right-0 h-full w-1 cursor-col-resize transition-colors"
          onMouseDown={onResizeStart}
        >
          <div className="bg-sidebar-border group-hover:bg-sidebar-accent-foreground/20 absolute top-1/2 right-0 h-8 w-1 -translate-y-1/2 transform rounded-l transition-colors" />
        </div>
      )}
    </BaseSidebar>
  ));

  export const SidebarHeader = ({ children }: PropsWithChildren) => (
    <BaseSidebarHeader className="border-sidebar-border flex h-[48px] flex-row items-center border-b px-3">
      {children}
    </BaseSidebarHeader>
  );

  export const SidebarFooter = ({ children }: PropsWithChildren) => (
    <BaseSidebarHeader className="border-sidebar-border h-[48px] border-t px-3">
      {children}
    </BaseSidebarHeader>
  );

  export const Content: FC<PropsWithChildren> = (props) => (
    <SidebarInset className="flex flex-1 flex-col overflow-hidden" {...props} />
  );

  export const Header: FC<PropsWithChildren> = ({ children, ...props }) => (
    <header
      className="border-sidebar-border flex h-[48px] items-center gap-2 border-b px-2"
      {...props}
    >
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        decorative
        className="data-[orientation=vertical]:h-[32px]"
      />
      {children}
    </header>
  );

  export const Body: FC<PropsWithChildren> = (props) => (
    <div className="flex min-h-0 flex-1 flex-col" {...props} />
  );
}
