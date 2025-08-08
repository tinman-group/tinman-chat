import { codePrompt, updateDocumentPrompt } from "@/lib/ai/prompts";
import { myProvider } from "@/lib/ai/providers";
import { AISDKZodV4Adapter } from "@/lib/ai/zod-v4-adapter";
import { createDocumentHandler } from "@/lib/artifacts/server";
import { streamObject } from "ai";
import { z } from "zod";

// Create Zod v4 schema with enhanced validation
const codeStreamingSchemaV4 = z.object({
  code: z.string().min(1, "Code content is required")
});

// Use compatibility adapter for AI SDK streaming
const codeAdapterSchema = AISDKZodV4Adapter.createStreamingToolSchema(
  codeStreamingSchemaV4
);

export const codeDocumentHandler = createDocumentHandler<"code">({
  kind: "code",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";

    const { fullStream } = streamObject({
      model: myProvider.languageModel("artifact-model"),
      system: codePrompt,
      prompt: title,
      schema: codeAdapterSchema.aiSdkSchema
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { code } = object;

        if (code) {
          // Validate with v4 for enhanced type safety
          const validatedObject = codeAdapterSchema.validate({ code });

          dataStream.write({
            type: "data-codeDelta",
            data: validatedObject.code ?? "",
            transient: true
          });

          draftContent = validatedObject.code;
        }
      }
    }

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = "";

    const { fullStream } = streamObject({
      model: myProvider.languageModel("artifact-model"),
      system: updateDocumentPrompt(document.content, "code"),
      prompt: description,
      schema: codeAdapterSchema.aiSdkSchema
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { code } = object;

        if (code) {
          // Validate with v4 for enhanced type safety
          const validatedObject = codeAdapterSchema.validate({ code });

          dataStream.write({
            type: "data-codeDelta",
            data: validatedObject.code ?? "",
            transient: true
          });

          draftContent = validatedObject.code;
        }
      }
    }

    return draftContent;
  }
});
