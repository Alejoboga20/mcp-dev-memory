import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runMigrations } from "./migrations.js";

const DEFAULT_DB_DIR = path.join(os.homedir(), ".mcp-dev-memory");
const DEFAULT_DB_PATH = path.join(DEFAULT_DB_DIR, "memory.sqlite");

export const getDatabasePath = (): string => {
  return process.env.MCP_DEV_MEMORY_DB ?? DEFAULT_DB_PATH;
};

export const createSqliteConnection = (): Database.Database => {
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
