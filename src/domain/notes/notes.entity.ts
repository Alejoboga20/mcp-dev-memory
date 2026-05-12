import type { NoteType } from "@/domain/notes/types/notes.types";

export type Note = {
  id: number;
  project: string;
  type: NoteType;
  name: string;
  content: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
