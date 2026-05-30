import { z } from "zod";

import { noteTypeSchema } from "./create-note.dto";

export const findNotesInputSchema = z.object({
  project: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe("Filter notes by project or repository"),
  isActive: z
    .boolean()
    .optional()
    .describe("Filter by whether notes are active or deprecated"),
  type: noteTypeSchema
    .optional()
    .describe("Filter notes by technical knowledge category"),
  name: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe("Filter notes by title or name"),
  content: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe("Search for notes containing this content"),
  tags: z
    .array(z.string().trim().min(1))
    .optional()
    .describe("Filter notes that match the provided tags"),
  metadata: z
    .record(z.string(), z.unknown())
    .optional()
    .describe("Filter notes by structured metadata fields"),
});

export type FindNotesDto = z.infer<typeof findNotesInputSchema>;
