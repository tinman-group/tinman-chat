# Zod v4 Research Documentation

## Executive Summary

Zod v4 represents a major evolution of the popular TypeScript-first schema validation library, introducing significant breaking changes alongside substantial performance improvements. This research documents the comprehensive API changes, migration requirements, and compatibility considerations for upgrading tinman-chat from Zod v3.25.68 to Zod v4.

**Key Findings**:
- 3x performance improvements for complex schemas
- 57% smaller bundle size 
- Major breaking changes in error customization APIs
- Breaking changes in string validation methods
- Improved TypeScript compiler efficiency (25,000+ → 175 type instantiations)
- New `z.interface()` API for better optional property handling
- Enhanced JSON schema support

## Integration Overview

Zod v4's changes align well with tinman-chat's architecture principles:

- **Type Safety First**: Enhanced type inference and stricter validation
- **Streaming-First Architecture**: Compatible with AI SDK streaming patterns
- **Schema Evolution Safety**: New versioning supports gradual migration
- **Multi-Modal Content Architecture**: Improved union and discriminated union handling

## Major API Changes and Breaking Changes

### 1. Error Customization API Overhaul

**Breaking Change**: Complete redesign of error customization APIs.

```typescript
// Zod v3 (Current)
z.string().min(1, { message: "Required" })
z.string().min(1, "Custom message")

// Zod v4 (New)
z.string().min(1, { error: "Required" })
z.string().min(1, { error: { message: "Required" } })
```

**Deprecated Parameters**:
- `invalid_type_error` - removed entirely
- `required_error` - removed entirely
- `message` parameter - replaced with `error`

### 2. String Format Validation Changes

**Breaking Change**: Method-based string formats moved to top-level functions.

```typescript
// Zod v3 (Current) - Method chaining
z.string().email()
z.string().url()  
z.string().uuid()
z.string().ip()

// Zod v4 (New) - Top-level functions
z.email()
z.url()
z.uuid()
z.ipv4() // .ip() split into .ipv4() and .ipv6()
z.ipv6()
```

**Benefits**:
- More tree-shakable
- Less verbose
- Better TypeScript performance
- Stricter validation (e.g., UUID validation)

### 3. Object Schema Changes

**Breaking Change**: `.strict()` and `.passthrough()` methods deprecated.

```typescript
// Zod v3 (Current)
z.object({ name: z.string() }).strict()
z.object({ name: z.string() }).passthrough()

// Zod v4 (New)  
z.strictObject({ name: z.string() })
z.looseObject({ name: z.string() })
```

**Optional Properties Behavior Change**:
```typescript
// Zod v4 - Defaults applied even in optional fields
z.object({
  name: z.string().default("Unknown").optional()
}).parse({})
// Result: { name: "Unknown" } (not {})
```

### 4. Number Validation Changes

**Breaking Changes**:
- `POSITIVE_INFINITY` and `NEGATIVE_INFINITY` no longer valid for `z.number()`
- `z.number().safe()` deprecated - now behaves identically to `.int()`
- `z.number().int()` only accepts safe integers (within `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`)

```typescript
// Zod v3 (Current)
z.number().safe() // Accepts floats

// Zod v4 (New)
z.number().int() // Only safe integers
```

### 5. Function Schema Changes

**Breaking Change**: `z.function()` is now a function factory.

```typescript
// Zod v3 (Current)
z.function().args(z.string()).returns(z.number())

// Zod v4 (New)
z.function(z.tuple([z.string()]), z.number())
```

**New Features**:
- `.implementAsync()` method for async function validation

### 6. Internal Structure Changes

**Breaking Change**: Internal property reorganization.

```typescript
// Zod v3 (Current)
schema._def

// Zod v4 (New)
schema._zod.def
```

**Refinements Architecture**: Refinements now live inside schemas themselves instead of wrapper `ZodEffects` class.

## New Features and Enhancements

### 1. New z.stringbool() API

Enhanced boolean coercion for environment-style variables:

```typescript
z.stringbool().parse("true")   // true
z.stringbool().parse("1")      // true  
z.stringbool().parse("yes")    // true
z.stringbool().parse("on")     // true
z.stringbool().parse("false")  // false
z.stringbool().parse("0")      // false
```

### 2. Enhanced z.interface() API

Better optional property handling with true recursive types:

```typescript
z.interface({
  name: z.string(),
  age: z.number().optional()
})
```

**Key vs Value Optional**:
- Key optional: property may be omitted
- Value optional: property required but can be undefined

### 3. Enhanced Error Pretty-Printing

Improved error formatting for better debugging:

```typescript
try {
  schema.parse(data);
} catch (error) {
  console.log(error.format()); // Multi-line, readable format
}
```

### 4. Performance Improvements

- **3x faster parsing** for complex schemas
- **57% smaller bundle size** 
- **25,000+ → 175 type instantiations** in TypeScript compilation
- Better memory efficiency for nested schemas

### 5. Enhanced JSON Schema Support

Native JSON schema conversion eliminates dependency on `zod-to-json-schema`:

```typescript
const jsonSchema = z.string().toJsonSchema();
```

## Versioning Strategy

**Important**: Zod v4 initially published at subpath `"zod"` alongside `"zod"` v3:

```typescript
// Gradual migration approach
import { z } from "zod";     // New API
import { z as zv3 } from "zod"; // Legacy API
```

## Compatibility Assessment

### AI SDK Compatibility

