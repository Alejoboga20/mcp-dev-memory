import { z } from "zod";

import { noteTypeSchema } from "./create-note.dto";

export const findNotesInputSchema = z.object({
  project: z.string().trim().min(1).optional(),
  type: noteTypeSchema.optional(),
  name: z.string().trim().min(1).optional(),
  content: z.string().trim().min(1).optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type FindNotesDto = z.infer<typeof findNotesInputSchema>;
