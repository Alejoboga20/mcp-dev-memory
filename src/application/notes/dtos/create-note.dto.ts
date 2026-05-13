import { z } from "zod";

export const noteTypeSchema = z.enum([
  "model",
  "endpoint",
  "contract",
  "decision",
  "command",
  "bugfix",
  "other",
]);

export const createNoteInputSchema = z.object({
  project: z.string().trim().min(1, "Project is required"),
  type: noteTypeSchema,
  name: z.string().trim().min(1, "Name is required"),
  content: z.string().trim().min(1, "Content is required"),
  tags: z.array(z.string().trim().min(1)).default([]),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type CreateNoteDto = z.infer<typeof createNoteInputSchema>;
