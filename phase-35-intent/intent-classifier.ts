import type { Intent } from "./intent-types.ts";
import { categorizeReferenceNeed } from "../reference/categorize.ts";
import { decideReferenceAction } from "../reference/reference-layer.ts";
import { scienceFrame } from "../science/science-framing.ts";

export function classifyIntent(input: string): Intent {
  const text = input.toLowerCase().trim();

  // Science framing is offline-first intuition (NOT authority).
  // It is attached as metadata for upstream layers to shape urgency/verbosity.
  const science = scienceFrame(input);

  // Read-only memory queries
  if (text.startsWith("what do i already know about ")) {
    return {
      intent: "memory_query",
      confidence: 0.9,
      raw: input,
      args: {
        topic: input.slice("what do i already know about ".length).trim(),
      },
    };
  }

  if (text.startsWith("summarize my notes on ")) {
    return {
      intent: "memory_query",
      confidence: 0.9,
      raw: input,
      args: {
        topic: input.slice("summarize my notes on ".length).trim(),
      },
    };
  }

  // Explicit "ask before browsing" flow (no browsing performed here)
  if (
    text.startsWith("look up ") ||
    text.startsWith("lookup ") ||
    text.startsWith("search online") ||
    text.startsWith("browse ")
  ) {
    const { category, stakes, urgency } = categorizeReferenceNeed(input);
    const decision = decideReferenceAction({
      category,
      stakes,
      urgency,
      confidence: 0.2,
    });

    return {
      intent: "lookup_required",
      confidence: 0.85,
      raw: input,
      needs_clarification: true,
      clarification_question:
        `[intent] lookup_required (${decision.reason})\n` +
        `[reference] ${decision.authority || "(no authority indexed)"} identified as authoritative source\n` +
        `[science] ${science.hint}\n` +
        "Do you want me to look this up?",
      args: {
        reference: decision,
        science,
      },
    };
  }

  if (text.startsWith("remember") || text.includes("save this")) {
    return {
      intent: "memory_write",
      confidence: 0.9,
      raw: input,
      args: {
        content: input.replace(/^remember\s*/i, ""),
      },
    };
  }

  if (text.includes("reference") || text.includes("cite")) {
    return {
      intent: "memory_ref",
      confidence: 0.85,
      raw: input,
    };
  }

  if (text.includes("file") || text.includes("document")) {
    return {
      intent: "file_request",
      confidence: 0.7,
      raw: input,
      needs_clarification: true,
      clarification_question:
        "Do you want me to open it, summarize it, or store it as a reference?",
    };
  }

  if (text.startsWith("what") || text.startsWith("how") || text.startsWith("can")) {
    return {
      intent: "query",
      confidence: 0.8,
      raw: input,
      args: {
        science,
      },
    };
  }

  return {
    intent: "unknown",
    confidence: 0.3,
    raw: input,
    needs_clarification: true,
    clarification_question: "What would you like me to do with this?",
    args: {
      science,
    },
  };
}
