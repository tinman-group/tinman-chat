# Coding Standards

When generating or modifying code, follow these formatting conventions that
match the project's Prettier and ESLint configuration:

## Formatting Rules

- **Quotes**: Use double quotes (`"`) not single quotes (`'`)
- **Semicolons**: Always include semicolons at the end of statements
- **Trailing Commas**: Do not use trailing commas (`trailingComma: "none"`)
- **Indentation**: Use 2 spaces for indentation, no tabs
- **Line Length**: Maximum 80 characters per line
- **Line Endings**: Use LF (`\n`) line endings
- **Prose Wrap**: Always wrap prose text
- **Tailwind CSS**: Use classes in the order specified by prettier-plugin-tailwindcss

## TypeScript/ESLint Rules

- **Explicit Any**: `any` type is allowed when necessary
- **Unused Variables**: Unused variables are permitted for development flexibility
- **Empty Object Types**: Empty object types (`{}`) are allowed
- **Error Suppression**: Use `@ts-expect-error` instead of `@ts-ignore` for TypeScript error suppression
- **Type Imports**: Use `import type` for type-only imports

## General Development Principles

### Context Management
- Always read relevant files BEFORE planning changes
- Manage your own context effectively
- When updating documentation, keep updates concise to prevent bloat

### Code Quality
- Write code following KISS, YAGNI, and DRY principles
- When in doubt, follow proven best practices for implementation
- Do not commit to git without user approval
- Always consider industry standard libraries/frameworks first over custom implementations
- Never mock anything. Never use placeholders. Never omit code
- Apply SOLID principles where relevant. Use modern framework features rather than reinventing solutions
- Be brutally honest about whether an idea is good or bad
- Make side effects explicit and minimal

### File Organization & Modularity

- Default to creating multiple small, focused files rather than large monolithic ones
- Each file should have a single responsibility and clear purpose
- Keep files under 350 lines when possible - split larger files by extracting utilities, constants, types, or logical components into separate modules
- Separate concerns: utilities, constants, types, components, and business logic into different files
- Prefer composition over inheritance - use inheritance only for true 'is-a' relationships, favor composition for 'has-a' or behavior mixing
- Follow existing project structure and conventions - place files in appropriate directories. Create new directories and move files if deemed appropriate
- Use well defined sub-directories to keep things organized and scalable
- Structure projects with clear folder hierarchies and consistent naming conventions
- Import/export properly - design for reusability and maintainability

## TypeScript Conventions

### Type Definitions (REQUIRED)

- **Always** use TypeScript types for function parameters and return values
- Use `import type` for type-only imports
- Prefer union types with `|` over complex type constructs when appropriate
- Use Zod schemas for runtime validation and data structures

```typescript
// Good - Type definitions and imports
import type { Session } from 'next-auth';
import type { ChatMessage, Attachment } from '@/lib/types';
import { z } from 'zod';

// Schema definition
export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

// Function with proper typing
async function processChat(
  messages: ChatMessage[],
  userId: string,
  session: Session | null = null
): Promise<{ success: boolean; data?: any }> {
  // Implementation
}
```

### Naming Conventions

- **Interfaces/Types**: PascalCase (e.g., `ChatMessage`, `UserSession`)
- **Components**: PascalCase (e.g., `ChatHeader`, `MultimodalInput`)
- **Functions/Variables**: camelCase (e.g., `sendMessage`, `isReadonly`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_MESSAGE_LENGTH`, `API_BASE_URL`)
- **Files**: kebab-case for components (e.g., `chat-header.tsx`), camelCase for utilities
- **Schemas**: camelCase with `Schema` suffix (e.g., `messageMetadataSchema`)

## Next.js & React Patterns

### Component Structure

```typescript
'use client'; // Only when using client-side features

import type { ComponentProps } from 'react';
import { useState, useEffect } from 'react';
import type { Session } from 'next-auth';

interface ChatProps {
  id: string;
  initialMessages: ChatMessage[];
  session: Session;
  isReadonly?: boolean;
}

export function Chat({
  id,
  initialMessages,
  session,
  isReadonly = false,
}: ChatProps) {
  // Component implementation
}
```

### Server Components vs Client Components

- **Default to Server Components** - Only use `'use client'` when necessary
- **Client Components needed for**:
  - Browser APIs (localStorage, geolocation, etc.)
  - Event handlers (onClick, onChange, etc.)
  - State management (useState, useReducer, etc.)
  - Custom hooks

### API Routes

```typescript
// app/api/chat/route.ts
import { NextRequest } from 'next/server';
import { auth } from '@/app/(auth)/auth';

export const maxDuration = 60; // Vercel function timeout

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    // Process request
    
    return Response.json({ 
      data: result,
      error: null 
    });
  } catch (error) {
    return Response.json(
      { 
        data: null, 
        error: { 
          message: 'Internal server error',
          code: 'INTERNAL_ERROR' 
        } 
      },
      { status: 500 }
    );
  }
}
```

### Custom Hooks

```typescript
// hooks/use-messages.tsx
import { useState, useEffect } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatMessage } from '@/lib/types';

