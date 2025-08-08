# Zod v4 Migration Guide for tinman-chat

## Executive Summary

This migration guide provides a comprehensive strategy for upgrading tinman-chat from Zod v3.25.68 to Zod v4, maintaining the project's "Type Safety First" principle while leveraging Zod v4's performance improvements and enhanced APIs. The migration focuses on compatibility with existing Next.js 15, AI SDK, and Drizzle ORM architecture.

**Migration Benefits**:
- 3x performance improvement for schema validation
- 57% smaller bundle size
- Enhanced TypeScript compiler efficiency
- Improved error messages and debugging experience
- Better tree-shaking and module optimization

**Estimated Timeline**: 2-3 development cycles
**Risk Level**: Medium (due to AI SDK compatibility considerations)

**Architectural Design**: See `/docs/specs/zod-v4-architecture.md` for comprehensive system architecture
**Updated Standards**: See `/docs/context/coding-standards.md` for new Zod v4 patterns

## Integration Overview

### How Zod v4 Enhances tinman-chat Architecture

**Type Safety First**: 
- Stricter validation with enhanced type inference
- Better optional property handling with `z.interface()`
- More predictable error handling patterns

**Streaming-First Architecture**:
- Compatible with AI SDK streaming patterns (with workarounds)
- Enhanced performance for real-time validation
- Better memory efficiency for long-running streams

**Schema Evolution Safety**:
- Subpath versioning (`zod`) enables gradual migration
- Backward compatibility during transition period
- Safe coexistence of v3 and v4 schemas

**Multi-Modal Content Architecture**:
- Improved union and discriminated union handling
- Better validation for message parts system
- Enhanced file upload validation patterns

## Current Zod Usage Inventory

### Files with Zod Dependencies (11 total)

#### 1. API Schema Definitions
**File**: `/app/(chat)/api/chat/schema.ts`
```typescript
// Current v3 patterns
z.string().url()     // Line 12
z.string().uuid()    // Lines 18, 20
z.enum(['text'])     // Lines 4, 24, 25
z.array(partSchema)  // Line 22
z.union([textPartSchema, filePartSchema]) // Line 15
```

**Migration Impact**: High - Core chat validation schema

#### 2. Authentication Forms
**File**: `/app/(auth)/actions.ts`
```typescript
// Current v3 patterns  
z.string().email()   // Line 10
z.string().min(6)    // Line 11
```

**Migration Impact**: High - User authentication validation

#### 3. File Upload Validation
**File**: `/app/(chat)/api/files/upload/route.ts`
```typescript
// Current v3 patterns with custom error messages
.refine((file) => file.size <= 5 * 1024 * 1024, {
  message: 'File size should be less than 5MB'    // Line 12
})
.refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
  message: 'File type should be JPEG or PNG'      // Line 16
})
```

**Migration Impact**: Medium - Custom error message format changes

#### 4. AI Tool Schemas
**Files**: 
- `/lib/ai/tools/create-document.ts` (Lines 20-22)
- `/lib/ai/tools/update-document.ts` 
- `/lib/ai/tools/get-weather.ts` (Lines 6-8)
- `/lib/ai/tools/request-suggestions.ts`

```typescript
// Current v3 patterns
z.object({
  title: z.string(),
  kind: z.enum(artifactKinds)
})

z.object({
  latitude: z.number(),
  longitude: z.number()
})
```

**Migration Impact**: Low - Basic object schemas, minimal changes needed

#### 5. Type Definitions
**File**: `/lib/types.ts`
```typescript
// Current v3 patterns
export const messageMetadataSchema = z.object({
  createdAt: z.string()
});
```

**Migration Impact**: Low - Simple object schema

#### 6. Artifact Handlers
**Files**:
- `/artifacts/code/server.ts` (Lines 16-18, 49-51)
- `/artifacts/sheet/server.ts`

```typescript
// Current v3 patterns for streaming objects
schema: z.object({
  code: z.string()
})
```

**Migration Impact**: Low - AI SDK streaming compatibility considerations

## Architectural Implementation Strategy

**Reference Architecture**: This migration follows the comprehensive architectural design specified in `/docs/specs/zod-v4-architecture.md`. Key architectural decisions include:

### Core Architectural Patterns
1. **Dual Import System**: Subpath versioning (`zod`) enables gradual migration without breaking changes
2. **AI SDK Compatibility Layer**: Adapter pattern handles v4→v3 conversion for AI SDK integration
3. **Enhanced Schema Factory Pattern**: Centralized schema creation with v4 features
4. **Performance-First Design**: Top-level validation functions optimize tree-shaking and performance

### Component Integration Architecture
- **API Routes**: Enhanced validation with 3x performance improvement
- **AI Tools**: Compatibility adapter maintains streaming functionality
- **Authentication**: Enhanced email/password validation with better error messages
- **File Uploads**: New error parameter format with improved user experience

