# Architecture Rules

These rules describe how agents should work in this repository. Read this file
before changing source code.

## Project Shape

This is a TypeScript Node project for local development memory backed by SQLite.
The code follows a clean architecture style:

```text
src/
  main.ts
  domain/
    notes/
      notes.entity.ts
      ports/
        notes.repository.ts
      types/
        notes.types.ts
  application/
    notes/
      create-note.use-case.ts
  infrastructure/
    database/
      migrations.ts
      sqlite.connection.ts
    notes/
      sqlite-notes.repository.ts
```

## Layer Responsibilities

### Domain

Use `src/domain` for business concepts and contracts.

- Domain code must not import from `application` or `infrastructure`.
- Domain code must not import `better-sqlite3`, Node filesystem APIs, MCP SDK,
  CLI libraries, or other adapters.
- Entities, value types, and ports live here.
- Repository interfaces belong in `domain/*/ports`.
- Keep domain types stable and independent from database rows.

### Application

Use `src/application` for use cases.

- Application code may import from `domain`.
- Application code must not import from `infrastructure`.
- Use cases receive dependencies through constructors.
- Use cases should validate and normalize input before calling ports.
- Use cases should return domain entities or application DTOs, not database rows.

### Infrastructure

Use `src/infrastructure` for concrete adapters and external technology.

- Infrastructure code may import from `domain`.
- Infrastructure code implements domain ports.
- SQLite-specific code belongs in `src/infrastructure/database` or
  `src/infrastructure/notes`.
- Database rows, SQL queries, JSON serialization, and migrations stay in
  infrastructure.
- Do not leak `better-sqlite3` types into domain or application APIs.

### Composition Root

Use `src/main.ts` as the composition root.

- Instantiate concrete infrastructure classes here.
- Wire use cases to adapters here.
- Keep orchestration thin.
- Do not put business rules in `main.ts`.

## Dependency Direction

Dependencies should point inward:

```text
main -> infrastructure -> domain
main -> application -> domain
```

Allowed imports:

- `application` imports `domain`.
- `infrastructure` imports `domain`.
- `main.ts` imports `application` and `infrastructure`.

Forbidden imports:

- `domain` importing `application` or `infrastructure`.
- `application` importing `infrastructure`.
- Domain ports importing adapter-specific types.

## Import Style

Prefer the configured absolute import alias for source imports:

```ts
import { Note } from "@/domain/notes/notes.entity";
```

Avoid deep relative imports across layers:

```ts
import { Note } from "../../domain/notes/notes.entity";
```

Relative imports are acceptable only for very local files in the same folder,
such as `./migrations.js` from `sqlite.connection.ts`.

This project uses `moduleResolution: "NodeNext"`. When importing local runtime
files relatively, include the `.js` extension if TypeScript requires it for ESM
compatibility.

## Notes Domain Rules

The current notes model includes:

- `project`
- `type`
- `name`
- `content`
- `tags`
- `metadata`
- `createdAt`
- `updatedAt`

Supported note types live in `src/domain/notes/types/notes.types.ts`.

When adding note behavior:

- Put note shape and note type changes in `domain/notes`.
- Put use case flow in `application/notes`.
- Put SQL persistence in `infrastructure/notes`.
- Keep database column names in snake_case and domain properties in camelCase.
- Map database rows to domain entities inside the SQLite repository.

## SQLite Rules

SQLite setup lives in `src/infrastructure/database`.

- Keep migrations in `migrations.ts`.
- Keep connection creation in `sqlite.connection.ts`.
- Preserve WAL mode and foreign key pragmas unless there is a clear reason to
  change them.
- Keep the default database path under `~/.mcp-dev-memory/memory.sqlite`.
- Preserve `MCP_DEV_MEMORY_DB` as the environment override.
- Store structured arrays or objects as JSON text only at the persistence edge.

## Naming Rules

- Use `*UseCase` for application use cases.
- Use `*Repository` for domain repository ports.
- Use technology-prefixed adapter names, such as `SqliteNotesRepository`.
- Use `CreateNoteInput` style names for input DTOs.
- Use `NoteRow` only in infrastructure files.

## Validation Rules

- Required business input validation belongs in use cases or domain logic.
- Persistence failure checks belong in infrastructure adapters.
- Avoid silent defaults in repositories unless the use case has already
  normalized the input.

## TypeScript Rules

- Keep `strict` mode passing.
- Run `pnpm run type:checker` after source changes.
- Use type-only imports when importing values only used as types.
- Do not introduce `any` unless the boundary is genuinely dynamic and a safer
  type is impractical.

## Package Rules

This project uses pnpm.

- Use `pnpm install` for dependencies.
- Keep `better-sqlite3` in `pnpm.onlyBuiltDependencies`; it needs native build
  scripts.
- If the native SQLite binding is missing, run:

```bash
pnpm rebuild better-sqlite3
```

## Before Finishing

Before handing work back:

- Confirm code follows the layer boundaries above.
- Confirm imports use `@/` where appropriate.
- Run `pnpm run type:checker` when source files changed.
- Mention any verification that could not be run.
