/**
 * Zod v4 and AI SDK Compatibility Assessment Tool
 * 
 * This module provides comprehensive compatibility testing for Zod v4 schemas
 * with the AI SDK streaming functions used throughout tinman-chat.
 */

import { z as zv4 } from "zod";
import { AISDKZodV4Adapter } from "./zod-v4-adapter";

export interface CompatibilityReport {
  compatible: boolean;
  issues: string[];
  recommendation: string;
  testedSchemas: {
    name: string;
    compatible: boolean;
    error?: string;
  }[];
  performanceMetrics?: {
    averageImprovement: number;
    totalSchemasTest: number;
  };
}

export class ZodV4CompatibilityChecker {
  /**
   * Comprehensive compatibility assessment for AI SDK integration
   */
  static async assessCompatibility(): Promise<CompatibilityReport> {
    const report: CompatibilityReport = {
      compatible: true,
      issues: [],
      recommendation: "Proceed with migration",
      testedSchemas: []
    };

    try {
      // Test critical schemas used in AI SDK integration
      await this.testChatSchemas(report);
      await this.testToolSchemas(report);
      await this.testArtifactSchemas(report);
      
      // Performance assessment
      const performanceMetrics = await this.assessPerformance();
      report.performanceMetrics = performanceMetrics;
      
      // Generate final recommendation
      this.generateRecommendation(report);
      
    } catch (error) {
      report.compatible = false;
      report.issues.push(`Critical error during assessment: ${error}`);
      report.recommendation = "Defer migration until issues are resolved";
    }

    return report;
  }

  /**
   * Test chat-related schemas that integrate with AI SDK streaming
   */
  private static async testChatSchemas(report: CompatibilityReport): Promise<void> {
    // Test message parts schema (critical for chat functionality)
    const messagePartsSchema = zv4.union([
      zv4.object({
        type: zv4.literal("text"),
        text: zv4.string().min(1).max(2000)
      }),
      zv4.object({
        type: zv4.literal("file"),
        mediaType: zv4.enum(["image/jpeg", "image/png"]),
        name: zv4.string().min(1).max(100),
        url: zv4.url()  // v4 direct function
      })
    ]);

    const testMessage = {
      type: "text" as const,
      text: "Hello world"
    };

    const compatible = await AISDKZodV4Adapter.testStreamingCompatibility(
      messagePartsSchema,
      testMessage
    );

    report.testedSchemas.push({
      name: "MessagePartsSchema",
      compatible,
      error: compatible ? undefined : "Union schema conversion failed"
    });

    if (!compatible) {
      report.compatible = false;
      report.issues.push("Message parts schema incompatible with AI SDK streaming");
    }
  }

  /**
   * Test AI tool schemas used for function calling
   */
  private static async testToolSchemas(report: CompatibilityReport): Promise<void> {
    // Test document creation tool schema
    const createDocumentSchema = zv4.object({
      title: zv4.string().min(1, { error: "Title is required" }),  // v4 error format
      kind: zv4.enum(["code", "text", "image", "sheet"])
    });

    const testData = {
      title: "Test Document",
      kind: "text" as const
    };

    const compatible = await AISDKZodV4Adapter.testStreamingCompatibility(
      createDocumentSchema,
      testData
    );

    report.testedSchemas.push({
      name: "CreateDocumentSchema",
      compatible,
      error: compatible ? undefined : "Tool schema conversion failed"
    });

    if (!compatible) {
      report.compatible = false;
      report.issues.push("AI tool schemas incompatible with streaming functions");
    }

    // Test weather tool schema
    const weatherSchema = zv4.object({
      latitude: zv4.number().min(-90).max(90),
      longitude: zv4.number().min(-180).max(180)
    });

    const weatherTestData = {
      latitude: 37.7749,
      longitude: -122.4194
    };

    const weatherCompatible = await AISDKZodV4Adapter.testStreamingCompatibility(
      weatherSchema,
      weatherTestData
    );

    report.testedSchemas.push({
      name: "WeatherSchema",
      compatible: weatherCompatible,
      error: weatherCompatible ? undefined : "Numeric validation conversion failed"
    });

    if (!weatherCompatible) {
      report.compatible = false;
      report.issues.push("Weather tool schema conversion issues");
    }
  }

  /**
   * Test artifact streaming schemas
   */
  private static async testArtifactSchemas(report: CompatibilityReport): Promise<void> {
    // Test code artifact schema
    const codeArtifactSchema = zv4.object({
      code: zv4.string().min(1, { error: "Code content is required" })
    });

    const testCodeData = {
      code: "console.log('Hello, world!');"
    };

    const compatible = await AISDKZodV4Adapter.testStreamingCompatibility(
      codeArtifactSchema,
      testCodeData
    );

    report.testedSchemas.push({
      name: "CodeArtifactSchema",
      compatible,
      error: compatible ? undefined : "Artifact streaming schema conversion failed"
    });

    if (!compatible) {
      report.compatible = false;
      report.issues.push("Artifact streaming schemas incompatible with streamObject");
    }
  }

