import { NotesService } from "./application/notes/notes.service";
import { CreateNoteUseCase } from "./application/notes/use-cases/create-note.use-case";
import { FindNotesUseCase } from "./application/notes/use-cases/find-notes.use-case";
import {
  createSqliteConnection,
  getDatabasePath,
} from "./infrastructure/database/sqlite.connection";
import { SqliteNotesRepository } from "./infrastructure/notes/sqlite-notes.repository";

async function main() {
  const db = createSqliteConnection();

  const notesRepository = new SqliteNotesRepository(db);

  const createNotesUseCase = new CreateNoteUseCase(notesRepository);
  const findNotesUseCase = new FindNotesUseCase(notesRepository);

  const notesService = new NotesService(createNotesUseCase, findNotesUseCase);

  console.log(`Notes Service: ${JSON.stringify(notesService, null, 2)}`);
  console.log(`Notes Repository: ${JSON.stringify(notesRepository, null, 2)}`);
  console.log("DB path:", getDatabasePath());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
