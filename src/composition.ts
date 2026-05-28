import { NotesService } from "./application/notes/notes.service";
import { CreateNoteUseCase } from "./application/notes/use-cases/create-note.use-case";
import { DeprecateNoteUseCase } from "./application/notes/use-cases/deprecate-note.use-case";
import { FindNotesUseCase } from "./application/notes/use-cases/find-notes.use-case";
import {
  createSqliteConnection,
  getDatabasePath,
} from "./infrastructure/database/sqlite.connection";
import { SqliteNotesRepository } from "./infrastructure/notes/sqlite-notes.repository";

export const createApp = () => {
  const db = createSqliteConnection();

  const notesRepository = new SqliteNotesRepository(db);

  const createNotesUseCase = new CreateNoteUseCase(notesRepository);
  const findNotesUseCase = new FindNotesUseCase(notesRepository);
  const deprecatedNoteUseCase = new DeprecateNoteUseCase(notesRepository);

  const notesService = new NotesService(
    createNotesUseCase,
    findNotesUseCase,
    deprecatedNoteUseCase,
  );

  return {
    notesService,
  };
};
