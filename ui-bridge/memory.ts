import { addMemory } from "../phase-34-memory/memory-api.ts";

export type MemoryRequest =
  | {
      type: "note";
      project?: string;
      content: string;
      tags?: string[];
    }
  | {
      type: "reference";
      project?: string;
      source?: string;
      content: string;
      tags?: string[];
    };

export function handleMemory(payload: MemoryRequest) {
  if (payload.type === "note") {
    return addMemory({
      kind: "note",
      project: payload.project,
      content: payload.content,
    });
  }

  return addMemory({
    kind: "ref",
    project: payload.project,
    source: payload.source,
    content: payload.content,
  });
}
