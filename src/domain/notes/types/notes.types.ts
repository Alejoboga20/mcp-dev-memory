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
