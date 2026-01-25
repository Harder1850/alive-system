import { preFilter } from "./filters.js";
import { compress } from "./compressor.js";
import { archive } from "./archive.js";
import { IngestItem, PipelineDecision } from "./types.js";

const ARCHIVE_THRESHOLD = 2000;

export function route(item: IngestItem): PipelineDecision {
  if (!preFilter(item)) {
    return { action: "discard", reason: "preFilter rejected item" };
  }

  if (item.content.length > ARCHIVE_THRESHOLD) {
    const p = archive(item);
    return { action: "archive", path: p };
  }

  const { summary, references } = compress(item);
  return { action: "compress", summary, references };
}
