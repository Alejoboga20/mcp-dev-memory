# mcp-dev-memory

A TypeScript prototype for storing development notes in a local SQLite database.

The current implementation creates a SQLite database, runs a small migration for a
`notes` table, and includes a repository for creating and reading notes. The MCP
server and CLI folders are present as placeholders for the next layer of the
project.

## Requirements

- Node.js 20 or newer
- pnpm 10
- A working native build toolchain for `better-sqlite3`

## Setup

Install dependencies:

```bash
pnpm install
```

This project uses `better-sqlite3`, which needs a native binary. The repository
allows pnpm to run the build script for that package through:

```json
"pnpm": {
  "onlyBuiltDependencies": [
    "better-sqlite3"
  ]
}
```

If SQLite fails to load with a missing `better_sqlite3.node` error, rebuild it:

```bash
pnpm rebuild better-sqlite3
```

## Scripts

Run the development entry point in watch mode:

```bash
pnpm run dev
```

Run the server entry point argument in watch mode:

```bash
pnpm run dev:server
```

Run TypeScript checking:

```bash
pnpm run type:checker
```

## Database

By default, the SQLite database is created at:

```text
~/.mcp-dev-memory/memory.sqlite
```

You can override the database path with:

```bash
MCP_DEV_MEMORY_DB=/path/to/memory.sqlite pnpm run dev
```

The database connection enables:

- WAL journal mode
- Foreign keys
- Automatic creation of the `notes` table and indexes

## Current Project Structure

```text
src/
  index.ts
  core/
    db.ts
    notes/
      notes.repository.ts
      notes.service.ts
      types/
        notes.types.ts
  mcp/
    server.ts
  cli/
    index.ts
docs/
  learnings/
    sqlite-notes.md
```

## Source Overview

- `src/index.ts` opens the database, verifies the SQLite connection, creates a
  sample note, and prints the result.
- `src/core/db.ts` resolves the database path, creates the database directory,
  opens the SQLite connection, configures pragmas, and runs migrations.
- `src/core/notes/notes.repository.ts` contains the `NotesRepository` class with
  methods to create a note and fetch a note by ID.
- `src/core/notes/types/notes.types.ts` defines note-related TypeScript types.
- `src/core/notes/notes.service.ts` is currently a placeholder.
- `src/mcp/server.ts` is currently a placeholder for the MCP server.
- `src/cli/index.ts` is currently a placeholder for the CLI.
- `docs/learnings/sqlite-notes.md` contains project notes about SQLite.

## Notes Schema

The current migration creates a `notes` table with:

- `id`
- `project`
- `type`
- `name`
- `content`
- `tags`
- `metadata`
- `created_at`
- `updated_at`

Indexes are created for `project`, `type`, `name`, and `created_at`.

Supported note types are:

```text
model
endpoint
contract
decision
command
bugfix
other
```
