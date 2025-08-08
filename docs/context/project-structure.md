# Project Structure

This document provides the complete technology stack and file structure for the tinman-chat AI chatbot application. **AI agents MUST read this file to understand the project organization before making any changes.**

## Technology Stack

### Core Technologies

- **TypeScript 5.9.2+** with **pnpm 9.12.3** - Dependency management and packaging
- **Next.js 15.3.0-canary.31** - Full-stack React framework with App Router, SSR, and API routes
- **React 19.0.0-rc** - UI library with latest React features and concurrent rendering
- **Node.js ESNext** - Runtime environment with ES modules support

### AI & Machine Learning

- **AI SDK 5.0.0-beta.6** - Vercel's AI SDK for LLM integration and streaming
- **xAI Grok Models (@ai-sdk/xai 2.0.0-beta.2)** - Primary AI provider
  - Grok-2-Vision-1212 for chat conversations
  - Grok-3-Mini-Beta for reasoning extraction
- **Resumable Streams 2.0.0** - Long-running AI response resumption with Redis backing

### Database & Storage

- **PostgreSQL** with **Drizzle ORM 0.34.0+** - Type-safe database operations and migrations
- **@vercel/postgres 0.10.0** - Serverless PostgreSQL connection
- **@vercel/blob 0.24.1** - File storage for uploads and artifacts
- **Redis 5.0.0** - Optional caching for resumable streams

### Authentication & Security

- **NextAuth.js 5.0.0-beta.25** - Authentication with multiple providers
- **bcrypt-ts 5.0.2** - Password hashing
- **Zod 3.25.68** - Runtime type validation and schema validation

### UI Framework & Styling

- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI primitives
- **Radix UI** - Unstyled, accessible UI components
- **Framer Motion 11.3.19** - Animation library
- **Lucide React 0.446.0** - Icon library
- **Geist Font** - Typography with Vercel's Geist font family

### Rich Text & Code Editing

- **ProseMirror** - Rich text editor for text artifacts
- **CodeMirror 6.0.1** - Code editor with syntax highlighting
- **React Data Grid 7.0.0-beta.47** - Spreadsheet functionality for sheet artifacts
- **React Markdown 9.0.1** - Markdown rendering with GitHub Flavored Markdown

### Development & Quality Tools

- **ESLint 9.32.0** - Code linting with TypeScript, React, and accessibility rules
- **Prettier 3.6.2** - Code formatting with Tailwind CSS plugin
- **TypeScript 5.9.2** - Static type checking
- **Playwright 1.50.1** - End-to-end testing framework
- **tsx 4.20.3** - TypeScript execution for build scripts

### Monitoring & Analytics

- **@vercel/analytics 1.3.1** - Web analytics
- **@vercel/otel 1.12.0** - OpenTelemetry integration
- **@opentelemetry/api 1.9.0** - Observability and tracing

## Complete Project Structure