### Implementation Principles
- **Zero Downtime**: Environment-based feature flags enable production deployment
- **Type Safety Preservation**: Enhanced type inference throughout migration
- **Rollback Ready**: Comprehensive rollback strategy for risk mitigation
- **Performance Monitoring**: Built-in metrics collection for validation improvements

## Migration Strategy

### Phase 1: Preparation and AI SDK Compatibility Assessment

**Objective**: Ensure AI SDK compatibility before major migration

**Steps**:
1. **AI SDK Compatibility Check**
   ```bash
   # Test current AI SDK with Zod v4 in isolated environment
   npm create next-app@latest zod-test
   cd zod-test
   npm install @ai-sdk/xai@latest zod@^4.0.0
   ```

2. **Identify Blocking Dependencies**
   - Monitor AI SDK issues: #5682, #7189, #7291
   - Test `generateObject` and `streamObject` with Zod v4 schemas
   - Verify `zod-to-json-schema` compatibility

3. **Contingency Planning**
   - If AI SDK incompatible: defer migration until AI SDK v6+
   - If partial compatibility: plan selective migration strategy

### Phase 2: Incremental Migration Implementation

**Objective**: Gradual migration using Zod v4 subpath versioning

#### 2.1 Package Installation and Setup

```bash
# Install Zod v4 alongside v3
pnpm add zod@^4.0.0

# Update package.json to support both versions
```

**tsconfig.json** path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "zod": ["node_modules/zod"],
      "zod": ["node_modules/zod"]
    }
  }
}
```

#### 2.2 Migration Order (Risk-based)

**Priority 1: New Schema Files (Lowest Risk)**
- Create new schemas using Zod v4 syntax
- Test in isolation before integration

**Priority 2: Independent Utility Schemas (Low Risk)**  
- `/lib/types.ts` - messageMetadataSchema
- Basic AI tool parameter schemas

**Priority 3: API Route Schemas (Medium Risk)**
- `/app/(auth)/actions.ts` - Authentication schemas
- `/app/(chat)/api/files/upload/route.ts` - File upload validation  

**Priority 4: Core Chat Schemas (High Risk)**
- `/app/(chat)/api/chat/schema.ts` - Message validation
- Integration with AI SDK streaming

### Phase 3: Systematic File Updates

#### 3.1 String Validation Migration

**Before (Zod v3)**:
```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  id: z.string().uuid(),
  website: z.string().url()
});
```

**After (Zod v4)**:
```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.email(),
  id: z.uuid(),
  website: z.url()
});
```

#### 3.2 Error Message Migration

**Before (Zod v3)**:
```typescript
.refine((file) => file.size <= 5 * 1024 * 1024, {
  message: 'File size should be less than 5MB'
})
```

**After (Zod v4)**:
```typescript
.refine((file) => file.size <= 5 * 1024 * 1024, {
  error: 'File size should be less than 5MB'
})
```

#### 3.3 Optional Properties Enhancement

**Before (Zod v3)**:
```typescript
const messageSchema = z.object({
  content: z.string().optional(),
  metadata: z.object({
    createdAt: z.string()
  }).optional()
});
```

**After (Zod v4)**:
```typescript
const messageSchema = z.interface({
  content: z.string().optional(),
  metadata: z.object({
    createdAt: z.string()
  }).optional()
});
```

### Phase 4: AI SDK Integration Strategy

#### 4.1 Conditional Zod Version Usage

```typescript
// lib/ai/compatibility.ts
const useZodV4 = process.env.NODE_ENV !== 'production' || 
                 process.env.ENABLE_ZOD_V4 === 'true';

export const z = useZodV4 
  ? require('zod').z 
  : require('zod').z;
```

#### 4.2 Schema Wrapper for AI SDK Compatibility

```typescript
// lib/ai/schema-adapter.ts
import { z as zv4 } from 'zod';
import { z as zv3 } from 'zod';

export function createAISDKSchema<T>(v4Schema: zv4.ZodSchema<T>) {
  // Convert Zod v4 schema to v3-compatible format for AI SDK
  return zv3.object({
    // Manual mapping for AI SDK compatibility
  });
}
```

## File-by-File Migration Plan

### 1. `/app/(chat)/api/chat/schema.ts`

**Current Issues**:
- `z.string().uuid()` → `z.uuid()`
- `z.string().url()` → `z.url()`

**Migration Steps**:
```typescript
// Step 1: Import both versions temporarily
import { z } from 'zod';
import { z as zv3 } from 'zod';

// Step 2: Create v4 schemas
const textPartSchemaV4 = z.object({
  type: z.enum(['text']),
  text: z.string().min(1).max(2000)
});

