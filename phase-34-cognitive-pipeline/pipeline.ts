import { route } from "./router.js";
import { addToMemory } from "./memory-store.js";
import { IngestItem, MemoryEntry, PipelineDecision } from "./types.js";

export function ingest(item: IngestItem): PipelineDecision {
  const decision = route(item);

  if (decision.action === "compress") {
    const entry: MemoryEntry = {
      id: item.id,
      summary: decision.summary,
      references: decision.references,
      project: item.context?.project,
      created_at: new Date().toISOString(),
    };
    addToMemory(entry);
  }

  // If archived, routing already persisted the archive.
  // If discarded, nothing is persisted.
  return decision;
}
