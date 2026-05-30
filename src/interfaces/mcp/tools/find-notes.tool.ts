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
      description:
        "Search local developer memory for technical notes across projects. Use this before implementing or modifying database models, endpoints, schemas, DTOs, contracts, migrations, or architecture-sensitive code.",
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
