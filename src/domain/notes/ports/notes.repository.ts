import type { Note } from "@/domain/notes/notes.entity";
import type {
  CreateNoteInput,
  FindNotesInput,
} from "@/domain/notes/types/notes.types";

export interface NotesRepository {
  create(createNoteInput: CreateNoteInput): Promise<Note>;
  find(findNotesInput: FindNotesInput): Promise<Note[]>;
  deprecateNote(noteId: number): Promise<void>;
}
