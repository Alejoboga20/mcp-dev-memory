import Database from "better-sqlite3";
import { CreateNoteInput, Note, NoteRow } from "./types/notes.types";

export class NotesRepository {
  constructor(private readonly db: Database.Database) {}

  getNoteById(id: number): Note {
    const row = this.db.prepare("SELECT * FROM notes WHERE id = ?").get(id) as
      | NoteRow
      | undefined;

    if (!row) {
      throw new Error(`Note not found: ${id}`);
    }

    return this.mapRowToNote(row);
  }

  createNote(createNoteInput: CreateNoteInput): Note {
    const timestamp = new Date().toISOString();

    const result = this.db
      .prepare(
        `
        INSERT INTO notes (
          project,
          type,
          name,
          content,
          tags,
          metadata,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      )
      .run(
        createNoteInput.project,
        createNoteInput.type,
        createNoteInput.name,
        createNoteInput.content,
        JSON.stringify(createNoteInput.tags ?? []),
        JSON.stringify(createNoteInput.metadata ?? {}),
        timestamp,
        timestamp,
      );

    const insertedNote = this.getNoteById(Number(result.lastInsertRowid));

    return insertedNote;
  }

  private mapRowToNote(row: NoteRow): Note {
    return {
      id: row.id,
      project: row.project,
      type: row.type,
      name: row.name,
      content: row.content,
      tags: row.tags ? JSON.parse(row.tags) : [],
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
