import { Note } from "@/domain/notes/notes.entity";
import { NotesRepository } from "@/domain/notes/ports/notes.repository";

export class DeprecateNoteUseCase {
  constructor(private readonly notesRepository: NotesRepository) {}

  async execute(input: number): Promise<Note> {
    const deprecatedNote = await this.notesRepository.deprecateNote(input);

    return deprecatedNote;
  }
}
