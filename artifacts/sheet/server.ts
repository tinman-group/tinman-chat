import { myProvider } from '@/lib/ai/providers';
import { sheetPrompt, updateDocumentPrompt } from '@/lib/ai/prompts';
import { createDocumentHandler } from '@/lib/artifacts/server';
import { streamObject } from 'ai';
import { z } from 'zod';
import { AISDKZodV4Adapter } from '@/lib/ai/zod-v4-adapter';

// Create Zod v4 schema with enhanced validation
const sheetStreamingSchemaV4 = z.object({
  csv: z.string().min(1, { error: 'CSV data is required' }).describe('CSV data'),
});

// Use compatibility adapter for AI SDK streaming
const sheetAdapterSchema = AISDKZodV4Adapter.createStreamingToolSchema(
  sheetStreamingSchemaV4
);

export const sheetDocumentHandler = createDocumentHandler<'sheet'>({
  kind: 'sheet',
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = '';

    const { fullStream } = streamObject({
      model: myProvider.languageModel('artifact-model'),
      system: sheetPrompt,
      prompt: title,
      schema: sheetAdapterSchema.aiSdkSchema,
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === 'object') {
        const { object } = delta;
        const { csv } = object;

        if (csv) {
          // Validate with v4 for enhanced type safety
          const validatedObject = sheetAdapterSchema.validate({ csv });
          
          dataStream.write({
            type: 'data-sheetDelta',
            data: validatedObject.csv,
            transient: true,
          });

          draftContent = validatedObject.csv;
        }
      }
    }

    dataStream.write({
      type: 'data-sheetDelta',
      data: draftContent,
      transient: true,
    });

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = '';

    const { fullStream } = streamObject({
      model: myProvider.languageModel('artifact-model'),
      system: updateDocumentPrompt(document.content, 'sheet'),
      prompt: description,
      schema: sheetAdapterSchema.aiSdkSchema,
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === 'object') {
        const { object } = delta;
        const { csv } = object;

        if (csv) {
          // Validate with v4 for enhanced type safety
          const validatedObject = sheetAdapterSchema.validate({ csv });
          
          dataStream.write({
            type: 'data-sheetDelta',
            data: validatedObject.csv,
            transient: true,
          });

          draftContent = validatedObject.csv;
        }
      }
    }

    return draftContent;
  },
});