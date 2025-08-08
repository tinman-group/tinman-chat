/**
 * Zod v4 to AI SDK Compatibility Adapter
 * 
 * This adapter handles conversion between Zod v4 schemas and AI SDK v3-compatible schemas
 * during the migration period. It ensures type safety while maintaining AI SDK functionality.
 * 
 * Usage:
 * - Use v4 schemas for enhanced validation and type inference
 * - Convert to v3-compatible format for AI SDK integration
 * - Maintain type safety throughout the conversion process
 */

import { z as zv4 } from "zod";
import { z as zv3 } from "zod";

export interface AISDKCompatibleSchema<T> {
  // AI SDK compatible schema (v3 format)
  aiSdkSchema: zv3.ZodSchema<T>;
  // Original v4 schema for enhanced validation
  v4Schema: zv4.ZodSchema<T>;
  // Enhanced validation function using v4
  validate: (data: unknown) => T;
  // Type inference preserved
  inferType: T;
}

export class AISDKZodV4Adapter {
  /**
   * Creates a streaming tool schema compatible with AI SDK
   * while preserving Zod v4 enhanced type safety
   */
  static createStreamingToolSchema<T>(
    v4Schema: zv4.ZodSchema<T>
  ): AISDKCompatibleSchema<T> {
    return {
      aiSdkSchema: this.convertToV3Schema(v4Schema),
      v4Schema: v4Schema,
      validate: (data: unknown) => v4Schema.parse(data),
      inferType: {} as T
    };
  }

  /**
   * Converts Zod v4 schema to v3-compatible format for AI SDK
   * This is a temporary solution until AI SDK supports Zod v4 natively
   */
  private static convertToV3Schema<T>(v4Schema: zv4.ZodSchema<T>): zv3.ZodSchema<T> {
    // For now, we'll create equivalent v3 schemas manually
    // In a real implementation, this would be a comprehensive converter
    
    // This is a simplified approach - for production, you'd need
    // to handle all Zod schema types and recursively convert them
    return this.createEquivalentV3Schema(v4Schema) as zv3.ZodSchema<T>;
  }

  /**
   * Creates equivalent v3 schema based on v4 schema structure
   * This is a simplified implementation for common patterns
   */
  private static createEquivalentV3Schema(schema: any): any {
    // This would need to be expanded to handle all Zod v4 schema types
    // For now, we'll handle the most common cases used in tinman-chat
    
    if (typeof schema._def === "object" && schema._def.typeName) {
      const typeName = schema._def.typeName;
      
      switch (typeName) {
        case "ZodObject":
          return zv3.object(
            Object.fromEntries(
              Object.entries(schema._def.shape).map(([key, value]) => [
                key,
                this.createEquivalentV3Schema(value)
              ])
            )
          );
        
        case "ZodString":
          // Handle v4 direct validation functions
          if (schema._def.checks) {
            let stringSchema = zv3.string();
            for (const check of schema._def.checks) {
              switch (check.kind) {
                case "email":
                  stringSchema = stringSchema.email();
                  break;
                case "uuid":
                  stringSchema = stringSchema.uuid();
                  break;
                case "url":
                  stringSchema = stringSchema.url();
                  break;
                case "min":
                  stringSchema = stringSchema.min(check.value, { 
                    message: check.message || `Minimum length is ${check.value}` 
                  });
                  break;
                case "max":
                  stringSchema = stringSchema.max(check.value, { 
                    message: check.message || `Maximum length is ${check.value}` 
                  });
                  break;
              }
            }
            return stringSchema;
          }
          return zv3.string();
        
        case "ZodEnum":
          return zv3.enum(schema._def.values);
        
        case "ZodArray":
          return zv3.array(this.createEquivalentV3Schema(schema._def.type));
        
        case "ZodUnion":
          return zv3.union(
            schema._def.options.map((option: any) => 
              this.createEquivalentV3Schema(option)
            )
          );
        
        case "ZodOptional":
          return this.createEquivalentV3Schema(schema._def.innerType).optional();
        
        case "ZodLiteral":
          return zv3.literal(schema._def.value);
        
        default:
          // For unknown types, create a generic schema
          console.warn(`Unknown Zod v4 schema type: ${typeName}. Using generic schema.`);
          return zv3.any();
      }
    }
    
    // Fallback for edge cases
    return zv3.any();
  }

  /**
   * Test compatibility with AI SDK streaming functions
   * Returns true if the schema is compatible, false otherwise
   */
  static async testStreamingCompatibility<T>(
    v4Schema: zv4.ZodSchema<T>,
    testData: T
  ): Promise<boolean> {
    try {
      const compatSchema = this.createStreamingToolSchema(v4Schema);
      
      // Test v4 validation
      const v4Result = compatSchema.validate(testData);
      
      // Test v3 compatibility
      const v3Result = compatSchema.aiSdkSchema.parse(testData);
      
      // Both should succeed and produce equivalent results
      return JSON.stringify(v4Result) === JSON.stringify(v3Result);
    } catch (error) {
      console.error("Schema compatibility test failed:", error);
      return false;
    }
  }

  /**
   * Performance monitoring for schema conversion
   */
  static measureConversionPerformance<T>(
    v4Schema: zv4.ZodSchema<T>,
    testData: T,
    iterations: number = 1000
  ): { v4Time: number; v3Time: number; improvement: number } {
    const compatSchema = this.createStreamingToolSchema(v4Schema);
    
    // Measure v4 performance
    const v4Start = performance.now();
    for (let i = 0; i < iterations; i++) {
      compatSchema.validate(testData);
    }
    const v4Time = performance.now() - v4Start;
    
    // Measure v3 performance
    const v3Start = performance.now();
    for (let i = 0; i < iterations; i++) {
      compatSchema.aiSdkSchema.parse(testData);
    }
    const v3Time = performance.now() - v3Start;
    
    return {
      v4Time,
      v3Time,
      improvement: ((v3Time - v4Time) / v3Time) * 100
    };
  }
}

/**
 * Environment-based feature flag for Zod v4 adoption
 */
export const ZodMigrationConfig = {
  enabled: process.env.ENABLE_ZOD_V4 === "true",
  phase: process.env.ZOD_MIGRATION_PHASE || "development",
  aiSdkCompatMode: process.env.AI_SDK_COMPAT_MODE !== "false"
};

/**
 * Helper function to choose Zod version based on environment
 */
export function getZodForEnvironment() {
  return ZodMigrationConfig.enabled ? zv4 : zv3;
}