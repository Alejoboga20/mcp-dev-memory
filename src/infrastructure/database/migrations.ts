import type Database from "better-sqlite3";

type TableInfoRow = {
  name: string;
};

export function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

  `);

  const columns = db.prepare("PRAGMA table_info(notes)").all() as TableInfoRow[];
  const hasIsActiveColumn = columns.some((column) => column.name === "is_active");

  if (!hasIsActiveColumn) {
    db.exec("ALTER TABLE notes ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1");
  }

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_notes_project ON notes(project);
    CREATE INDEX IF NOT EXISTS idx_notes_is_active ON notes(is_active);
    CREATE INDEX IF NOT EXISTS idx_notes_type ON notes(type);
    CREATE INDEX IF NOT EXISTS idx_notes_name ON notes(name);
  `);
}
