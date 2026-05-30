import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { NotesService } from "@/application/notes/notes.service";
import { createNoteInputSchema } from "@/application/notes/dtos/create-note.dto";
import { NoteTools } from "../types/note-tools.enum";

type RegisterSaveNoteToolDeps = {
  notesService: NotesService;
};

export const registerSaveNoteTool = (
  server: McpServer,
  deps: RegisterSaveNoteToolDeps,
) => {
  server.registerTool(
    NoteTools.SAVE_NOTE,
    {
      title: "Save Note",
      description:
        "Save a technical note into local developer memory. Use this when discovering database models, API endpoints, contracts, migration mappings, implementation decisions, useful commands, bugs, fixes, or project-specific knowledge that should be reused later.",
      inputSchema: createNoteInputSchema,
    },
    async (createNoteDto) => {
      const note = await deps.notesService.createNote(createNoteDto);

      return {
        content: [
          {
            type: "text",
            text: `Note saved with id ${note.id}`,
          },
        ],
      };
    },
  );
};
