# Nested Apps Setup Guide

This guide explains how to create new nested applications within the `app/(app)/` directory following the established architecture patterns.

## Overview

The tinman-chat application uses a nested app pattern where:
- `app/(app)/layout.tsx` serves as the main application shell with navigation
- Each route (e.g., `/chat`, `/settings`, `/agents`) is a separate nested app
- Each nested app has its own layout using the `Main` container system
- Navigation is handled automatically by the app shell using `NavSidebar`

## Creating a New Nested App

### Step 1: Add Navigation Item

Navigation is configured in `app/(app)/layout.tsx` using the `NavSidebar` component:

```typescript
// In the NavSidebar component, add your new route
<NavSidebar
  items={[
    { to: "/chat", icon: <MessagesSquare /> },
    { to: "/agents", icon: <FolderOpen /> },
    { to: "/your-route", icon: <YourIcon /> }
  ]}
  footer={[
    { to: "/settings", icon: <Settings /> },
    { to: "/help", icon: <HelpCircle /> }
  ]}
/>
```

### Step 2: Create Directory Structure

Create the directory structure for your nested app:

```
app/(app)/your-route/
├── layout.tsx          # Required: App layout with Main.Root
├── page.tsx           # Required: Main page content
├── sidebar.tsx        # Required: App-specific sidebar component
└── [optional]/        # Optional: Nested routes
    └── page.tsx
```

### Step 3: Create Layout File

Create `app/(app)/your-route/layout.tsx` following the current pattern:

```typescript
import { auth } from "@/app/(auth)/auth";
import { Main } from "@/components/main-container";
import { PropsWithChildren } from "react";
import { YourAppSidebar } from "./sidebar";

export const experimental_ppr = true;

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <Main.Root>
      <YourAppSidebar user={session?.user} />
      <Main.Content>{children}</Main.Content>
    </Main.Root>
  );
}
```

### Step 4: Create Sidebar Component

Create `app/(app)/your-route/sidebar.tsx` as a client component using `MainSidebar` and `SidebarGroup`/`SidebarMenu` components:

```typescript
"use client";

import { MainSidebar } from "@/components/main-sidebar";
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu 
} from "@/components/ui/sidebar";
import { User } from "@/lib/db/schema";
import { YourIcon, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  icon: React.ComponentType;
  label: string;
  href: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

interface YourAppSidebarProps {
  user?: User;
  menuGroups?: MenuGroup[];
}

export function YourAppSidebar({ 
  user, 
  menuGroups = defaultMenuGroups 
}: YourAppSidebarProps) {
  const pathname = usePathname();

  return (
    <MainSidebar>
      <MainSidebar.Header>
        <div className="flex items-center gap-2">
          <YourIcon className="h-5 w-5" />
          <h2 className="font-medium">Your App</h2>
        </div>
      </MainSidebar.Header>
      
      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroup.Label>{group.label}</SidebarGroup.Label>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenu.Item key={item.href}>
                    <SidebarMenu.Button asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenu.Button>
                  </SidebarMenu.Item>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <MainSidebar.Footer>
        {user && (
          <div className="text-muted-foreground px-2 py-1.5 text-xs">
            Welcome, {user.email}
          </div>
        )}
      </MainSidebar.Footer>
    </MainSidebar>
  );
}

// Default menu structure - can be overridden via props
const defaultMenuGroups: MenuGroup[] = [
  {
    label: "Main",
    items: [
      { icon: Users, label: "Overview", href: "/your-route" },
      { icon: Settings, label: "Settings", href: "/your-route/settings" }
    ]
  }
];
```

### Step 5: Create Page File

Create `app/(app)/your-route/page.tsx`:

```typescript
import { Main } from "@/components/main-container";
import { redirect } from "next/navigation";
import { auth } from "../../(auth)/auth";

export default async function YourAppPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  return (
    <>
      <Main.Header>
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Your App</h1>
        </div>
      </Main.Header>
      <Main.Body className="p-4">
        <div className="max-w-6xl">
          {/* Your app content here */}
          <h2 className="text-lg font-medium mb-4">App Content</h2>
          <p>Your main application content goes here...</p>
        </div>
      </Main.Body>
    </>
  );
}
```