const filePartSchemaV4 = z.object({
  type: z.enum(['file']),
  mediaType: z.enum(['image/jpeg', 'image/png']),
  name: z.string().min(1).max(100),
  url: z.url() // v4 syntax
});

// Step 3: Test compatibility with AI SDK
// Step 4: Replace v3 schemas once confirmed working
```

**Testing Strategy**:
```typescript
// Test file: __tests__/chat-schema.test.ts
describe('Chat Schema Migration', () => {
  it('validates message parts with Zod v4', () => {
    const validData = {
      id: crypto.randomUUID(),
      message: {
        id: crypto.randomUUID(),
        role: 'user',
        parts: [
          {
            type: 'text',
            text: 'Hello world'
          }
        ]
      },
      selectedChatModel: 'chat-model',
      selectedVisibilityType: 'private'
    };
    
    expect(() => postRequestBodySchema.parse(validData)).not.toThrow();
  });
});
```

### 2. `/app/(auth)/actions.ts`

**Current Issues**:
- `z.string().email()` → `z.email()`

**Migration Steps**:
```typescript
// Before
const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// After  
import { z } from 'zod';

const authFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});
```

### 3. `/app/(chat)/api/files/upload/route.ts`

**Current Issues**:
- Custom error messages format
- `.refine()` with `message` → `error`

**Migration Steps**:
```typescript
// Before
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB'
    })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'File type should be JPEG or PNG'
    })
});

// After
import { z } from 'zod';

