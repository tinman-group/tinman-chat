# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `pnpm dev` - Starts Next.js development server with Turbo
- **Build**: `pnpm build` - Runs database migrations and builds the application
- **Linting**: `pnpm lint` - Runs ESLint with auto-fix
- **Formatting**: `pnpm format` - Formats code with Prettier
- **Testing**: `pnpm test` - Runs Playwright e2e tests

## Database Commands

- **Generate migrations**: `pnpm db:generate` - Creates new migration files
- **Run migrations**: `pnpm db:migrate` - Applies pending migrations
- **Database studio**: `pnpm db:studio` - Opens Drizzle Kit database studio
- **Push schema**: `pnpm db:push` - Push schema changes directly to database
- **Pull schema**: `pnpm db:pull` - Pull current database schema

## Architecture Overview

This is an AI chatbot application built with Next.js 15, AI SDK, and Drizzle ORM. The architecture follows a modern full-stack pattern with:

### Core Technologies
- **Frontend**: Next.js 15 with App Router, React 19, Tailwind CSS, shadcn/ui components
- **AI**: AI SDK with xAI Grok models (primary), supports model switching
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: NextAuth.js v5
- **Storage**: Vercel Blob for file uploads
- **Caching**: Redis for resumable streams (optional)

### Key Directories

- **`app/(chat)/`**: Main chat interface and API routes
- **`app/(auth)/`**: Authentication pages and logic
- **`artifacts/`**: Artifact handling for code, text, images, and sheets
- **`components/`**: React components including UI primitives from shadcn/ui
- **`lib/`**: Core business logic, utilities, and configurations
  - `lib/ai/`: AI providers, models, prompts, and tools
  - `lib/db/`: Database schema, queries, and migrations
  - `lib/artifacts/`: Artifact processing logic

### Database Schema
Uses Drizzle ORM with PostgreSQL. Key entities:
- **Users**: Authentication and user management
- **Chats**: Chat conversations with visibility settings
- **Messages**: Supports both deprecated (Message) and current (Message_v2) formats
- **Documents**: Artifacts (code, text, image, sheet) with versioning
- **Suggestions**: Document editing suggestions
- **Votes**: Message voting system
- **Streams**: Resumable stream tracking

### AI Integration
- **Primary Model**: xAI Grok-2-Vision-1212 for chat
- **Reasoning Model**: Grok-3-Mini-Beta with reasoning extraction
- **Tools**: Weather, document creation/updates, suggestions
- **Resumable Streams**: Redis-backed stream resumption for long responses

### Message Parts Architecture
The system uses a "parts" architecture for messages instead of simple content strings:
- Messages contain `parts` array with different content types (text, code, images)
- Supports multimodal inputs and rich message formatting
- Migration path exists from deprecated Message table to Message_v2

### Artifacts System
Special documents that can be created and edited:
- **Code artifacts**: Interactive code editors with syntax highlighting
- **Text artifacts**: Rich text editing with ProseMirror
- **Image artifacts**: Image generation and editing
- **Sheet artifacts**: Spreadsheet functionality with CSV support

## Development Notes

- Uses pnpm as package manager
- Database migrations run automatically during build
- Environment variables in `.env.example` need to be configured
- Test environment uses mock AI models instead of real API calls
- Supports both authenticated and guest users
- Rate limiting by user type (registered vs guest)
- Resumable streams require Redis configuration

## Code Style Guidelines

When generating or modifying code, follow these formatting conventions that match the project's Prettier and ESLint configuration:

### Formatting Rules
- **Quotes**: Use double quotes (`"`) not single quotes (`'`)
- **Semicolons**: Always include semicolons at the end of statements
- **Trailing Commas**: Do not use trailing commas
- **Indentation**: Use 2 spaces for indentation, no tabs
- **Line Length**: Maximum 80 characters per line
- **Line Endings**: Use LF (`\n`) line endings
- **Prose Wrap**: Always wrap prose text

### TypeScript/ESLint Rules
- **Explicit Any**: `any` type is allowed when necessary
- **Unused Variables**: Unused variables are permitted
- **Empty Object Types**: Empty object types (`{}`) are allowed
- **Error Suppression**: Use `@ts-expect-error` instead of `@ts-ignore` for TypeScript error suppression

### Code Conventions
- Use modern ECMAScript features (ES2022+)
- Prefer ES modules (`import`/`export`) syntax
- Follow React and Next.js best practices
- Use Tailwind CSS classes in the order specified by the prettier-plugin-tailwindcss

## Testing

- Playwright for e2e testing
- Test command: `pnpm test`
- Tests include chat functionality, artifacts, reasoning, and session management
- Mock AI providers used in test environment
- use @ts-expect-error instead of @ts-ignore