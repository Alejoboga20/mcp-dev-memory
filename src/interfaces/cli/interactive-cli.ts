import { select } from "@inquirer/prompts";
import { NotesService } from "@/application/notes/notes.service";
import chalk from "chalk";

type InteractiveCliDeps = {
  notesService: NotesService;
};

export const interactiveCli = async (deps: InteractiveCliDeps) => {
  let running = true;

  while (running) {
    const action = await select({
      message: "What do you want to do?",
      choices: [
        { name: "Find notes", value: "find" },
        { name: "Save note", value: "save" },
        { name: "Exit", value: "exit" },
      ],
    });

    if (action === "exit") {
      running = false;
    }

    if (action === "find") {
      const notes = await deps.notesService.findNotes({
        isActive: true,
      });

      if (notes.length === 0) {
        console.log(`\n${chalk.yellow("⚠ No active notes were found.")}\n`);
        continue;
      }

      const selectedId = await select({
        message: "Select a note",
        choices: notes.map((note) => ({
          name: `[${note.id}] ${note.type} | ${note.name}`,
          value: note.id,
        })),
      });

      const noteAction = await select({
        message: `What do you want to do with note ${selectedId}?`,
        choices: [
          { name: "View note", value: "view" },
          { name: "Deprecate note", value: "deprecate" },
          { name: "Back", value: "back" },
        ],
      });

      if (noteAction === "back") {
        continue;
      }

      if (noteAction === "deprecate") {
        const deprecatedNote = await deps.notesService.deprecateNote({
          noteId: selectedId,
        });

        console.log("");

        console.log(chalk.green("✔ Note deprecated successfully"));

        console.log(`${chalk.gray("ID:")} ${deprecatedNote.id}`);

        console.log(`${chalk.gray("Name:")} ${deprecatedNote.name}`);

        console.log("");

        continue;
      }

      if (noteAction === "view") {
        const note = notes.find((n) => n.id === selectedId)!;

        console.log("");

        console.log(
          chalk.cyan.bold("════════════════════════════════════════════"),
        );
        console.log(chalk.bold.white(note.name));
        console.log(
          chalk.cyan.bold("════════════════════════════════════════════"),
        );

        console.log(`${chalk.gray("ID:")}       ${note.id}`);
        console.log(`${chalk.gray("Type:")}     ${chalk.cyan(note.type)}`);
        console.log(`${chalk.gray("Project:")}  ${chalk.green(note.project)}`);
        console.log(
          `${chalk.gray("Tags:")}     ${
            note.tags.length
              ? chalk.yellow(note.tags.join(", "))
              : chalk.gray("-")
          }`,
        );

        console.log("");

        console.log(chalk.bold("Content"));
        console.log(chalk.gray("-------"));
        console.log(note.content);

        console.log("");
      }
    }
  }
};
