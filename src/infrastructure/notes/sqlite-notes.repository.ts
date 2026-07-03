import type { Note } from "@/domain/notes/notes.entity";
import type {
  CreateNoteInput,
  FindNotesInput,
} from "@/domain/notes/types/notes.types";
import type { NotesRepository } from "@/domain/notes/ports/notes.repository";
import type Database from "better-sqlite3";

type NoteRow = {
  id: number;
  project: string;
  is_active: 0 | 1;
  type: Note["type"];
  name: string;
  content: string;
  tags: string | null;
  metadata: string | null;
  created_at: string;
  updated_at: string;
};

type SqliteQueryParam = string | number | bigint | Buffer | null;

export class SqliteNotesRepository implements NotesRepository {
  constructor(private readonly db: Database.Database) {}

  async create(createNoteInput: CreateNoteInput): Promise<Note> {
    const now = new Date().toISOString();

    const result = this.db
      .prepare(
        `
        INSERT INTO notes (
          project,
          is_active,
          type,
          name,
          content,
          tags,
          metadata,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      )
      .run(
        createNoteInput.project,
        this.toSqliteBoolean(createNoteInput.isActive),
        createNoteInput.type,
        createNoteInput.name,
        createNoteInput.content,
        JSON.stringify(createNoteInput.tags ?? []),
        JSON.stringify(createNoteInput.metadata ?? {}),
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

  async find(findNotesInput: FindNotesInput = {}): Promise<Note[]> {
    const { whereClause, params } = this.buildFindQuery(findNotesInput);

    const rows = this.db
      .prepare(
        `
        SELECT *
        FROM notes
        ${whereClause}
        ORDER BY created_at DESC
      `,
      )
      .all(...params) as NoteRow[];

    return rows.map((row) => this.mapRowToNote(row));
  }

  async deprecateNote(noteId: number): Promise<Note> {
    const result = this.db
      .prepare(
        `
        UPDATE notes
        SET
          is_active = ?,
          updated_at = ?
        WHERE id = ?
      `,
      )
      .run(this.toSqliteBoolean(false), new Date().toISOString(), noteId);

    if (result.changes === 0) throw new Error(`Note not found: ${noteId}`);

    const updatedNote = await this.find({ id: noteId });
    console.log({ updatedNote });

    if (!updatedNote || updatedNote.length === 0)
      throw new Error(`Note with id ${noteId} not found after update`);

    return updatedNote[0];
  }

  private buildFindQuery(input: FindNotesInput): {
    whereClause: string;
    params: SqliteQueryParam[];
  } {
    const conditions: string[] = [];
    const params: SqliteQueryParam[] = [];

    if (input.id) {
      conditions.push("id = ?");
      params.push(input.id);
    }

    if (input.project) {
      conditions.push("project = ?");
      params.push(input.project);
    }

    if (input.isActive !== undefined) {
      conditions.push("is_active = ?");
      params.push(this.toSqliteBoolean(input.isActive));
    }

    if (input.type) {
      conditions.push("type = ?");
      params.push(input.type);
    }

    if (input.name) {
      conditions.push("name LIKE ?");
      params.push(`%${input.name}%`);
    }

    if (input.content) {
      conditions.push("content LIKE ?");
      params.push(`%${input.content}%`);
    }

    for (const tag of input.tags ?? []) {
      conditions.push(
        `
        EXISTS (
          SELECT 1
          FROM json_each(notes.tags)
          WHERE json_each.value = ?
        )
      `,
      );
      params.push(tag);
    }

    for (const [key, value] of Object.entries(input.metadata ?? {})) {
      const serializedValue = JSON.stringify(value);

      if (serializedValue === undefined) {
        throw new Error(`Metadata filter is not JSON-serializable: ${key}`);
      }

      conditions.push("json_extract(metadata, ?) = json_extract(?, '$')");
      params.push(this.buildJsonPath(key), serializedValue);
    }

    return {
      whereClause:
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
      params,
    };
  }

  private buildJsonPath(key: string): string {
    return `$.${JSON.stringify(key)}`;
  }

  private toSqliteBoolean(value: boolean): 0 | 1 {
    return value ? 1 : 0;
  }

  private mapRowToNote(row: NoteRow): Note {
    return {
      id: row.id,
      project: row.project,
      isActive: row.is_active === 1,
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
