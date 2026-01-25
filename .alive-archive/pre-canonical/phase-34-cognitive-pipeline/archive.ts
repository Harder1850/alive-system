import fs from "node:fs";
import path from "node:path";
import { IngestItem } from "./types.js";

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

export function archive(item: IngestItem): string {
  const root = path.join(process.cwd(), "..", ".alive-archive");

  if (!fs.existsSync(root)) {
    throw new Error("Archive root missing: .alive-archive");
  }

  const project = item.context?.project?.trim();
  const dirName = project && project.length > 0 ? project : "general";
  const dir = path.join(root, dirName);
  ensureDir(dir);

  const filePath = path.join(dir, `${item.id}.json`);

  // One file per item. Overwrite is not allowed.
  if (fs.existsSync(filePath)) {
    throw new Error(`Archive collision: ${filePath}`);
  }

  fs.writeFileSync(filePath, JSON.stringify(item, null, 2), "utf8");

  return filePath;
}
