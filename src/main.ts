import { NotesService } from "./application/notes/notes.service";
import { CreateNoteUseCase } from "./application/notes/use-cases/create-note.use-case";
import {
  createSqliteConnection,
  getDatabasePath,
} from "./infrastructure/database/sqlite.connection";
import { SqliteNotesRepository } from "./infrastructure/notes/sqlite-notes.repository";

async function main() {
  const db = createSqliteConnection();

  const notesRepository = new SqliteNotesRepository(db);
  const createNotesUseCase = new CreateNoteUseCase(notesRepository);
  const notesService = new NotesService(createNotesUseCase);

  console.log(`Notes Service: ${notesService}`);
  console.log(`Notes Repository: ${notesRepository}`);
  console.log("DB path:", getDatabasePath());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
