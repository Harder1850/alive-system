import { v4 as uuid } from "uuid";
import { readJSON, writeJSON, appendLog } from "./memory-store.ts";
import type { MemoryItem, WorkingMemory } from "./memory-types.ts";

export function addMemory(item: Omit<MemoryItem, "id" | "ts">) {
  const id = uuid();
  const ts = new Date().toISOString();

  const entry: MemoryItem = { id, ts, ...item };

  appendLog({
    ts,
    type: item.kind,
    project: item.project ?? null,
    id,
  });

  const working = readJSON<WorkingMemory>("working.json");
  working.recent_items.unshift(id);
  working.last_updated = ts;

  writeJSON("working.json", working);

  return entry;
}
