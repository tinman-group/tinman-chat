import { myProvider } from '@/lib/ai/providers';
import { sheetPrompt, updateDocumentPrompt } from '@/lib/ai/prompts';
import { createDocumentHandler } from '@/lib/artifacts/server';
import { streamObject } from 'ai';
import { z } from 'zod';

const sheetStreamingSchema = z.object({
  csv: z.string().min(1, 'CSV data is required').describe('CSV data'),
});

export const sheetDocumentHandler = createDocumentHandler<'sheet'>({
  kind: 'sheet',
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = '';

    const { fullStream } = streamObject({
      model: myProvider.languageModel('artifact-model'),
      system: sheetPrompt,
      prompt: title,
      schema: sheetStreamingSchema,
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === 'object') {
        const { object } = delta;
        const { csv } = object;

        if (csv) {
          const validatedObject = sheetStreamingSchema.parse({ csv });
          
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
      schema: sheetStreamingSchema,
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === 'object') {
        const { object } = delta;
        const { csv } = object;

        if (csv) {
          const validatedObject = sheetStreamingSchema.parse({ csv });
          
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