## Main Container Components

The `Main` namespace provides consistent layout components:

### Core Components

- **`Main.Root`**: Container for the entire app content area (includes SidebarProvider)
- **`Main.Content`**: Main content area (uses `SidebarInset`)
- **`Main.Header`**: Header with sidebar trigger and content
- **`Main.Body`**: Scrollable body content area

## Sidebar Architecture

### MainSidebar Component

The `MainSidebar` component provides a resizable sidebar with consistent styling:

**Key Features:**
- **Resizable**: Users can drag to resize the sidebar width
- **Client Component**: Marked with "use client" for interactivity
- **Consistent Styling**: Follows the app's design system
- **Structured Layout**: Header, content area, and footer sections

**MainSidebar Components:**
- **`MainSidebar`**: Main container with resizing functionality
- **`MainSidebar.Header`**: Header section with optional title prop
- **`MainSidebar.Footer`**: Footer section for user info or actions

### Sidebar Content Components

**Always use these shadcn/ui sidebar components inside `SidebarContent`:**

- **`SidebarContent`**: Wrapper for all sidebar content (replaces manual div containers)
- **`SidebarGroup`**: Groups related menu items with consistent spacing
- **`SidebarGroup.Label`**: Section headers with consistent styling
- **`SidebarMenu`**: Container for menu items with proper list semantics
- **`SidebarMenu.Item`**: Individual menu item container
- **`SidebarMenu.Button`**: Interactive menu button with active states
- **`SidebarMenu.Sub`**: Sub-menus for nested navigation
- **`SidebarMenu.SubItem`**: Sub-menu item containers
- **`SidebarMenu.SubButton`**: Sub-menu buttons

### Key Benefits

✅ **Don't recreate these components** - Use the provided sidebar primitives  
✅ **Automatic accessibility** - Proper ARIA labels and keyboard navigation  
✅ **Consistent styling** - Follows design system automatically  
✅ **Active state management** - Built-in support for active/inactive states  
✅ **Responsive behavior** - Mobile-friendly collapsing and interactions

### Making Sidebars Flexible with Props

Instead of hardcoding menu items, make your sidebar components accept props:

```typescript
// Define types for menu structure
interface MenuItem {
  icon: React.ComponentType;
  label: string;
  href: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

interface YourSidebarProps {
  user?: User;
  menuGroups?: MenuGroup[];  // Make it configurable
}

// Usage in layout:
export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();

  const customMenuGroups = [
    {
      label: "Custom Section",
      items: [
        { icon: Star, label: "Special Feature", href: "/agents/special" }
      ]
    }
  ];

  return (
    <Main.Root>
      <YourSidebar 
        user={session?.user} 
        menuGroups={customMenuGroups}  // Override default menu
      />
      <Main.Content>{children}</Main.Content>
    </Main.Root>
  );
}
```

This approach allows:
- **Dynamic menu structures** based on user permissions
- **A/B testing** different navigation layouts
- **Configuration-driven** sidebar content
- **Reusable components** across different contexts
```

## Authentication Patterns

### Required Authentication

```typescript
export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  // App content for authenticated users
}
```

### Optional Authentication

```typescript
export default async function Page() {
  const session = await auth();
  
  return (
    <div>
      {session ? (
        <AuthenticatedContent user={session.user} />
      ) : (
        <PublicContent />
      )}
    </div>
  );
}
```

## State Management

For apps that need global state, consider:

### Context Providers

Add providers to your layout:

```typescript
import { YourStateProvider } from "@/context/your-state";

export default async function Layout({ children }) {
  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <YourStateProvider>
        <Main.Root>
          {/* Layout content */}
        </Main.Root>
      </YourStateProvider>
    </SidebarProvider>
  );
}
```

### Data Streaming

For real-time features, use the DataStreamProvider pattern from the chat app:

```typescript
import { DataStreamProvider } from "@/components/data-stream-provider";

// In your layout
<DataStreamProvider>
  <Main.Content>{children}</Main.Content>
