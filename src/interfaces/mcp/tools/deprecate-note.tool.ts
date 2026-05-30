import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { NotesService } from "@/application/notes/notes.service";
import { NoteTools } from "../types/note-tools.enum";
import { deprecateNoteInputSchema } from "@/application/notes/dtos/deprecate-note.dto";

type RegisterDeprecateNoteToolDeps = {
  notesService: NotesService;
};

export const registerDeprecateNoteTool = (
  server: McpServer,
  deps: RegisterDeprecateNoteToolDeps,
) => {
  server.registerTool(
    NoteTools.DEPRECATE_NOTE,
    {
      title: "Deprecate Note",
      description: "Set Note as deprecated",
      inputSchema: deprecateNoteInputSchema,
    },
    async (deprecateNoteDto) => {
      const deprecatedNote =
        await deps.notesService.deprecateNote(deprecateNoteDto);

      return {
        content: [
          {
            type: "text",
            text: `Note with id: ${deprecateNoteDto.noteId} deprecated`,
          },
        ],
      };
    },
  );
};
