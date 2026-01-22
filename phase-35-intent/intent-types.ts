export type IntentType =
  | "memory_write"
  | "memory_ref"
  | "memory_query"
  | "lookup_required"
  | "file_request"
  | "query"
  | "unknown";

export interface Intent {
  intent: IntentType;
  confidence: number; // 0.0 – 1.0
  raw: string;
  args?: Record<string, any>;
  needs_clarification?: boolean;
  clarification_question?: string;
}