const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      error: 'File size should be less than 5MB'
    })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      error: 'File type should be JPEG or PNG'
    })
});
```

### 4. AI Tool Schemas (Low Priority)

**Files**: `/lib/ai/tools/*.ts`

**Migration Impact**: Minimal - basic object schemas

**Strategy**: 
- Update after core schemas are migrated
- Test streaming compatibility with AI SDK
- Monitor for any `streamObject` issues

## Compatibility Assessment

### AI SDK Integration Status

**Current Compatibility Issues**:
- ⚠️ `zod-to-json-schema` incompatibility (Issue #7189)
- ⚠️ `generateObject` compatibility problems (Issue #5682)
- ⚠️ `ZodFirstPartyTypeKind` not found errors

**Recommended Approach**:
1. **Wait for AI SDK v6+ with official Zod v4 support**
2. **Or implement selective migration**: Use Zod v4 for non-AI SDK schemas
3. **Monitor GitHub issues**: Track progress on compatibility fixes

### Drizzle ORM Compatibility

**Status**: ✅ **Ready for Migration**
- `drizzle-zod` v0.36.0+ supports Zod v4
- Peer dependency updated to `"zod": "^4.0.0"`
- Full compatibility confirmed

### NextAuth.js v5 Compatibility  

**Status**: ✅ **Fully Compatible**
- No migration issues expected
- Enhanced validation patterns available
- Better error messages for auth flows

## Testing Strategy

### 1. Unit Tests Migration

```typescript
// tests/zod-migration.test.ts
describe('Zod v4 Migration', () => {
  describe('String validation updates', () => {
    it('validates emails with z.email()', () => {
      expect(z.email().parse('user@example.com')).toBe('user@example.com');
    });
    
    it('validates UUIDs with z.uuid()', () => {
      const uuid = crypto.randomUUID();
      expect(z.uuid().parse(uuid)).toBe(uuid);
    });
  });
  
  describe('Error message format', () => {
    it('uses error parameter instead of message', () => {
      const schema = z.string().min(5, { error: 'Too short' });
      expect(() => schema.parse('hi')).toThrow('Too short');
    });
  });
});
```

### 2. Integration Tests

```typescript
// tests/e2e/zod-v4-integration.test.ts
describe('Zod v4 Integration', () => {
  it('validates chat messages end-to-end', async () => {
    // Test complete flow with new validation
  });
  
  it('handles file uploads with new error format', async () => {
    // Test file upload validation
  });
  
  it('authenticates users with email validation', async () => {
    // Test auth form validation
  });
});
```

### 3. Performance Tests

```typescript
// Performance comparison tests
describe('Zod v4 Performance', () => {
  it('parses complex schemas faster than v3', () => {
    const iterations = 10000;
    const complexData = generateComplexTestData();
    
    const v4Time = measureParseTime(v4Schema, complexData, iterations);
    const v3Time = measureParseTime(v3Schema, complexData, iterations);
    
    expect(v4Time).toBeLessThan(v3Time * 0.5); // Expect 2x improvement
  });
});
```

## Risk Mitigation

### 1. AI SDK Compatibility Risks

**Risk**: Breaking changes in AI SDK streaming functionality
**Mitigation**:
- Implement feature flags for Zod version selection
- Create adapter layer for schema compatibility  
- Maintain parallel v3/v4 schemas during transition

### 2. Performance Regression Risks

**Risk**: Unexpected performance issues during migration
**Mitigation**:
- Benchmark critical paths before/after migration
- Implement rollback strategy with environment variables
- Monitor production performance metrics

### 3. Type Safety Regression

**Risk**: Loss of type safety during transition period
**Mitigation**:
- Comprehensive TypeScript compilation checks
- Enhanced test coverage for schema validation
- Code review focus on type definitions

## Environment Variables and Configuration

```bash
# .env.local
ENABLE_ZOD_V4=false          # Feature flag for gradual rollout
ZOD_V4_AI_SDK_COMPAT=false   # AI SDK compatibility mode
ZOD_MIGRATION_MODE=gradual   # Migration strategy
```

**Next.js Configuration**:
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['zod'],
  },
  webpack: (config) => {
    // Handle dual Zod version imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'zod': require.resolve('zod'),
      'zod$': require.resolve('zod'),
    };
    return config;
  },
};
```

## Success Criteria

### Phase 1 - Preparation Complete
- [ ] AI SDK compatibility thoroughly assessed
- [ ] Migration strategy approved by architecture review
- [ ] Test suite prepared for dual-version validation

### Phase 2 - Core Migration Complete  
- [ ] All authentication schemas migrated to Zod v4
- [ ] File upload validation using new error format
- [ ] No regression in user-facing functionality

### Phase 3 - Full Migration Complete
- [ ] All schemas use Zod v4 syntax
- [ ] AI SDK integration working (or acceptable workaround)
- [ ] Performance improvements verified (>2x for complex schemas)
- [ ] Bundle size reduction confirmed (>50% for Zod bundle)

### Phase 4 - Cleanup Complete
- [ ] Zod v3 dependency removed
- [ ] All temporary compatibility code removed
- [ ] Documentation updated with new patterns
- [ ] Architecture implementation verified against `/docs/specs/zod-v4-architecture.md`
- [ ] Coding standards compliance verified against `/docs/context/coding-standards.md`

## Rollback Plan

### Immediate Rollback (< 1 hour)
```bash
# Emergency rollback
git revert [migration-commit-hash]
pnpm install  # Restore package-lock
pnpm build    # Verify build works
```

### Selective Rollback (Specific Files)
```typescript
// Revert specific files to v3 syntax
import { z } from 'zod'; // Back to v3
// Restore original schema definitions
```

### Environment Variable Rollback
```bash
# Disable Zod v4 features
ENABLE_ZOD_V4=false
ZOD_MIGRATION_MODE=rollback
```

## Post-Migration Optimizations

### 1. Leverage New Zod v4 Features

**Enhanced Optional Handling**:
```typescript
// Use z.interface() for better optional semantics
const userSchema = z.interface({
  id: z.uuid(),
  email: z.email(),
  profile: z.object({
    name: z.string(),
    avatar: z.url().optional()
  }).optional()
});
```

**Improved Error Messages**:
```typescript
// Take advantage of enhanced error formatting
try {
  schema.parse(data);
} catch (error) {
  return Response.json({
    error: {
      message: error.format(), // Better formatting
      code: 'VALIDATION_ERROR'
    }
  }, { status: 400 });
}
```

### 2. Performance Monitoring

**Metrics to Track**:
- Schema validation latency (expect 50-70% improvement)
- Bundle size reduction (expect 57% smaller Zod bundle)
- Memory usage during complex validations
- TypeScript compilation time improvements

### 3. Code Quality Improvements

**Utilize Tree-Shaking**:
```typescript
// More tree-shakable imports
import { z, email, uuid, url } from 'zod';

const schema = z.object({
  email: email(),
  id: uuid(),
  website: url()
});
```

## Maintenance and Long-term Considerations

### 1. Dependency Management

**Keep Zod v4 Updated**:
- Monitor release notes for bug fixes and improvements
- Update to latest stable versions quarterly
- Watch for breaking changes in minor versions

### 2. Schema Evolution Strategy

**Maintain Backward Compatibility**:
- Use Zod v4's enhanced versioning for schema evolution
- Document schema changes in migration log
- Implement schema version headers for API compatibility

### 3. Team Training and Documentation

**Update Coding Standards**:
- Add Zod v4 patterns to `/docs/context/coding-standards.md`
- Create examples for common validation patterns
- Document performance best practices

## Related Documentation

- **Architecture Specification**: `/docs/specs/zod-v4-architecture.md` - Comprehensive system architecture and component integration design
- **Updated Coding Standards**: `/docs/context/coding-standards.md` - New Zod v4 patterns and best practices
- **Research Foundation**: `/docs/specs/zod-v4-research.md` - Detailed API changes and compatibility analysis

---

*This migration guide provides a comprehensive, risk-aware approach to upgrading Zod while maintaining tinman-chat's architectural principles and ensuring compatibility with the existing technology stack. Implementation should follow the architectural patterns defined in the related documentation.*