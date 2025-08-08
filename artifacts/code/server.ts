import { codePrompt, updateDocumentPrompt } from "@/lib/ai/prompts";
import { myProvider } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";
import { streamObject } from "ai";
import { z } from "zod";

const codeStreamingSchema = z.object({
  code: z.string().min(1, "Code content is required")
});

export const codeDocumentHandler = createDocumentHandler<"code">({
  kind: "code",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";

    const { fullStream } = streamObject({
      model: myProvider.languageModel("artifact-model"),
      system: codePrompt,
      prompt: title,
      schema: codeStreamingSchema
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { code } = object;

        if (code) {
          const validatedObject = codeStreamingSchema.parse({ code });

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
      schema: codeStreamingSchema
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { code } = object;

        if (code) {
          const validatedObject = codeStreamingSchema.parse({ code });

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
