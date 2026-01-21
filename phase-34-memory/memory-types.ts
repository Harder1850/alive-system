export type MemoryItem = {
  id: string;
  ts: string;
  kind: "note" | "ref" | "summary";
  project?: string;
  topic?: string;
  source?: string;
  content: string;
};

export type WorkingMemory = {
  active_projects: string[];
  focus: string | null;
  recent_items: string[];
  last_updated: string | null;
};

