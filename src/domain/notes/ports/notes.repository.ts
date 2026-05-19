import type { Note } from "@/domain/notes/notes.entity";
import type {
  CreateNoteInput,
  FindNotesInput,
} from "@/domain/notes/types/notes.types";

export interface NotesRepository {
  create(input: CreateNoteInput): Promise<Note>;
  find(input?: FindNotesInput): Promise<Note[]>;
}
