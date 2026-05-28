import { z } from "zod";

import { NotesService } from "@/application/notes/notes.service";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NoteTools } from "../types/note-tools.enum";
import {
  CreateNoteDto,
  createNoteInputSchema,
} from "@/application/notes/dtos/create-note.dto";

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
        "Save a technical memory note about models, endpoints, contracts, decisions, commands, or bugfixes.",
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
