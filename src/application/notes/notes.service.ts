import { CreateNoteInput } from "@/domain/notes/types/notes.types";
import { CreateNoteUseCase } from "./use-cases/create-note.use-case";
import { Note } from "@/domain/notes/notes.entity";

export class NotesService {
  constructor(private readonly createNoteUseCase: CreateNoteUseCase) {}

  async createNote(input: CreateNoteInput): Promise<Note> {
    const newNote = await this.createNoteUseCase.execute(input);

    return newNote;
  }
}