```
tinman-chat/
├── README.md                           # Project overview and setup
├── CLAUDE.md                           # Master AI context file
├── package.json                        # Dependencies and npm scripts
├── pnpm-lock.yaml                      # Lockfile for exact dependency versions
├── .gitignore                          # Git ignore patterns
├── next.config.ts                      # Next.js configuration
├── tsconfig.json                       # TypeScript compiler configuration
├── tailwind.config.ts                  # Tailwind CSS configuration
├── postcss.config.mjs                  # PostCSS configuration
├── eslint.config.ts                    # ESLint configuration
├── playwright.config.ts                # Playwright test configuration
├── drizzle.config.ts                   # Drizzle ORM configuration
├── instrumentation.ts                  # OpenTelemetry instrumentation
├── middleware.ts                       # Next.js middleware for auth
├── components.json                     # shadcn/ui components configuration
├── app/                                # Next.js App Router
│   ├── layout.tsx                      # Root layout with providers
│   ├── page.tsx                        # Home page (redirects to chat)
│   ├── globals.css                     # Global CSS with Tailwind
│   ├── favicon.ico                     # Favicon
│   ├── opengraph-image.png             # Social media preview image
│   ├── twitter-image.png               # Twitter preview image
│   ├── (app)/                          # Main application shell
│   │   ├── layout.tsx                  # App shell with navigation sidebar
│   │   ├── opengraph-image.png         # App-specific social image
│   │   ├── twitter-image.png           # App-specific Twitter image
│   │   ├── actions.ts                  # Shared server actions
│   │   ├── chat/                       # Chat nested app
│   │   │   ├── layout.tsx              # Chat app layout (Main.Root container)
│   │   │   ├── page.tsx                # New chat page
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Individual chat page
│   │   ├── settings/                   # Settings nested app (planned)
│   │   │   ├── layout.tsx              # Settings layout (Main.Root container)
│   │   │   └── page.tsx                # Settings page
│   │   ├── help/                       # Help nested app (planned)
│   │   │   ├── layout.tsx              # Help layout (Main.Root container)  
│   │   │   └── page.tsx                # Help page
│   │   └── api/                        # Shared API routes
│   │       ├── chat/
│   │       │   ├── route.ts            # Chat creation endpoint
│   │       │   ├── schema.ts           # Chat request/response schemas
│   │       │   └── [id]/
│   │       │       └── stream/
│   │       │           └── route.ts    # Streaming chat endpoint
│   │       ├── document/
│   │       │   └── route.ts            # Document/artifact operations
│   │       ├── files/
│   │       │   └── upload/
│   │       │       └── route.ts        # File upload endpoint
│   │       ├── history/
│   │       │   └── route.ts            # Chat history endpoint
│   │       ├── suggestions/
│   │       │   └── route.ts            # AI suggestions endpoint
│   │       └── vote/
│   │           └── route.ts            # Message voting endpoint
│   └── (auth)/                         # Authentication routes
│       ├── auth.config.ts              # NextAuth configuration
│       ├── auth.ts                     # NextAuth setup
│       ├── actions.ts                  # Auth server actions
│       ├── login/
│       │   └── page.tsx                # Login page
│       ├── register/
│       │   └── page.tsx                # Registration page
│       └── api/
│           └── auth/
│               ├── [...nextauth]/
│               │   └── route.ts        # NextAuth API route
│               └── guest/
│                   └── route.ts        # Guest auth endpoint
├── artifacts/                          # Artifact system (code, text, image, sheet)
│   ├── actions.ts                      # Artifact server actions
│   ├── code/
│   │   ├── client.tsx                  # Code editor component
│   │   └── server.ts                   # Code processing logic
│   ├── text/
│   │   ├── client.tsx                  # Rich text editor component
│   │   └── server.ts                   # Text processing logic
│   ├── image/
│   │   ├── client.tsx                  # Image editor component
│   │   └── server.ts                   # Image processing logic
│   └── sheet/
│       ├── client.tsx                  # Spreadsheet component
│       └── server.ts                   # Sheet processing logic
├── components/                         # React components
│   ├── ui/                            # Base UI components (shadcn/ui)
│   │   ├── button.tsx                  # Button component
│   │   ├── input.tsx                   # Input component
│   │   ├── card.tsx                    # Card component
│   │   ├── dropdown-menu.tsx           # Dropdown menu component
│   │   ├── sidebar.tsx                 # Sidebar component
│   │   └── [other-ui-components].tsx   # Other UI primitives
│   ├── chat.tsx                        # Main chat interface
│   ├── messages.tsx                    # Message list component
│   ├── message.tsx                     # Individual message component
│   ├── multimodal-input.tsx            # Input with file upload
│   ├── artifact.tsx                    # Artifact display component
│   ├── app-sidebar.tsx                 # Application sidebar
│   ├── sidebar-history.tsx             # Chat history sidebar
│   ├── model-selector.tsx              # AI model selection
│   ├── code-editor.tsx                 # Code editing interface
│   ├── text-editor.tsx                 # Rich text editing interface
│   ├── image-editor.tsx                # Image editing interface
│   ├── sheet-editor.tsx                # Spreadsheet editing interface
│   ├── auth-form.tsx                   # Authentication forms
│   └── [other-components].tsx          # Additional components
├── hooks/                              # Custom React hooks
│   ├── use-messages.tsx                # Message state management
│   ├── use-artifact.ts                 # Artifact state management
│   ├── use-chat-visibility.ts          # Chat visibility control
│   ├── use-auto-resume.ts              # Stream resumption logic
│   └── [other-hooks].ts                # Additional hooks
├── lib/                                # Core business logic and utilities
│   ├── constants.ts                    # Application constants
│   ├── types.ts                        # TypeScript type definitions
│   ├── utils.ts                        # General utility functions
│   ├── errors.ts                       # Error handling utilities
│   ├── ai/                            # AI integration layer
│   │   ├── models.ts                   # AI model configurations
│   │   ├── models.test.ts              # Model configuration tests
│   │   ├── providers.ts                # AI provider setup
│   │   ├── prompts.ts                  # System prompts and templates
│   │   ├── entitlements.ts             # User entitlements and rate limits
│   │   └── tools/                      # AI tools and function calling
│   │       ├── create-document.ts      # Document creation tool
│   │       ├── update-document.ts      # Document update tool
│   │       ├── request-suggestions.ts  # Suggestion request tool
│   │       └── get-weather.ts          # Weather information tool
│   ├── db/                            # Database layer
│   │   ├── schema.ts                   # Drizzle database schema
│   │   ├── queries.ts                  # Database query functions
│   │   ├── utils.ts                    # Database utilities
│   │   ├── migrate.ts                  # Migration runner
│   │   ├── migrations/                 # Database migration files
│   │   │   ├── 0000_keen_devos.sql     # Initial schema migration
│   │   │   ├── [other-migrations].sql  # Subsequent migrations
│   │   │   └── meta/                   # Migration metadata
│   │   │       ├── _journal.json       # Migration journal
│   │   │       └── [snapshots].json    # Schema snapshots
│   │   └── helpers/                    # Database helper functions
│   │       └── 01-core-to-parts.ts     # Message migration helpers
│   ├── artifacts/                      # Artifact processing logic
│   │   └── server.ts                   # Server-side artifact handling
│   └── editor/                         # Rich text editor configuration
│       ├── config.ts                   # Editor configuration
│       ├── diff.js                     # Diff visualization
│       ├── functions.tsx               # Editor utility functions
│       ├── react-renderer.tsx          # React renderer for editor
│       └── suggestions.tsx             # Suggestion handling
├── tests/                              # Test suite
│   ├── fixtures.ts                     # Test fixtures and data
│   ├── helpers.ts                      # Test helper functions
│   ├── e2e/                           # End-to-end tests
│   │   ├── chat.test.ts               # Chat functionality tests
│   │   ├── artifacts.test.ts          # Artifact system tests
│   │   ├── reasoning.test.ts          # AI reasoning tests
│   │   └── session.test.ts            # Session management tests
│   ├── pages/                         # Page object models
│   │   ├── chat.ts                    # Chat page interactions
│   │   ├── auth.ts                    # Auth page interactions
│   │   └── artifact.ts                # Artifact page interactions
│   ├── prompts/                       # Test prompt utilities
│   │   ├── basic.ts                   # Basic test prompts
│   │   ├── routes.ts                  # Route testing prompts
│   │   └── utils.ts                   # Prompt utilities
│   └── routes/                        # API route tests
│       ├── chat.test.ts               # Chat API tests
│       └── document.test.ts           # Document API tests
├── docs/                               # Documentation
│   ├── context/                        # AI agent context documentation
│   │   ├── project-structure.md        # This file - project structure
│   │   ├── coding-standards.md         # Development standards and patterns
│   │   ├── knowledge.md                # Knowledge management guidelines
│   │   ├── deployment.md               # Deployment and infrastructure
│   │   └── handoff.md                  # Task handoff procedures
│   ├── issues/                         # Issue tracking and memory
│   │   └── example-issue.md            # Issue documentation template
│   └── specs/                          # Feature specifications
│       ├── example-feature.md          # Feature spec template
│       └── example-api-integration.md  # API integration spec template
├── public/                             # Static assets
│   └── images/                         # Image assets
│       ├── demo-thumbnail.png          # Demo thumbnail
│       └── mouth of the seine, monet.jpg # Sample artwork
├── next-env.d.ts                       # Next.js type definitions
└── node_modules/                       # Installed dependencies (ignored)
```

