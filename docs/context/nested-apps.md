# Nested Apps Setup Guide

This guide explains how to create new nested applications within the `app/(app)/` directory following the established architecture patterns.

## Overview

The tinman-chat application uses a nested app pattern where:
- `app/(app)/layout.tsx` serves as the main application shell with navigation
- Each route (e.g., `/chat`, `/settings`, `/help`) is a separate nested app
- Each nested app has its own layout using the `Main` container system
- Navigation is handled automatically by the app shell

## Creating a New Nested App

### Step 1: Add Navigation Button

First, add your route to the navigation in `app/(app)/layout.tsx`:

```typescript
// In the NavGroup section, add your new route
<NavButton
  to="/your-route"
  icon={<YourIcon className="h-[18px] w-[18px]" />}
  className="mb-1"
/>
```

### Step 2: Create Directory Structure

Create the directory structure for your nested app:

```
app/(app)/your-route/
├── layout.tsx          # Required: App layout with Main.Root
├── page.tsx           # Required: Main page content
└── [optional]/        # Optional: Nested routes
    └── page.tsx
```

### Step 3: Create Layout File

Create `app/(app)/your-route/layout.tsx` following the chat app pattern:

```typescript
import { Main } from "@/components/main-container";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { auth } from "../../(auth)/auth";
import { YourAppSidebar } from "@/components/your-app-sidebar"; // Optional

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
        {/* Optional: Add your app-specific sidebar */}
        <YourAppSidebar user={session?.user} />
        <Main.Content>{children}</Main.Content>
      </Main.Root>
    </SidebarProvider>
  );
}
```

### Step 4: Create Page File

Create `app/(app)/your-route/page.tsx`:

```typescript
import { redirect } from "next/navigation";
import { auth } from "../../(auth)/auth";

export default async function Page() {
  const session = await auth();

  // Optional: Redirect unauthenticated users
  if (!session) {
    redirect("/api/auth/guest");
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Your app content here */}
      <h1>Your App</h1>
      <p>Content goes here...</p>
    </div>
  );
}
```

## Main Container Components

The `Main` namespace provides consistent layout components:

### Core Components

- **`Main.Root`**: Container for the entire app content area
- **`Main.Content`**: Main content area (uses `SidebarInset`)
- **`Main.Header`**: Header with sidebar trigger and content
- **`Main.Body`**: Scrollable body content area

### Sidebar Components

- **`Main.Sidebar`**: Custom sidebar component (resizable)
- **`Main.SidebarHeader`**: Header for custom sidebars
- **`Main.SidebarFooter`**: Footer for custom sidebars

### Example Usage

```typescript
return (
  <SidebarProvider defaultOpen={!isCollapsed}>
    <Main.Root>
      <Main.Sidebar>
        <Main.SidebarHeader>
          <h2>App Sidebar</h2>
        </Main.SidebarHeader>
        {/* Sidebar content */}
        <Main.SidebarFooter>
          {/* Footer content */}
        </Main.SidebarFooter>
      </Main.Sidebar>
      <Main.Content>
        <Main.Header>
          <h1>Page Title</h1>
        </Main.Header>
        <Main.Body>
          {/* Scrollable content */}
        </Main.Body>
      </Main.Content>
    </Main.Root>
  </SidebarProvider>
);
```

## Creating Custom Sidebars

If your app needs a custom sidebar, create it in `components/`:

```typescript
// components/your-app-sidebar.tsx
import { Main } from "@/components/main-container";
import { User } from "@/lib/db/schema";

interface YourAppSidebarProps {
  user?: User;
}

export function YourAppSidebar({ user }: YourAppSidebarProps) {
  return (
    <Main.Sidebar>
      <Main.SidebarHeader>
        <div className="flex items-center gap-2">
          <h2 className="font-medium">Your App</h2>
        </div>
      </Main.SidebarHeader>
      
      <div className="flex-1 p-2">
        {/* Sidebar content */}
        <nav>
          <ul>
            <li>Navigation item 1</li>
            <li>Navigation item 2</li>
          </ul>
        </nav>
      </div>

      <Main.SidebarFooter>
        {/* Footer content like user info */}
        {user && <div>Welcome, {user.email}</div>}
      </Main.SidebarFooter>
    </Main.Sidebar>
  );
}
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

## Example: Settings App

Here's a complete example for a settings app:

### Navigation Button

```typescript
// In app/(app)/layout.tsx
<NavButton
  to="/settings"
  icon={<Settings className="h-[18px] w-[18px]" />}
  className="mb-1"
/>
```

### Layout

```typescript
// app/(app)/settings/layout.tsx
import { Main } from "@/components/main-container";
import { SettingsSidebar } from "@/components/settings-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { auth } from "../../(auth)/auth";

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
        <SettingsSidebar user={session?.user} />
        <Main.Content>{children}</Main.Content>
      </Main.Root>
    </SidebarProvider>
  );
}
```

### Page

```typescript
// app/(app)/settings/page.tsx
import { redirect } from "next/navigation";
import { auth } from "../../(auth)/auth";
import { Main } from "@/components/main-container";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/guest");
  }

  return (
    <>
      <Main.Header>
        <h1 className="font-semibold">Settings</h1>
      </Main.Header>
      <Main.Body className="p-4">
        <div className="max-w-2xl">
          <h2 className="text-lg font-medium mb-4">General Settings</h2>
          {/* Settings form components */}
        </div>
      </Main.Body>
    </>
  );
}
```

## Best Practices

### Layout Consistency
- Always use `Main.Root` as the container
- Use `Main.Content` for the main content area
- Include `SidebarProvider` for sidebar functionality

### Authentication
- Check authentication in page components, not layouts
- Redirect unauthenticated users to `/api/auth/guest`
- Pass user data to components via props

### Styling
- Follow existing Tailwind classes and patterns
- Use consistent spacing and colors from the design system
- Leverage shadcn/ui components where possible

### Performance
- Use `experimental_ppr = true` for pages that can benefit from PPR
- Implement proper loading states
- Consider data streaming for real-time features

This architecture ensures consistency across all nested apps while providing flexibility for app-specific functionality.