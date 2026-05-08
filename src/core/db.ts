import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import Database from "better-sqlite3";

const DEFAULT_DB_DIR = path.join(os.homedir(), ".mcp-dev-memory");
const DEFAULT_DB_PATH = path.join(DEFAULT_DB_DIR, "memory.sqlite");

export const getDatabasePath = (): string => {
  const dbPath = process.env.MCP_DEV_MEMORY_DB ?? DEFAULT_DB_PATH;

  return dbPath;
};

export const createDatabaseConnection = (): Database.Database => {
  const dbPath = getDatabasePath();
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  runMigrations(db);

  return db;
};

export const runMigrations = (db: Database.Database): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project TEXT NOT NULL,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_notes_project ON notes(project);
    CREATE INDEX IF NOT EXISTS idx_notes_type ON notes(type);
    CREATE INDEX IF NOT EXISTS idx_notes_name ON notes(name);
    CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
    `);
};
