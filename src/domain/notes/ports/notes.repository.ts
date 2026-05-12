import { Note } from "@/domain/notes/notes.entity";
import { CreateNoteInput } from "@/domain/notes/types/notes.types";

export interface NotesRepository {
  create(input: CreateNoteInput): Promise<Note>;
}
