import fs from "fs";
import path from "path";

const DATA = path.resolve(".alive-data");
const LIBRARY_DIR = path.join(DATA, "library");

export type LibraryDoc = {
  name: string;
  path: string;
  content: string;
};

export function listLibraryDocs(): string[] {
  if (!fs.existsSync(LIBRARY_DIR)) return [];
  return fs
    .readdirSync(LIBRARY_DIR)
    .filter((f) => f.toLowerCase().endsWith(".md"));
}

export function readLibraryDocs(): LibraryDoc[] {
  const files = listLibraryDocs();

  return files.map((name) => {
    const p = path.join(LIBRARY_DIR, name);
    return {
      name,
      path: p,
      content: fs.readFileSync(p, "utf-8"),
    };
  });
}

