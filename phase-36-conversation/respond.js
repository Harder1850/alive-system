import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(".alive-data");
const MEMORY_PATH = path.join(DATA_DIR, "memory.json");
const CONTEXT_PATH = path.join(DATA_DIR, "context.json");

export function respond(userInput) {
  const memory = JSON.parse(fs.readFileSync(MEMORY_PATH, "utf-8"));
  const context = JSON.parse(fs.readFileSync(CONTEXT_PATH, "utf-8"));

  const recent = memory
    .slice(-5)
    .map((m) => m.content)
    .join(" ");

  return `
[ALIVE — ${context.active_project}]
Focus: ${context.focus}

You said:
"${userInput}"

Recent context:
"${recent.slice(-300)}"

What would you like to explore next?
`.trim();
}

