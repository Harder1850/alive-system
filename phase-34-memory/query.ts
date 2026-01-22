import fs from "fs";
import path from "path";
import { readLibraryDocs } from "./library.ts";

const DATA = path.resolve(".alive-data");

export type KnowledgeHit = {
  source: "library" | "memory";
  ref: string;
  snippet: string;
};

function safeIncludes(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function queryLocalKnowledge(topic: string): KnowledgeHit[] {
  const q = topic.trim();
  if (!q) return [];

  const hits: KnowledgeHit[] = [];

  // 1) library/*.md (user-owned, read-only)
  for (const doc of readLibraryDocs()) {
    if (safeIncludes(doc.content, q)) {
      hits.push({
        source: "library",
        ref: doc.name,
        snippet: doc.content,
      });
    }
  }

  // 2) memory.jsonl (append-only)
  const memPath = path.join(DATA, "memory.jsonl");
  if (fs.existsSync(memPath)) {
    const lines = fs
      .readFileSync(memPath, "utf-8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      try {
        const obj: any = JSON.parse(line);
        const content = String(obj?.content ?? "");
        const source = String(obj?.source ?? "");
        const project = obj?.project ? String(obj.project) : "";
        const haystack = [content, source, project].filter(Boolean).join("\n");
        if (safeIncludes(haystack, q)) {
          hits.push({
            source: "memory",
            ref: String(obj?.id ?? "(no-id)"),
            snippet: haystack,
          });
        }
      } catch {
        // ignore bad lines
      }
    }
  }

  return hits;
}

export function summarizeLocalKnowledge(topic: string): string {
  const hits = queryLocalKnowledge(topic);
  if (hits.length === 0) return `I don't see anything in your local library or memory about: ${topic}`;

  const lines: string[] = [];
  lines.push(`Here's what I found locally for: ${topic}`);
  lines.push("");

  for (const h of hits.slice(0, 5)) {
    const preview = h.snippet.trim().slice(0, 300);
    lines.push(`- [${h.source}] ${h.ref}: ${preview}${h.snippet.length > 300 ? "…" : ""}`);
  }

  if (hits.length > 5) lines.push(`\n(+${hits.length - 5} more matches)`);
  return lines.join("\n");
}

