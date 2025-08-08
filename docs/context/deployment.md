# Deployment & Infrastructure Documentation

This document contains deployment and infrastructure information for the tinman-chat AI chatbot application deployed on Vercel.

## Deployment Strategy

### Vercel Platform
The application is deployed using Vercel's platform, leveraging:
- **Automatic deployments** from Git repository
- **Serverless functions** for API routes with 60-second timeout
- **Edge runtime** capabilities for global performance
- **Built-in CDN** for static assets and image optimization

### Build Process
```bash
# Build command (configured in package.json)
pnpm build

# Build process includes:
# 1. Database migration execution (tsx lib/db/migrate)
# 2. Next.js production build
# 3. Static optimization and asset generation
```

## Infrastructure Architecture

### Core Services

#### **Next.js Application**
- **Framework**: Next.js 15 with App Router
- **Runtime**: Node.js with TypeScript
- **Features**: 
  - Partial Pre-rendering (PPR) experimental feature enabled
  - Server and Client Components architecture
  - API Routes with serverless functions

#### **Database Layer**
- **Primary Database**: Vercel Postgres (PostgreSQL)
  - Managed PostgreSQL service
  - Connection pooling handled automatically
  - Environment variable: `POSTGRES_URL`
- **ORM**: Drizzle ORM with TypeScript
- **Migration Strategy**: Automatic migrations during build process
- **Schema Evolution**: Version-safe migrations in `lib/db/migrations/`

#### **File Storage**
- **Service**: Vercel Blob Storage
- **Usage**: File uploads, artifacts, and media storage
- **Configuration**: 
  - 5MB file size limit for uploads
  - Supports JPEG/PNG image formats
  - Environment variable: `BLOB_READ_WRITE_TOKEN`

#### **Caching Layer (Optional)**
- **Service**: Redis (Vercel KV or external)
- **Usage**: Resumable stream contexts for long AI responses
- **Configuration**: Environment variable: `REDIS_URL`

### AI & External Services

#### **AI Provider**
- **Primary**: xAI Grok models
  - `grok-2-vision-1212` for chat conversations
  - `grok-3-mini-beta` for reasoning extraction  
  - `grok-2-1212` for titles and artifacts
  - `grok-2-image` for image generation
- **Configuration**: Environment variable: `XAI_API_KEY`
- **Testing**: Mock providers used in test environments

#### **Authentication**
- **Service**: NextAuth.js v5
- **Strategy**: Credential-based authentication with session management
- **Configuration**: Environment variable: `AUTH_SECRET`

## Environment Configuration

### Required Environment Variables

```bash
# Authentication
AUTH_SECRET=****                    # NextAuth session secret (32+ chars)

# AI Services  
XAI_API_KEY=****                   # xAI API key for Grok models

# Database
POSTGRES_URL=****                  # Vercel Postgres connection string

# File Storage
BLOB_READ_WRITE_TOKEN=****         # Vercel Blob storage access token

# Optional: Caching
REDIS_URL=****                     # Redis connection for resumable streams
```

### Environment Detection
```typescript
// lib/constants.ts
export const isProductionEnvironment = process.env.NODE_ENV === 'production';
export const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';
export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
  process.env.PLAYWRIGHT ||
  process.env.CI_PLAYWRIGHT
);
```

## Deployment Workflow

### Automatic Deployment
1. **Git Integration**: Commits to main branch trigger automatic deployments
2. **Build Phase**:
   - Install dependencies with pnpm
   - Run database migrations (`tsx lib/db/migrate`)
   - Build Next.js application
   - Generate static assets and optimize images
3. **Deploy Phase**:
   - Deploy to Vercel's global edge network
   - Configure environment variables
   - Set up domain and SSL certificates

### Manual Deployment
```bash
# Using Vercel CLI
pnpm install -g vercel
vercel --prod

# Or using git
git push origin main  # Triggers automatic deployment
```

## Performance & Scaling

### Function Configuration
```typescript
// API Routes configuration
export const maxDuration = 60;  // Maximum serverless function timeout
```

### Caching Strategy
- **Static Assets**: Cached at edge via Vercel CDN
- **Dynamic Content**: Server-side rendering with selective static generation
- **AI Responses**: Resumable streams with Redis backing for long-running responses

### Image Optimization
```typescript
// next.config.ts - Image domains configuration
images: {
  remotePatterns: [
    {
      hostname: 'avatar.vercel.sh',  // User avatars
    },
  ],
}
```

## Monitoring & Observability

### OpenTelemetry Integration
```typescript
// instrumentation.ts
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({ serviceName: 'ai-chatbot' });
}
```

### Analytics
- **Vercel Analytics**: Built-in web analytics via `@vercel/analytics`
- **Performance Monitoring**: OpenTelemetry tracing for API routes
- **Error Tracking**: Structured logging with correlation IDs

### Geolocation Features
- **Service**: Vercel Functions geolocation API
- **Usage**: Location-aware AI responses (weather, local context)
```typescript
import { geolocation } from '@vercel/functions';

const { longitude, latitude, city, country } = geolocation(request);
```

## Database Management

### Migration Process
```typescript
// Automatic migration during build
// lib/db/migrate.ts
const runMigrate = async () => {
  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
};
```

### Schema Evolution
- **Migration Files**: Stored in `lib/db/migrations/`
- **Version Control**: Sequential migration numbering with snapshots
- **Rollback Strategy**: Manual rollback via Drizzle migration commands

### Development Commands
```bash
# Generate new migration
pnpm db:generate

# Run migrations manually
pnpm db:migrate

# Database studio (development)
pnpm db:studio

# Push schema changes (development only)
pnpm db:push
```

## Security Configuration

### Authentication Flow
1. **Session Management**: NextAuth.js handles secure session tokens
2. **API Protection**: All API routes validate session before processing
3. **Guest Support**: Temporary guest accounts with limited permissions
4. **CSRF Protection**: Built-in CSRF protection via NextAuth.js

### Input Validation
- **Schema Validation**: Zod schemas for all API inputs
- **File Upload Limits**: 5MB max file size, restricted file types
- **Rate Limiting**: User-based rate limiting for AI API calls

### Environment Security
- **Secret Management**: All secrets stored as environment variables
- **Token Rotation**: Regular rotation of API keys and secrets
- **Access Control**: Minimal permission principle for all services

## Disaster Recovery

### Backup Strategy
- **Database**: Automatic backups via Vercel Postgres
- **File Storage**: Vercel Blob built-in redundancy
- **Configuration**: Infrastructure as Code via Git repository

### Recovery Procedures
1. **Database Recovery**: Point-in-time recovery via Vercel dashboard
2. **Application Recovery**: Redeploy from Git repository
3. **Data Migration**: Export/import procedures documented in migration scripts

## Development vs Production

### Environment Differences
```typescript
// Different AI providers for testing
export const myProvider = isTestEnvironment
  ? customProvider({  // Mock providers
      languageModels: { 'chat-model': chatModel }
    })
  : customProvider({  // Production xAI
      languageModels: { 'chat-model': xai('grok-2-vision-1212') }
    });
```

### Local Development Setup
1. Copy `.env.example` to `.env.local`
2. Configure environment variables for local services
3. Run database migrations: `pnpm db:migrate`
4. Start development server: `pnpm dev`

### Testing Environment
- **E2E Tests**: Playwright with mock AI providers
- **CI/CD**: Automated testing on pull requests
- **Preview Deployments**: Automatic preview environments for pull requests

---

*This deployment documentation reflects the current Vercel-based infrastructure for tinman-chat. Update as the deployment architecture evolves.*