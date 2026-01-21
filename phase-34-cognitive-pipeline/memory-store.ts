import fs from "node:fs";
import path from "node:path";
import { MemoryEntry } from "./types.js";

const MEMORY_PATH = path.join(process.cwd(), ".alive-data", "memory.json");
const MAX_ENTRIES = 100;

export function loadMemory(): MemoryEntry[] {
  if (!fs.existsSync(MEMORY_PATH)) {
    throw new Error("Memory store missing: .alive-data/memory.json");
  }

  const raw = fs.readFileSync(MEMORY_PATH, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid memory store: expected JSON array");
  }
  return parsed as MemoryEntry[];
}

export function saveMemory(entries: MemoryEntry[]): void {
  if (!fs.existsSync(path.dirname(MEMORY_PATH))) {
    throw new Error("Memory root missing: .alive-data");
  }

  fs.writeFileSync(MEMORY_PATH, JSON.stringify(entries, null, 2), "utf8");
}

export function addToMemory(entry: MemoryEntry): void {
  const current = loadMemory();
  const next = [...current, entry];

  // Evict oldest if over cap.
  const trimmed = next.length > MAX_ENTRIES ? next.slice(next.length - MAX_ENTRIES) : next;
  saveMemory(trimmed);
}
