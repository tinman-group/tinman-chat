import { z } from "zod/v4";

const textPartSchema = z.object({
  type: z.enum(["text"]),
  text: z
    .string()
    .min(1, "Text content is required")
    .max(2000, "Text content too long")
});

const filePartSchema = z.object({
  type: z.enum(["file"]),
  mediaType: z.enum(["image/jpeg", "image/png"]),
  name: z
    .string()
    .min(1, "File name is required")
    .max(100, "File name too long"),
  url: z.url()
});

const partSchema = z.union([textPartSchema, filePartSchema]);

export const postRequestBodySchema = z.object({
  id: z.uuid(),
  message: z.object({
    id: z.uuid(),
    role: z.enum(["user"]),
    parts: z.array(partSchema)
  }),
  selectedChatModel: z.enum(["chat-model", "chat-model-reasoning"]),
  selectedVisibilityType: z.enum(["public", "private"])
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
