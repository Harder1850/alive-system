import readline from "readline";
import fs from "fs";
import path from "path";
import { ingestAdapter } from "./ingestAdapter.js";
import { respond } from "./respond.js";

const DATA_DIR = path.resolve(".alive-data");
const MEMORY_PATH = path.join(DATA_DIR, "memory.json");

if (!fs.existsSync(MEMORY_PATH)) {
  fs.writeFileSync(MEMORY_PATH, "[]");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "ALIVE> ",
});

console.log("ALIVE is listening. Type 'exit' to quit.\n");
rl.prompt();

rl.on("line", (line) => {
  const input = line.trim();
  if (input.toLowerCase() === "exit") {
    rl.close();
    return;
  }

  const entry = ingestAdapter(input);
  const memory = JSON.parse(fs.readFileSync(MEMORY_PATH, "utf-8"));

  memory.push(entry);
  fs.writeFileSync(MEMORY_PATH, JSON.stringify(memory, null, 2));

  const output = respond(input);
  console.log(output + "\n");

  rl.prompt();
});

