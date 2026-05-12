import { CreateNoteUseCase } from "./application/notes/create-note.use-case";
import {
  createSqliteConnection,
  getDatabasePath,
} from "./infrastructure/database/sqlite.connection";
import { SqliteNotesRepository } from "./infrastructure/notes/sqlite-notes.repository";

async function main() {
  const db = createSqliteConnection();
  const notesRepository = new SqliteNotesRepository(db);
  const createNotesUseCase = new CreateNoteUseCase(notesRepository);

  const note = await createNotesUseCase.execute({
    project: "node-api",
    type: "endpoint",
    name: "GET /users/:id",
    content: "Returns UserDto with id, email, status and createdAt.",
    tags: ["users", "endpoint", "migration"],
    metadata: {
      targetProject: "python-api",
      relatedEntity: "GET /users/{user_id}",
    },
  });

  console.log("DB path:", getDatabasePath());
  console.log("Created note:");
  console.log(note);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
