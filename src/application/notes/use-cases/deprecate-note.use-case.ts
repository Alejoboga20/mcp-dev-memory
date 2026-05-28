import { NotesRepository } from "@/domain/notes/ports/notes.repository";

export class DeprecateNoteUseCase {
  constructor(private readonly notesRepository: NotesRepository) {}

  async execute(input: number): Promise<void> {
    await this.notesRepository.deprecateNote(input);
  }
}
