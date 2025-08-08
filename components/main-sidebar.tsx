"use client";

import { useResizable } from "@/hooks/use-resizable";
import { cx } from "class-variance-authority";
import { ComponentProps, PropsWithChildren } from "react";
import {
  Sidebar as BaseSidebar,
  SidebarFooter as BaseSidebarFooter,
  SidebarHeader as BaseSidebarHeader
} from "./ui/sidebar";

export function MainSidebar({
  children,
  className,
  width: initialWidth = 280,
  minWidth = 200,
  maxWidth = 500,
  style,
  ...props
}: ComponentProps<typeof BaseSidebar> & {
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}) {
  const { width, startResizing, sidebarRef } = useResizable({
    initialWidth,
    minWidth,
    maxWidth
  });

  return (
    <BaseSidebar
      ref={sidebarRef}
      className={cx("border-sidebar-border relative border-r", className)}
      style={{
        width: width ? `${width}px` : undefined,
        minWidth: width ? `${width}px` : undefined,
        maxWidth: width ? `${width}px` : undefined,
        ...style
      }}
      collapsible="none"
      {...props}
    >
      {children}
      {startResizing && (
        <div
          className="hover:bg-sidebar-accent/80 group absolute top-0 right-0 h-full w-1 cursor-col-resize transition-colors"
          onMouseDown={startResizing}
        >
          <div className="bg-sidebar-border group-hover:bg-sidebar-accent-foreground/20 absolute top-1/2 right-0 h-8 w-1 -translate-y-1/2 transform rounded-l transition-colors" />
        </div>
      )}
    </BaseSidebar>
  );
}

export namespace MainSidebar {
  export const Header = ({
    title,
    children
  }: PropsWithChildren<{ title?: string }>) => (
    <BaseSidebarHeader className="border-sidebar-border flex h-[48px] flex-row items-center border-b px-3">
      {title && (
        <>
          <h2 className="font-medium">{title}</h2>
          <span className="flex-auto">&nbsp;</span>
        </>
      )}
      {children}
    </BaseSidebarHeader>
  );

  export const Footer = ({ children }: PropsWithChildren) => (
    <BaseSidebarFooter className="border-sidebar-border h-[48px] border-t px-3">
      {children}
    </BaseSidebarFooter>
  );
}
