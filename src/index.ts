import { createDatabaseConnection, getDatabasePath } from "./core/db";

const db = createDatabaseConnection();
const result = db.prepare("SELECT datetime('now') as now").get();

console.log("SQLite connected");
console.log("DB path:", getDatabasePath());
console.log(result);
