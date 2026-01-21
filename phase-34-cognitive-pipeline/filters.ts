import { IngestItem } from "./types.js";

const seenHashes = new Set<string>();

function stableHash(input: string): string {
  // Simple deterministic string hash (FNV-1a 32-bit) to avoid Node typings.
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

function normalize(content: string): string {
  return content.trim().toLowerCase();
}

function isTrivialAcknowledgement(content: string): boolean {
  const c = normalize(content);
  return (
    c === "ok" ||
    c === "okay" ||
    c === "k" ||
    c === "thanks" ||
    c === "thank you" ||
    c === "thx" ||
    c === "got it" ||
    c === "sure" ||
    c === "sounds good" ||
    c === "done" ||
    c === "cool"
  );
}

/**
 * Returns true if the item should proceed into routing.
 * Returns false if the item should be discarded immediately.
 */
export function preFilter(item: IngestItem): boolean {
  const content = (item.content ?? "").trim();

  // Reject empty or trivial content
  if (content.length === 0) return false;
  if (content.length < 3) return false;
  if (isTrivialAcknowledgement(content)) return false;

  // Reject duplicates by hash (in-process only)
  const hash = stableHash(normalize(content));
  if (seenHashes.has(hash)) return false;
  seenHashes.add(hash);

  return true;
}
