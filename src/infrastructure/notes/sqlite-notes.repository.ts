import { Note } from "@/domain/notes/notes.entity";
import { CreateNoteInput } from "@/domain/notes/types/notes.types";
import { NotesRepository } from "@/domain/notes/ports/notes.repository";
import type Database from "better-sqlite3";

type NoteRow = {
  id: number;
  project: string;
  type: Note["type"];
  name: string;
  content: string;
  tags: string | null;
  metadata: string | null;
  created_at: string;
  updated_at: string;
};

export class SqliteNotesRepository implements NotesRepository {
  constructor(private readonly db: Database.Database) {}

  async create(input: CreateNoteInput): Promise<Note> {
    const now = new Date().toISOString();

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
        input.project,
        input.type,
        input.name,
        input.content,
        JSON.stringify(input.tags ?? []),
        JSON.stringify(input.metadata ?? {}),
        now,
        now,
      );

    const row = this.db
      .prepare("SELECT * FROM notes WHERE id = ?")
      .get(Number(result.lastInsertRowid)) as NoteRow | undefined;

    if (!row) {
      throw new Error("Failed to create note");
    }

    return this.mapRowToNote(row);
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
