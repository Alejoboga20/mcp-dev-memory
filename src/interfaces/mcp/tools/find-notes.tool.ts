import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { NotesService } from "@/application/notes/notes.service";
import { NoteTools } from "../types/note-tools.enum";
import { findNotesInputSchema } from "@/application/notes/dtos/find-notes.dto";

type RegisterFindNotesDeps = {
  notesService: NotesService;
};

export const registerFindNotesTool = (
  server: McpServer,
  deps: RegisterFindNotesDeps,
) => {
  server.registerTool(
    NoteTools.FIND_NOTES,
    {
      title: "Find Notes",
      description: "Find Tecnical Notes",
      inputSchema: findNotesInputSchema,
    },
    async (findNotesDto) => {
      const notes = await deps.notesService.findNotes(findNotesDto);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(notes, null, 2),
          },
        ],
      };
    },
  );
};
