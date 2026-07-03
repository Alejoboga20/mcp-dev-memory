import { Command } from "commander";

import { NotesService } from "@/application/notes/notes.service";
import { interactiveCli } from "./interactive-cli";
import chalk from "chalk";

type StartCliDeps = {
  notesService: NotesService;
};

export const startCli = async (deps: StartCliDeps) => {
  const program = new Command();

  console.clear();

  console.log(chalk.bold.cyan("🧠 MCP Dev Memory"));
  console.log(chalk.gray("Local developer memory\n"));

  program
    .name("mcp-dev-memory")
    .description("Local developer memory for AI agents and humans")
    .version("0.1.0");

  program
    .command("cli")
    .description("Start interactive CLI")
    .action(async () => {
      await interactiveCli(deps);
    });

  await program.parseAsync(process.argv);
};
