import { NotesService } from "@/application/notes/notes.service";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerNotesTools } from "./tools/register-notes-tools";

type McpServerDependencies = {
  notesService: NotesService;
};

export const startMcpServer = async (deps: McpServerDependencies) => {
  const server = new McpServer({
    name: "mcp-dev-memory",
    version: "0.0.1",
  });

  registerNotesTools(server, {
    notesService: deps.notesService,
  });

  const transport = new StdioServerTransport();

  await server.connect(transport);
};
