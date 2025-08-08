import { generateUUID } from '@/lib/utils';
import { tool, type UIMessageStreamWriter } from 'ai';
import { z } from 'zod';
import { AISDKZodV4Adapter } from '@/lib/ai/zod-v4-adapter';
import type { Session } from 'next-auth';
import {
  artifactKinds,
  documentHandlersByArtifactKind,
} from '@/lib/artifacts/server';
import type { ChatMessage } from '@/lib/types';

interface CreateDocumentProps {
  session: Session;
  dataStream: UIMessageStreamWriter<ChatMessage>;
}

// Create Zod v4 schema with enhanced validation
const createDocumentSchemaV4 = z.object({
  title: z.string().min(1, { error: 'Title is required' }),
  kind: z.enum(artifactKinds),
});

export const createDocument = ({ session, dataStream }: CreateDocumentProps) => {
  // Use compatibility adapter for AI SDK integration
  const adapterSchema = AISDKZodV4Adapter.createStreamingToolSchema(
    createDocumentSchemaV4
  );

  return tool({
    description:
      'Create a document for a writing or content creation activities. This tool will call other functions that will generate the contents of the document based on the title and kind.',
    inputSchema: adapterSchema.aiSdkSchema,
    execute: async (params) => {
      // Validate with v4 for enhanced type safety
      const { title, kind } = adapterSchema.validate(params);
      const id = generateUUID();

      dataStream.write({
        type: 'data-kind',
        data: kind,
        transient: true,
      });

      dataStream.write({
        type: 'data-id',
        data: id,
        transient: true,
      });

      dataStream.write({
        type: 'data-title',
        data: title,
        transient: true,
      });

      dataStream.write({
        type: 'data-clear',
        data: null,
        transient: true,
      });

      const documentHandler = documentHandlersByArtifactKind.find(
        (documentHandlerByArtifactKind) =>
          documentHandlerByArtifactKind.kind === kind,
      );

      if (!documentHandler) {
        throw new Error(`No document handler found for kind: ${kind}`);
      }

      await documentHandler.onCreateDocument({
        id,
        title,
        dataStream,
        session,
      });

      dataStream.write({ type: 'data-finish', data: null, transient: true });

      return {
        id,
        title,
        kind,
        content: 'A document was created and is now visible to the user.',
      };
    },
  });
};