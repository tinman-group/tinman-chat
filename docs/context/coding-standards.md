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
// Good - Type definitions and imports with Zod v4
import type { Session } from 'next-auth';
import type { ChatMessage, Attachment } from '@/lib/types';
import { z } from 'zod';  // v4: Use subpath import for new schemas

// Schema definition with v4 patterns
export const messageMetadataSchema = z.object({
  createdAt: z.string(),
  messageId: z.uuid(),        // v4: Direct UUID validation
  userId: z.uuid()            // v4: Enhanced type safety
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

// Function with proper typing
async function processChat(
  messages: ChatMessage[],
  userId: string,
  session: Session | null = null
): Promise<{ success: boolean; data?: any }> {
  // Implementation with enhanced validation
}
```

### Naming Conventions

- **Interfaces/Types**: PascalCase (e.g., `ChatMessage`, `UserSession`)
- **Components**: PascalCase (e.g., `ChatHeader`, `MultimodalInput`)
- **Functions/Variables**: camelCase (e.g., `sendMessage`, `isReadonly`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_MESSAGE_LENGTH`, `API_BASE_URL`)
- **Files**: kebab-case for components (e.g., `chat-header.tsx`), camelCase for utilities
- **Schemas**: camelCase with `Schema` suffix (e.g., `messageMetadataSchema`)

## Zod Schema Patterns (v4+)

### Zod v4 Import Standards (REQUIRED)

- **Import from v4 subpath**: Use `import { z } from 'zod'` for new schemas
- **Legacy compatibility**: Use `import { z } from 'zod'` for gradual migration
- **Type inference**: Always use `z.infer<typeof schema>` for type generation

```typescript
// Good - Zod v4 imports and patterns
import { z } from 'zod';
import type { z as ZodV3 } from 'zod'; // If legacy compatibility needed

// v4 enhanced validation patterns
const userSchema = z.object({
  id: z.uuid(),                    // v4: Direct function instead of z.string().uuid()
  email: z.email(),               // v4: Direct function instead of z.string().email()
  website: z.url().optional(),    // v4: Direct function instead of z.string().url()
  role: z.enum(['user', 'admin'])
});

export type User = z.infer<typeof userSchema>;
```

### String Validation Patterns

- **Use top-level functions**: Zod v4 provides direct validation functions
- **Enhanced performance**: Top-level functions are more tree-shakable
- **Stricter validation**: v4 functions provide better format checking

```typescript
// Good - v4 patterns
const contactSchema = z.object({
  email: z.email(),                          // Instead of z.string().email()
  id: z.uuid(),                              // Instead of z.string().uuid()
  website: z.url(),                          // Instead of z.string().url()
  ipAddress: z.ipv4(),                       // v4: Split into ipv4() and ipv6()
  phone: z.string().min(10).max(15)          // Regular string validation unchanged
});

// Bad - v3 patterns (deprecated in v4)
const oldContactSchema = z.object({
  email: z.string().email(),                 // Deprecated
  id: z.string().uuid(),                     // Deprecated
  website: z.string().url(),                 // Deprecated
  ipAddress: z.string().ip()                 // Deprecated (use z.ipv4() or z.ipv6())
});
```

### Error Message Customization

- **Use error parameter**: Zod v4 replaces `message` with `error`
- **Enhanced error formatting**: Leverage v4's improved error display
- **Consistent error structure**: Maintain standardized error responses

```typescript
// Good - v4 error customization
const passwordSchema = z.string()
  .min(8, { error: 'Password must be at least 8 characters' })
  .max(128, { error: 'Password cannot exceed 128 characters' })
  .regex(/[A-Z]/, { error: 'Password must contain uppercase letter' })
  .regex(/[a-z]/, { error: 'Password must contain lowercase letter' })
  .regex(/[0-9]/, { error: 'Password must contain number' });

const fileUploadSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      error: 'File size must be less than 5MB'              // v4: error instead of message
    })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      error: 'File must be JPEG or PNG format'              // v4: error instead of message
    })
});

// Bad - v3 patterns (deprecated in v4)
const oldPasswordSchema = z.string()
  .min(8, { message: 'Password too short' })                // Deprecated: message parameter
  .min(8, 'Password too short');                           // Deprecated: string shorthand
```

### Enhanced Optional Property Handling

- **Use z.interface()**: Better optional semantics than z.object()
- **Clear optional vs undefined**: Distinguish key optional from value optional
- **Default value behavior**: v4 applies defaults even in optional fields

```typescript
// Good - v4 enhanced optional handling
const messageSchema = z.interface({
  id: z.uuid(),
  content: z.string().optional(),                          // Key optional: may be omitted
  metadata: z.object({
    timestamp: z.string(),
    edited: z.boolean().default(false)                     // Applied even if optional
  }).optional(),
  attachments: z.array(z.object({
    url: z.url(),
    type: z.enum(['image', 'file'])
  })).default([])                                          // v4: Default applied in optional
});

// Enhanced type inference with v4
export type Message = z.infer<typeof messageSchema>;
// Result: { id: string; content?: string; metadata?: {...}; attachments: Array<...> }
```

### Object Schema Patterns

- **Use z.strictObject()**: Replace `.strict()` method calls
- **Use z.looseObject()**: Replace `.passthrough()` method calls
- **Prefer z.interface()**: For better optional property handling

```typescript
// Good - v4 object patterns
const strictUserSchema = z.strictObject({                  // v4: Direct function
  name: z.string(),
  email: z.email()
});

const looseConfigSchema = z.looseObject({                  // v4: Direct function
  apiKey: z.string(),
  timeout: z.number().default(5000)
});

// Bad - v3 patterns (deprecated in v4)
const oldStrictSchema = z.object({
  name: z.string()
}).strict();                                               // Deprecated

const oldLooseSchema = z.object({
  apiKey: z.string()
}).passthrough();                                          // Deprecated
```

### AI SDK Integration Patterns

- **Use compatibility adapter**: Handle AI SDK integration during transition
- **Maintain type safety**: Preserve type inference through adapter layer
- **Stream validation**: Enhanced patterns for streaming object validation

```typescript
// AI SDK compatibility pattern
import { z } from 'zod';
import { AISDKZodV4Adapter } from '@/lib/ai/zod-v4-adapter';

const toolParameterSchema = z.object({
  title: z.string().min(1, { error: 'Title is required' }),
  kind: z.enum(['code', 'text', 'image', 'sheet'])
});

export const createDocumentTool = tool({
  description: 'Create a new document',
  inputSchema: AISDKZodV4Adapter.createStreamingToolSchema(
    toolParameterSchema
  ).aiSdkSchema,                                          // AI SDK compatible
  execute: async (params) => {
    // Validate with v4 for enhanced type safety
    const validatedParams = toolParameterSchema.parse(params);
    // Enhanced type inference available here
  }
});
```

### Performance Optimization Patterns

- **Tree-shakable imports**: Use direct function imports when possible
- **Complex schema caching**: Cache parsed schemas for repeated use
- **Validation timing**: Use safeParse for non-critical validation

```typescript
// Performance-optimized patterns
import { z, email, uuid, url } from 'zod';            // Tree-shakable imports

// Cache complex schemas
const complexUserSchema = z.object({
  profile: z.interface({
    personal: z.object({
      email: email(),                                    // Direct import
      id: uuid()                                         // Direct import
    }),
    settings: z.object({
      theme: z.enum(['light', 'dark']).default('light'),
      notifications: z.boolean().default(true)
    })
  })
});

// Use safeParse for non-critical validation
export const validateOptionalData = (data: unknown) => {
  const result = complexUserSchema.safeParse(data);
  return result.success ? result.data : null;
};

// Use parse for critical validation (throws on error)
export const validateRequiredData = (data: unknown) => {
  return complexUserSchema.parse(data);                  // Will throw if invalid
};
```

### Error Handling Patterns

- **Enhanced error formatting**: Leverage v4's improved error messages
- **Structured error responses**: Maintain consistent API error format
- **Development vs production errors**: Different detail levels by environment

```typescript
// Enhanced error handling with v4
import { z } from 'zod';

export const validateApiRequest = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // v4: Enhanced error formatting
      const formattedError = process.env.NODE_ENV === 'development' 
        ? error.format()                                  // Detailed in development
        : error.errors[0]?.message || 'Validation failed'; // Simple in production
      
      return { 
        success: false, 
        error: typeof formattedError === 'string' 
          ? formattedError 
          : JSON.stringify(formattedError)
      };
    }
    throw error; // Re-throw non-Zod errors
  }
};

// Usage in API routes
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validateApiRequest(requestSchema, body);
  
  if (!validation.success) {
    return Response.json(
      { data: null, error: { message: validation.error, code: 'VALIDATION_ERROR' } },
      { status: 400 }
    );
  }
  
  // validation.data is fully type-safe here
  return Response.json({ data: processRequest(validation.data) });
}
```

### Migration Patterns

- **Gradual migration**: Use dual imports during transition
- **Feature flags**: Control v4 adoption with environment variables
- **Backward compatibility**: Maintain existing API contracts

```typescript
// Gradual migration pattern
import { z } from 'zod';
import { z as zv3 } from 'zod';

// Feature flag for gradual rollout
const useZodV4 = process.env.ENABLE_ZOD_V4 === 'true';

export const createValidationSchema = () => {
  if (useZodV4) {
    // v4 enhanced schema
    return z.object({
      email: z.email(),
      id: z.uuid()
    });
  } else {
    // v3 legacy schema  
    return zv3.object({
      email: zv3.string().email(),
      id: zv3.string().uuid()
    });
  }
};
```

## Next.js & React Patterns

### React Import Standards (REQUIRED)

- **Always import directly from React**: Use named imports like `import { useState } from 'react'`
- **Never use React namespace**: Avoid `import React from 'react'` or `import * as React from 'react'`
- **Direct hook usage**: Use `useState(...)` not `React.useState(...)`

```typescript
// Good - Direct imports
import { useState, useEffect, useCallback } from 'react';
import type { ComponentProps, ReactNode } from 'react';

// Bad - Namespace imports
import * as React from 'react';
import React from 'react';
```

### Component Generation Standards

- **Always use shadcn/ui**: When creating new UI components, use shadcn/ui CLI whenever possible
- **Use latest version**: Run `npx shadcn@latest add [component-name]` for new components
- **Check existing components**: Before creating custom components, verify if shadcn/ui has a suitable option
- **Follow shadcn patterns**: When extending shadcn components, maintain their composition patterns

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
// Proper input validation with Zod v4 patterns
import { z } from 'zod';

const chatRequestSchema = z.object({
  message: z.string().min(1).max(10000),
  chatId: z.uuid(),                                    // v4: Direct UUID validation
  visibility: z.enum(['public', 'private'])
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