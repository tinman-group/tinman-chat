import { tool, type UIMessageStreamWriter } from 'ai';
import type { Session } from 'next-auth';
import { z } from 'zod';
import { AISDKZodV4Adapter } from '@/lib/ai/zod-v4-adapter';
import { getDocumentById } from '@/lib/db/queries';
import { documentHandlersByArtifactKind } from '@/lib/artifacts/server';
import type { ChatMessage } from '@/lib/types';

interface UpdateDocumentProps {
  session: Session;
  dataStream: UIMessageStreamWriter<ChatMessage>;
}

// Create Zod v4 schema with enhanced validation
const updateDocumentSchemaV4 = z.object({
  id: z.string().min(1, { error: 'Document ID is required' }).describe('The ID of the document to update'),
  description: z
    .string()
    .min(1, { error: 'Description is required' })
    .describe('The description of changes that need to be made'),
});

export const updateDocument = ({ session, dataStream }: UpdateDocumentProps) => {
  // Use compatibility adapter for AI SDK integration
  const adapterSchema = AISDKZodV4Adapter.createStreamingToolSchema(
    updateDocumentSchemaV4
  );

  return tool({
    description: 'Update a document with the given description.',
    inputSchema: adapterSchema.aiSdkSchema,
    execute: async (params) => {
      // Validate with v4 for enhanced type safety
      const { id, description } = adapterSchema.validate(params);
      const document = await getDocumentById({ id });

      if (!document) {
        return {
          error: 'Document not found',
        };
      }

      dataStream.write({
        type: 'data-clear',
        data: null,
        transient: true,
      });

      const documentHandler = documentHandlersByArtifactKind.find(
        (documentHandlerByArtifactKind) =>
          documentHandlerByArtifactKind.kind === document.kind,
      );

      if (!documentHandler) {
        throw new Error(`No document handler found for kind: ${document.kind}`);
      }

      await documentHandler.onUpdateDocument({
        document,
        description,
        dataStream,
        session,
      });

      dataStream.write({ type: 'data-finish', data: null, transient: true });

      return {
        id,
        title: document.title,
        kind: document.kind,
        content: 'The document has been updated successfully.',
      };
    },
  });
};