export function useMessages({
  chatId,
  status,
}: {
  chatId: string;
  status: UseChatHelpers<ChatMessage>['status'];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  useEffect(() => {
    // Effect logic
  }, [chatId]);
  
  return {
    messages,
    setMessages,
  };
}
```

## Database & Schema Design

### Drizzle ORM Patterns

```typescript
// lib/db/schema.ts
import type { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  text,
} from 'drizzle-orm/pg-core';

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Chat = InferSelectModel<typeof chat>;
```

### Evolution-Friendly Schema Design

- Design database schema to be evolution-friendly (avoid breaking changes)
- Use migrations for schema changes
- Avoid renaming columns - prefer adding new columns and deprecating old ones
- Use proper foreign key constraints
- Include created/updated timestamps where appropriate

## Security Standards

### Input Validation & Security

- Never trust external inputs - validate everything at the boundaries using Zod
- Keep secrets in environment variables, never in code
- Log security events but never log sensitive data
- Authenticate users at the API route level
- Use NextAuth.js session validation consistently
- Validate all authentication tokens server-side before creating sessions
- Sanitize all user inputs before storing or processing

```typescript
// Proper input validation
import { z } from 'zod';

const chatRequestSchema = z.object({
  message: z.string().min(1).max(10000),
  chatId: z.string().uuid(),
  visibility: z.enum(['public', 'private']),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const validatedData = chatRequestSchema.parse(body); // Will throw if invalid
}
```

## Error Handling

- Use specific error types over generic ones
- Always provide helpful error messages
- Fail securely - errors shouldn't reveal system internals
- Use proper HTTP status codes
- Log errors with sufficient context for debugging

```typescript
// Custom error classes
export class ChatSDKError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ChatSDKError';
  }
}

// Usage in API routes
try {
  // Operation
} catch (error) {
  if (error instanceof ChatSDKError) {
    return Response.json(
      { data: null, error: { message: error.message, code: error.code } },
      { status: error.statusCode }
    );
  }
  
  console.error('Unexpected error:', error);
  return Response.json(
    { data: null, error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
    { status: 500 }
  );
}
```

## State Management

### React State Patterns

- Have one source of truth for each piece of state
- Make state changes explicit and traceable
- Use custom hooks to encapsulate complex state logic
- Prefer composition of simple hooks over complex state managers
- Use SWR for server state management and caching

```typescript
// State management with SWR
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

export function useChatHistory(userId: string) {
  const { data, error, mutate } = useSWR(
    `/api/history?userId=${userId}`,
    fetcher
  );
  
  return {
    chats: data?.data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
```

## API Design Standards

### RESTful Design Patterns

- Use consistent URL patterns following Next.js App Router conventions
- Use HTTP status codes correctly
- Version APIs from day one when needed (`/api/v1/`, `/api/v2/`)
- Support pagination for list endpoints
- Use consistent JSON response format:
  - Success: `{ "data": {...}, "error": null }`
  - Error: `{ "data": null, "error": {"message": "...", "code": "..."} }`

### Response Streaming

- Use AI SDK streaming patterns for real-time responses
- Implement proper error handling for streamed responses
- Support resumable streams for long-running operations

```typescript
// Streaming response pattern
import { streamText } from 'ai';
import { createUIMessageStream } from 'ai';

export async function POST(request: NextRequest) {
  // Authentication and validation
  
  const result = await streamText({
    model: myProvider('grok-2-vision-1212'),
    messages: convertedMessages,
    tools: { createDocument, updateDocument },
    experimental_throttle: 100,
    // Additional options
  });
  
  return createUIMessageStream(result, {
    // Stream configuration
  });
}
```

## Documentation Standards

### Code Documentation

- Every public function should have JSDoc comments
- Include parameter and return type information
- Document complex business logic with inline comments
- Use TypeScript interfaces as living documentation

```typescript
/**
 * Processes chat messages and generates AI responses
 * 
 * @param messages - Array of chat messages to process
 * @param userId - ID of the user making the request
 * @param options - Optional configuration for the chat processing
 * @returns Promise resolving to the processed chat response
 * @throws {ChatSDKError} When user is not authorized or input is invalid
 */
async function processChat(
  messages: ChatMessage[],
  userId: string,
  options?: ChatProcessingOptions
): Promise<ChatResponse> {
  // Implementation
}
```

---

*These standards reflect the current tinman-chat codebase patterns. Update as the project evolves.*