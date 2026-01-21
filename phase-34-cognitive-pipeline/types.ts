export interface IngestItem {
  id: string;
  source: "chat" | "doc" | "web" | "manual";
  content: string;
  timestamp: string;
  context?: {
    project?: string;
    tags?: string[];
  };
}

export type PipelineDecision =
  | { action: "discard"; reason: string }
  | { action: "compress"; summary: string; references: string[] }
  | { action: "archive"; path: string };

export interface MemoryEntry {
  id: string;
  summary: string;
  references: string[];
  project?: string;
  created_at: string;
}

