import z from "zod";

export const deprecateNoteInputSchema = z.object({
  noteId: z
    .number()
    .int()
    .describe("Numeric identifier of the note to mark as deprecated"),
});

export type DeprecateNoteDto = z.infer<typeof deprecateNoteInputSchema>;
