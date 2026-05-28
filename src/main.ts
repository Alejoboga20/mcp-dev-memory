import { createApp } from "./composition";
import { startMcpServer } from "./interfaces/mcp/mcp-server";

async function main() {
  const command = process.argv[2];

  if (command === "server") {
    const app = createApp();
    await startMcpServer(app);
    return;
  }

  console.error("Unknown command");
  console.error("Usage: mcp-dev-memory server");
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
