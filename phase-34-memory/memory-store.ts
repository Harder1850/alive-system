import fs from "fs";
import path from "path";

const DATA = path.resolve(".alive-data");

export function readJSON<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(DATA, file), "utf-8"));
}

export function writeJSON<T>(file: string, data: T) {
  fs.writeFileSync(path.join(DATA, file), JSON.stringify(data, null, 2));
}

export function appendLog(line: object) {
  fs.appendFileSync(
    path.join(DATA, "log.jsonl"),
    JSON.stringify(line) + "\n"
  );
}

