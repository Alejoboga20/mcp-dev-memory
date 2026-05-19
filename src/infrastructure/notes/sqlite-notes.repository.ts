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

  async find(input: FindNotesInput = {}): Promise<Note[]> {
    const { whereClause, params } = this.buildFindQuery(input);

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

  private buildFindQuery(input: FindNotesInput): {
    whereClause: string;
    params: SqliteQueryParam[];
  } {
    const conditions: string[] = [];
    const params: SqliteQueryParam[] = [];

    if (input.project) {
      conditions.push("project = ?");
      params.push(input.project);
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
      whereClause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
      params,
    };
  }

  private buildJsonPath(key: string): string {
    return `$.${JSON.stringify(key)}`;
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
