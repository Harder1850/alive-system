import { IngestItem } from "./types.js";

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function stripFiller(s: string): string {
  // Remove some common filler patterns deterministically.
  return s
    .replace(/\b(please|just|actually|basically|kind of|sort of)\b/gi, "")
    .replace(/\b(i think|i believe|in my opinion)\b/gi, "")
    .replace(/\b(for example|e\.g\.|example:)\b/gi, "")
    .replace(/\b(thanks|thank you)\b/gi, "")
    .replace(/\s+/g, " ");
}

function takeFirstSentences(s: string, maxChars: number): string {
  const cleaned = normalizeWhitespace(s);
  if (cleaned.length <= maxChars) return cleaned;

  // Split on sentence-ish boundaries.
  const parts = cleaned.split(/(?<=[\.!\?])\s+/);
  let out = "";
  for (const p of parts) {
    if (!p) continue;
    const next = out.length === 0 ? p : out + " " + p;
    if (next.length > maxChars) break;
    out = next;
  }

  if (out.length === 0) {
    return cleaned.slice(0, maxChars).trim();
  }
  return out.trim();
}

export function compress(
  item: IngestItem
): { summary: string; references: string[] } {
  // First-order meaning: keep the core statement, not details.
  const base = stripFiller(item.content);
  const summary = takeFirstSentences(base, 500);

  return {
    summary,
    references: [item.id],
  };
}
