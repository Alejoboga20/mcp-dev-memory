import { Note } from "@/domain/notes/notes.entity";
import { NotesRepository } from "@/domain/notes/ports/notes.repository";
import { CreateNoteInput } from "@/domain/notes/types/notes.types";

export class CreateNoteUseCase {
  constructor(private readonly notesRepository: NotesRepository) {}

  async execute(input: CreateNoteInput): Promise<Note> {
    if (!input.project.trim()) {
      throw new Error("Project is required");
    }

    if (!input.name.trim()) {
      throw new Error("Name is required");
    }

    if (!input.content.trim()) {
      throw new Error("Content is required");
    }

    const newNote = await this.notesRepository.create({
      ...input,
      project: input.project.trim(),
      name: input.name.trim(),
      content: input.content.trim(),
      tags: input.tags ?? [],
      metadata: input.metadata ?? {},
    });

    return newNote;
  }
}
