import type { Note } from "@/domain/notes/notes.entity";
import type { NotesRepository } from "@/domain/notes/ports/notes.repository";
import { FindNotesDto, findNotesInputSchema } from "../dtos/find-notes.dto";

export class FindNotesUseCase {
  constructor(private readonly notesRepository: NotesRepository) {}

  async execute(input: FindNotesDto = {}): Promise<Note[]> {
    const parsedInput = findNotesInputSchema.parse(input);
    const notes = await this.notesRepository.find(parsedInput);

    return notes;
  }
}
