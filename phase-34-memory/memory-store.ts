import fs from "fs";
import path from "path";

const DATA = path.resolve(".alive-data");

function ensureDataDir() {
  if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });
}

export function readJSON<T>(file: string): T {
  ensureDataDir();
  return JSON.parse(fs.readFileSync(path.join(DATA, file), "utf-8"));
}

export function writeJSON<T>(file: string, data: T) {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA, file), JSON.stringify(data, null, 2));
}

export function appendLog(line: object) {
  ensureDataDir();
  fs.appendFileSync(
    path.join(DATA, "log.jsonl"),
    JSON.stringify(line) + "\n"
  );
}

export function appendJSONL(file: string, line: object) {
  ensureDataDir();
  fs.appendFileSync(path.join(DATA, file), JSON.stringify(line) + "\n");
}