</DataStreamProvider>
```

## API Routes

Shared API routes go in `app/(app)/api/`. Create app-specific routes as needed:

```
app/(app)/api/
├── your-app/
│   ├── route.ts          # Main API endpoint
│   └── [id]/
│       └── route.ts      # Dynamic routes
```

## Complete Example: Agents App

Here's a complete example showing the current patterns:

### Navigation (Already in Layout)

Navigation is configured in `app/(app)/layout.tsx`:

```typescript
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
```

### Layout

```typescript
// app/(app)/agents/layout.tsx
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
      <Main.Content>{children}</Main.Content>
    </Main.Root>
  );
}
```

### Sidebar

```typescript
// app/(app)/agents/sidebar.tsx
"use client";

import { MainSidebar } from "@/components/main-sidebar";
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu 
} from "@/components/ui/sidebar";
import { User } from "@/lib/db/schema";
import { Bot, Cpu, Settings, Users, Activity } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AgentsSidebarProps {
  user?: User;
}

export function AgentsSidebar({ user }: AgentsSidebarProps) {
  const pathname = usePathname();

  const agentGroups = [
    {
      label: "Agent Management",
      items: [
        { icon: Users, label: "Active Agents", href: "/agents" },
        { icon: Activity, label: "Agent Activity", href: "/agents/activity" },
        { icon: Cpu, label: "Agent Templates", href: "/agents/templates" }
      ]
    },
    {
      label: "Configuration",
      items: [
        { icon: Settings, label: "Agent Settings", href: "/agents/settings" }
      ]
    }
  ];

  return (
    <MainSidebar>
      <MainSidebar.Header>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h2 className="font-medium">Agents</h2>
        </div>
      </MainSidebar.Header>
      
      <SidebarContent>
        {agentGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroup.Label>{group.label}</SidebarGroup.Label>
            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenu.Item key={item.href}>
                    <SidebarMenu.Button asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenu.Button>
                  </SidebarMenu.Item>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <MainSidebar.Footer>
        {user && (
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            Welcome, {user.email}
          </div>
        )}
      </MainSidebar.Footer>
    </MainSidebar>
  );
}
```

### Page

```typescript
// app/(app)/agents/page.tsx
import { Main } from "@/components/main-container";
import { redirect } from "next/navigation";
import { auth } from "../../(auth)/auth";
import { Bot, Plus } from "lucide-react";

export default async function AgentsPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  return (
    <>
      <Main.Header>
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Agents</h1>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            New Agent
          </button>
        </div>
      </Main.Header>
      <Main.Body className="p-4">
        <div className="max-w-6xl">
          {/* Your app content */}
        </div>
      </Main.Body>
    </>
  );
}
```

## Best Practices

### Layout Consistency
- Always use `Main.Root` as the container (includes `SidebarProvider`)
- Use `Main.Content` for the main content area
- Create app-specific sidebars using `MainSidebar` component
- Use `Main.Header` and `Main.Body` for consistent page structure

### Sidebar Components
- **Always use "use client"** directive for sidebar components
- Use `MainSidebar` for resizable, consistent sidebars
- **Always use SidebarContent, SidebarGroup, and SidebarMenu** - don't create custom nav structures
- Structure with `MainSidebar.Header`, `SidebarContent`, and `MainSidebar.Footer`
- Make sidebar components flexible by accepting props for menu items instead of hardcoding
- Use `SidebarMenu.Button asChild isActive` pattern with Next.js Link components

### Authentication
- Check authentication in page components, not layouts
- Redirect unauthenticated users to `/api/auth/guest`
- Pass user data to sidebar components via props
- Use server components for layouts, client components for sidebars

### Styling
- Follow existing Tailwind classes and patterns
- Use consistent spacing and colors from the design system
- Leverage shadcn/ui components where possible
- Use proper hover states: `hover:bg-accent hover:text-accent-foreground`

### Performance
- Use `experimental_ppr = true` for pages that can benefit from PPR
- Implement proper loading states
- Consider data streaming for real-time features
- Keep layouts as server components, only mark sidebars as client components

### File Organization
- Keep all nested app files within their respective directories
- Use consistent naming: `layout.tsx`, `page.tsx`, `sidebar.tsx`
- Import from local sidebar file, not from components directory

This architecture ensures consistency across all nested apps while providing flexibility for app-specific functionality.