  /**
   * Assess performance improvements with Zod v4
   */
  private static async assessPerformance(): Promise<{
    averageImprovement: number;
    totalSchemasTest: number;
  }> {
    const testSchemas = [
      {
        name: "SimpleString",
        schema: zv4.string().min(1),
        data: "test"
      },
      {
        name: "EmailValidation", 
        schema: zv4.email(),
        data: "test@example.com"
      },
      {
        name: "UUIDValidation",
        schema: zv4.uuid(),
        data: crypto.randomUUID()
      },
      {
        name: "ComplexObject",
        schema: zv4.object({
          id: zv4.uuid(),
          email: zv4.email(),
          data: zv4.object({
            items: zv4.array(zv4.string())
          })
        }),
        data: {
          id: crypto.randomUUID(),
          email: "test@example.com",
          data: { items: ["a", "b", "c"] }
        }
      }
    ];

    let totalImprovement = 0;
    
    for (const test of testSchemas) {
      try {
        const metrics = AISDKZodV4Adapter.measureConversionPerformance(
          test.schema,
          test.data,
          1000
        );
        totalImprovement += metrics.improvement;
      } catch (error) {
        console.warn(`Performance test failed for ${test.name}:`, error);
      }
    }

    return {
      averageImprovement: totalImprovement / testSchemas.length,
      totalSchemasTest: testSchemas.length
    };
  }

  /**
   * Generate final recommendation based on test results
   */
  private static generateRecommendation(report: CompatibilityReport): void {
    if (!report.compatible) {
      if (report.issues.length > 2) {
        report.recommendation = "Defer migration until AI SDK v6+ with native Zod v4 support";
      } else {
        report.recommendation = "Proceed with selective migration - use v4 for non-AI SDK schemas";
      }
      return;
    }

    const performanceImprovement = report.performanceMetrics?.averageImprovement || 0;
    
    if (performanceImprovement > 50) {
      report.recommendation = "Proceed with full migration - significant performance benefits";
    } else if (performanceImprovement > 20) {
      report.recommendation = "Proceed with migration - moderate performance benefits";
    } else {
      report.recommendation = "Proceed with caution - limited performance benefits";
    }
  }

  /**
   * Monitor AI SDK dependency versions for compatibility updates
   */
  static async checkAISDKVersionCompatibility(): Promise<{
    currentVersion: string;
    zodV4Support: boolean;
    recommendedAction: string;
  }> {
    try {
      // Check package.json for AI SDK version
      const packageJson = await import("../../package.json");
      const aiSdkVersion = packageJson.dependencies["ai"];
      
      // Note: This would need to be updated based on actual AI SDK v4 support timeline
      const hasZodV4Support = false; // Update when AI SDK supports Zod v4
      
      return {
        currentVersion: aiSdkVersion,
        zodV4Support: hasZodV4Support,
        recommendedAction: hasZodV4Support 
          ? "Native Zod v4 support available - remove adapter layer"
          : "Continue using adapter layer for compatibility"
      };
    } catch (error) {
      return {
        currentVersion: "unknown",
        zodV4Support: false,
        recommendedAction: "Manual version check required"
      };
    }
  }
}

/**
 * Utility function to run compatibility assessment from CLI or tests
 */
export async function runCompatibilityAssessment(): Promise<void> {
  console.log("🔍 Running Zod v4 compatibility assessment...\n");
  
  const report = await ZodV4CompatibilityChecker.assessCompatibility();
  
  console.log("📊 Compatibility Report:");
  console.log(`✅ Compatible: ${report.compatible}`);
  console.log(`📋 Issues: ${report.issues.length}`);
  
  if (report.issues.length > 0) {
    console.log("\n⚠️  Issues found:");
    report.issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  console.log("\n📈 Schema Test Results:");
  report.testedSchemas.forEach(schema => {
    const status = schema.compatible ? "✅" : "❌";
    console.log(`  ${status} ${schema.name}`);
    if (schema.error) {
      console.log(`    Error: ${schema.error}`);
    }
  });
  
  if (report.performanceMetrics) {
    console.log("\n⚡ Performance Metrics:");
    console.log(`  Average improvement: ${report.performanceMetrics.averageImprovement.toFixed(1)}%`);
    console.log(`  Schemas tested: ${report.performanceMetrics.totalSchemasTest}`);
  }
  
  console.log(`\n💡 Recommendation: ${report.recommendation}`);
  
  // Check AI SDK version compatibility
  const aiSdkCompat = await ZodV4CompatibilityChecker.checkAISDKVersionCompatibility();
  console.log("\n🔧 AI SDK Compatibility:");
  console.log(`  Version: ${aiSdkCompat.currentVersion}`);
  console.log(`  Zod v4 Support: ${aiSdkCompat.zodV4Support ? "Yes" : "No"}`);
  console.log(`  Action: ${aiSdkCompat.recommendedAction}`);
}