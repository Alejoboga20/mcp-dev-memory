import { CreateNoteUseCase } from "./use-cases/create-note.use-case";
import type { Note } from "@/domain/notes/notes.entity";
import type { CreateNoteDto } from "./dtos/create-note.dto";
import { FindNotesUseCase } from "./use-cases/find-notes.use-case";
import type { FindNotesDto } from "./dtos/find-notes.dto";
import { DeprecateNoteUseCase } from "./use-cases/deprecate-note.use-case";
import { DeprecateNoteDto } from "./dtos/deprecate-note.dto";

export class NotesService {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly findNotesUseCase: FindNotesUseCase,
    private readonly deprecatedNoteUseCase: DeprecateNoteUseCase,
  ) {}

  async createNote(input: CreateNoteDto): Promise<Note> {
    const newNote = await this.createNoteUseCase.execute(input);

    return newNote;
  }

  async findNotes(input: FindNotesDto = {}): Promise<Note[]> {
    const notes = await this.findNotesUseCase.execute(input);

    return notes;
  }

  async deprecateNote(input: DeprecateNoteDto): Promise<Note> {
    const deprecatedNote = await this.deprecatedNoteUseCase.execute(
      input.noteId,
    );

    return deprecatedNote;
  }
}
