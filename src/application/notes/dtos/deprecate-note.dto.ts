import z from "zod";

export const deprecateNoteInputSchema = z.object({
  noteId: z.number().int(),
});

export type DeprecateNoteDto = z.infer<typeof deprecateNoteInputSchema>;
