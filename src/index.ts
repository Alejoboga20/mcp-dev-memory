import { createDatabaseConnection, getDatabasePath } from "./core/db";
import { NotesRepository } from "./core/notes/notes.repository";

const db = createDatabaseConnection();
const result = db.prepare("SELECT datetime('now') as now").get();

console.log("SQLite connected");
console.log("DB path:", getDatabasePath());
console.log(result);

const notesRepository = new NotesRepository(db);

const note = notesRepository.createNote({
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

console.log("Created note:");
console.log(note);
