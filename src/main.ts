import { createApp } from "./composition";
import { startCli } from "./interfaces/cli/cli";
import { startMcpServer } from "./interfaces/mcp/mcp-server";

async function main() {
  const command = process.argv[2];
  const app = createApp();

  if (command === "server") {
    await startMcpServer(app);
    return;
  }

  await startCli(app);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
