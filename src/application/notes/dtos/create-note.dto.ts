import { z } from "zod";

export const noteTypeSchema = z.enum([
  "model",
  "endpoint",
  "contract",
  "decision",
  "command",
  "bugfix",
  "other",
]).describe("Category of technical knowledge captured by the note");

export const createNoteInputSchema = z.object({
  project: z
    .string()
    .trim()
    .min(1, "Project is required")
    .describe("Project or repository this note belongs to"),
  isActive: z
    .boolean()
    .default(true)
    .describe("Whether the note should be considered active and reusable"),
  type: noteTypeSchema.describe("Kind of technical note being saved"),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .describe("Short human-readable title for the note"),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .describe("Technical details, decision context, or reusable knowledge"),
  tags: z
    .array(z.string().trim().min(1))
    .default([])
    .describe("Searchable tags used to group or retrieve related notes"),
  metadata: z
    .record(z.string(), z.unknown())
    .default({})
    .describe("Optional structured metadata associated with the note"),
});

export type CreateNoteDto = z.infer<typeof createNoteInputSchema>;