**Status**: ⚠️ **Partial Compatibility Issues**

**Issues Identified**:
- GitHub Issue #7189: `zod-to-json-schema` incompatibility with Zod v4
- `ZodFirstPartyTypeKind` not found errors
- `generateObject` function compatibility problems

**Current Workaround**:
```json
{
  "dependencies": {
    "zod": "3.25.76"
  }
}
```

**Future Resolution**: AI SDK team actively working on Zod v4 support, including replacing internal Zod v3 usage with Zod v4 mini.

### Drizzle ORM Compatibility  

**Status**: ✅ **Fully Compatible**

**Updates**:
- **Pull Request #4820**: Zod v4 compatibility implemented
- `drizzle-zod` requires Zod v3.25.1+ or Zod v4.0.0+
- Updated peer dependency to `"zod": "^4.0.0"`

**Requirements**:
- Drizzle ORM v0.36.0+
- Zod v3.25.1+ or v4.0.0+

**Known Edge Cases**:
- Some UUID generation compatibility issues with drizzle-seed
- Minor TRPC integration adjustments needed

### NextAuth.js v5 Compatibility

**Status**: ✅ **Fully Compatible**

**Integration Example**:
```typescript
import { z } from "zod";

const authFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(32)
});
```

**Benefits**:
- Enhanced form validation patterns
- Better error messages for authentication flows
- Compatible with Next.js 15 App Router

## Migration Impact Assessment

### Critical Breaking Changes for tinman-chat

1. **String Validation Methods** (High Impact)
   - Current: `z.string().email()` and `z.string().uuid()`
   - Required: Change to `z.email()` and `z.uuid()`

2. **Error Message Customization** (Medium Impact)  
   - Current: Custom `message` parameters
   - Required: Switch to `error` parameter

3. **File Upload Validation** (Medium Impact)
   - Current: `.refine()` with custom messages
   - Required: Update to new error format

4. **Number Validation** (Low Impact)
   - Current usage appears compatible
   - Monitor for edge cases with infinite values

### Files Requiring Updates

**High Priority**:
- `/app/(chat)/api/chat/schema.ts` - UUID and URL validation
- `/app/(auth)/actions.ts` - Email validation
- `/app/(chat)/api/files/upload/route.ts` - File validation with custom errors

**Medium Priority**:
- `/lib/types.ts` - Schema definitions
- `/lib/ai/tools/*.ts` - Tool parameter schemas
- `/artifacts/*/server.ts` - Streaming object schemas

## Architecture Recommendations

### 1. Gradual Migration Strategy

Use Zod v4's subpath versioning for incremental migration:

```typescript
// Phase 1: New schemas
import { z } from "zod";

// Phase 2: Existing schemas (temporary)
import { z as zv3 } from "zod";
```

### 2. Enhanced Type Safety Patterns

Leverage new `z.interface()` for better optional handling:

```typescript
// Improved message parts validation
const messagePartsSchema = z.interface({
  id: z.uuid(),
  type: z.enum(['text', 'file']),
  content: z.string().optional() // Better optional semantics
});
```

### 3. Performance Optimization

Take advantage of top-level validation functions:

```typescript
// More performant and tree-shakable
const userSchema = z.object({
  email: z.email(),        // Instead of z.string().email()
  id: z.uuid(),           // Instead of z.string().uuid()
  avatar: z.url()         // Instead of z.string().url()
});
```

### 4. Error Handling Improvements

Utilize enhanced error formatting:

```typescript
// Better error messages for API responses
try {
  const validatedData = schema.parse(body);
} catch (error) {
  return Response.json({
    data: null,
    error: {
      message: error.format(), // Enhanced formatting
      code: 'VALIDATION_ERROR'
    }
  }, { status: 400 });
}
```

## Security Considerations

### Enhanced Validation Strictness

Zod v4's stricter validation provides security benefits:

1. **UUID Validation**: More rigorous UUID format checking
2. **Email Validation**: Enhanced email format validation
3. **Number Ranges**: Safer integer validation preventing overflow
4. **Type Coercion**: More predictable coercion behavior

### Backward Compatibility Risks

- Review all existing validation logic for behavioral changes
- Test edge cases thoroughly, especially with optional properties
- Monitor for potential data validation bypasses during migration

## Resource Links

### Official Documentation
- [Zod v4 Migration Guide](https://zod.dev/v4/changelog) - Complete migration documentation
- [Zod v4 Release Notes](https://zod.dev/v4) - Feature overview and examples
- [Versioning Strategy](https://zod.dev/v4/versioning) - Subpath migration approach

### Compatibility Tracking
- [AI SDK Zod v4 Support](https://github.com/vercel/ai/issues/5682) - Active tracking issue
- [Drizzle ORM Compatibility](https://github.com/drizzle-team/drizzle-orm/pull/4820) - Implemented fix
- [NextAuth.js Integration Examples](https://authjs.dev/getting-started/migrating-to-v5) - v5 migration guide

### Performance Resources
- [Zod 4 Performance Analysis](https://basicutils.com/learn/zod/whats-new-in-zod-v4) - Detailed performance improvements
- [LogRocket Zod 4 Overview](https://blog.logrocket.com/zod-4-update/) - Comprehensive feature analysis

---

*This research provides the foundation for the ARCHITECT phase of the Zod v4 upgrade, ensuring all breaking changes and compatibility requirements are understood before implementation begins.*