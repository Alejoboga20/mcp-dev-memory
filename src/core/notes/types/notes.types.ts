export type NoteRow = {
  id: number;
  project: string;
  type: Note["type"];
  name: string;
  content: string;
  tags: string | null;
  metadata: string | null;
  created_at: string;
  updated_at: string;
};

export type NoteType =
  | "model"
  | "endpoint"
  | "contract"
  | "decision"
  | "command"
  | "bugfix"
  | "other";

export type CreateNoteInput = {
  project: string;
  type: NoteType;
  name: string;
  content: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

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
