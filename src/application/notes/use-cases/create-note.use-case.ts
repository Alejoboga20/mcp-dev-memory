import { Note } from "@/domain/notes/notes.entity";
import { NotesRepository } from "@/domain/notes/ports/notes.repository";

import { CreateNoteDto, createNoteInputSchema } from "../dtos/create-note.dto";

export class CreateNoteUseCase {
  constructor(private readonly notesRepository: NotesRepository) {}

  async execute(input: CreateNoteDto): Promise<Note> {
    const parsedInput = createNoteInputSchema.parse(input);

    const newNote = await this.notesRepository.create(parsedInput);

    return newNote;
  }
}
