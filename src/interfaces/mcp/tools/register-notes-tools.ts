import { NotesService } from "@/application/notes/notes.service";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSaveNoteTool } from "./save-note.tool";

type RegisterNotesToolsDeps = {
  notesService: NotesService;
};

export const registerNotesTools = (
  server: McpServer,
  deps: RegisterNotesToolsDeps,
) => {
  registerSaveNoteTool(server, deps);
};
