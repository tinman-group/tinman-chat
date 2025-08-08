import { getDocumentById, saveSuggestions } from "@/lib/db/queries";
import type { Suggestion } from "@/lib/db/schema";
import type { ChatMessage } from "@/lib/types";
import { generateUUID } from "@/lib/utils";
import { streamObject, tool, type UIMessageStreamWriter } from "ai";
import type { Session } from "next-auth";
import { z } from "zod";
import { AISDKZodV4Adapter } from "@/lib/ai/zod-v4-adapter";
import { myProvider } from "../providers";

interface RequestSuggestionsProps {
  session: Session;
  dataStream: UIMessageStreamWriter<ChatMessage>;
}

// Create Zod v4 schema with enhanced validation
const requestSuggestionsSchemaV4 = z.object({
  documentId: z.string().min(1, { error: "Document ID is required" }).describe("The ID of the document to request edits")
});

export const requestSuggestions = ({
  session,
  dataStream
}: RequestSuggestionsProps) => {
  // Use compatibility adapter for AI SDK integration
  const adapterSchema = AISDKZodV4Adapter.createStreamingToolSchema(
    requestSuggestionsSchemaV4
  );

  return tool({
    description: "Request suggestions for a document",
    inputSchema: adapterSchema.aiSdkSchema,
    execute: async (params) => {
      // Validate with v4 for enhanced type safety
      const { documentId } = adapterSchema.validate(params);
      
      const document = await getDocumentById({ id: documentId });

      if (!document || !document.content) {
        return {
          error: "Document not found"
        };
      }

      const suggestions: Array<
        Omit<Suggestion, "userId" | "createdAt" | "documentCreatedAt">
      > = [];

      const { elementStream } = streamObject({
        model: myProvider.languageModel("artifact-model"),
        system:
          "You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.",
        prompt: document.content,
        output: "array",
        schema: z.object({
          originalSentence: z.string().describe("The original sentence"),
          suggestedSentence: z.string().describe("The suggested sentence"),
          description: z.string().describe("The description of the suggestion")
        })
      });

      for await (const element of elementStream) {
        // @ts-expect-error todo: fix type
        const suggestion: Suggestion = {
          originalText: element.originalSentence,
          suggestedText: element.suggestedSentence,
          description: element.description,
          id: generateUUID(),
          documentId: documentId,
          isResolved: false
        };

        dataStream.write({
          type: "data-suggestion",
          data: suggestion,
          transient: true
        });

        suggestions.push(suggestion);
      }

      if (session.user?.id) {
        const userId = session.user.id;

        await saveSuggestions({
          suggestions: suggestions.map((suggestion) => ({
            ...suggestion,
            userId,
            createdAt: new Date(),
            documentCreatedAt: document.createdAt
          }))
        });
      }

      return {
        id: documentId,
        title: document.title,
        kind: document.kind,
        message: "Suggestions have been added to the document"
      };
    }
  });
};