## Key Architecture Patterns

### Nested App Architecture

The application uses a nested app pattern where `app/(app)/` serves as the main application shell with individual nested apps for different functionality areas:

- **App Shell**: `app/(app)/layout.tsx` provides the main navigation sidebar with route buttons
- **Nested Apps**: Each top-level route (e.g., `/chat`, `/settings`, `/help`) is a separate nested app with its own layout
- **Main Container**: Each nested app uses the `Main` container component system for consistent layout
- **Navigation**: Navigation buttons in the app shell automatically highlight the active route

#### Nested App Structure Pattern

Each nested app follows this structure:

```text
app/(app)/{route}/
├── layout.tsx              # App-specific layout using Main.Root
├── page.tsx                # Main page for the app
└── [optional-subroutes]/   # Additional nested routes
    └── page.tsx
```

#### Example: Chat App

The chat app at `app/(app)/chat/` demonstrates the pattern:

- **Layout**: Uses `Main.Root` container with `AppSidebar` and `Main.Content`
- **Authentication**: Checks session and redirects if needed
- **State**: Provides `DataStreamProvider` for real-time features
- **Content**: Renders chat interface within `Main.Content`

### Multi-tenancy Support

- **Company-based isolation**: Users belong to companies with separate data contexts
- **Role-based access**: Different permission levels within companies
- **Rate limiting**: Separate limits for registered vs guest users

### Message Parts Architecture

- **Flexible content**: Messages contain `parts` arrays supporting text, code, images
- **Multimodal support**: Rich content types in conversations
- **Migration strategy**: Gradual migration from deprecated Message to Message_v2

### Artifacts System

- **Interactive documents**: Code, text, image, and sheet artifacts with live editing
- **Versioning**: Document versions with suggestion system
- **Type safety**: Zod schemas for all artifact operations

### AI Integration

- **Provider abstraction**: Support for multiple AI providers through AI SDK
- **Tool calling**: Structured function calling for document operations
- **Resumable streams**: Long-running responses with Redis-backed resumption
- **Reasoning extraction**: Separate reasoning model for enhanced responses

### Development Commands

- **Development**: `pnpm dev` - Next.js with Turbo mode
- **Build**: `pnpm build` - Runs migrations and builds application  
- **Linting**: `pnpm lint` / `pnpm lint:fix` - ESLint with auto-fix
- **Testing**: `pnpm test` - Playwright e2e tests
- **Database**: `pnpm db:*` - Migration and schema management commands

---

*This document reflects the current tinman-chat codebase structure and technology choices. Update as the project evolves.*
