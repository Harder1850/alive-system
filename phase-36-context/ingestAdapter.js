import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(".alive-data");
const CONTEXT_PATH = path.join(DATA_DIR, "context.json");

export function ingestAdapter(input) {
  const context = JSON.parse(fs.readFileSync(CONTEXT_PATH, "utf-8"));

  return {
    id: Date.now().toString(),
    source: "chat",
    content: input,
    project: context.active_project,
    mode: context.conversation_mode,
    focus: context.focus,
    timestamp: new Date().toISOString(),
  };
}

