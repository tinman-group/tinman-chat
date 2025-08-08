# tinman-chat

This is an AI chatbot application for managing agents used to run businesses
owner by Tinman Group. It is multi-tenant, supporting multiple companies and
users within companies. Built with Next.js 15, AI SDK, and Drizzle ORM. The
architecture follows a modern full-stack pattern with:

## Core Technologies

- **Frontend**: Next.js 15 with App Router, React 19, Tailwind CSS, shadcn/ui

  components

- **Backend:** Typescript, Next.js
- **AI**: AI SDK with xAI Grok models (primary), supports model switching
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: NextAuth.js v5
- **Storage**: Vercel Blob for file uploads
- **Caching**: Redis for resumable streams (optional)

## Key Technical Principles

- **Type Safety First**: Comprehensive TypeScript coverage with Zod schema
  validation at all API boundaries. Runtime validation prevents invalid data
  from entering the system.
- **Authentication by Default**: NextAuth.js middleware enforces authentication
  on all routes. Guest users get automatic temporary accounts with rate
  limiting. No unauthenticated access to core functionality.
- **Structured Error Handling**: Custom `ChatSDKError` class with typed error
  codes (`type:surface` format) and appropriate visibility levels. Errors are
  either logged server-side or returned to client based on context.
- **Streaming-First Architecture**: Built around AI SDK streaming primitives
  with resumable streams backed by Redis. Long-running AI responses can be
  paused and resumed across sessions.
- **Schema Evolution Safety**: Dual schema pattern (Message/Message_v2,
  Vote/Vote_v2) allows gradual migration without breaking changes. Database
  migrations are automatic and version-controlled.
- **Multi-Modal Content Architecture**: Message "parts" system supports text,
  images, and files in a unified structure. Artifacts system enables interactive
  code, text, image, and spreadsheet editing.

## Essential Project Knowledge

Following files provide detailed knowledge for use by agents. Load the relevant

knowledge when completing tasks and update as appropriate when updating

knowledge:

- `@docs/context/project-structure.md` - Technologies, services, project files

  and directories

- `@docs/context/coding-standards.md` - Rules for generating code, tests, or

  configs

- `@docs/context/knowledge.md` - Where locate knowledge, how to generate and

  update.

- `@docs/context/deployment.md` - Deployment infrastructure and how to use it
- `@docs/context/handoff.md` - How to organize memory for long running tasks
- `@docs/issues` - Memory and state for open issues currently being worked on by

  agents

- `@docs/specs` - Detailed specs to be designed and then implemented by agent

## Architecture Overview

This is an AI chatbot application built with Next.js 15, AI SDK, and Drizzle

ORM. The architecture follows a modern full-stack pattern with:

### Core Technologies

- **Frontend**: Next.js 15 with App Router, React 19, Tailwind CSS, shadcn/ui

  components

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
- **Messages**: Supports both deprecated (Message) and current (Message_v2)

  formats

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

The system uses a "parts" architecture for messages instead of simple content

strings:

- Messages contain `parts` array with different content types (text, code,

  images)

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
- Test environment uses mock AI models instead of real API calls
- Supports both authenticated and guest users
- Rate limiting by user type (registered vs guest)
- Resumable streams require Redis configuration

Development Commands

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
