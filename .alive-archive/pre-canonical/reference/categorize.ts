import type { ReferenceCategory, Stakes, Urgency } from "./reference-layer.ts";

export function categorizeReferenceNeed(input: string): {
  category: ReferenceCategory;
  stakes: Stakes;
  urgency: Urgency;
} {
  const text = input.toLowerCase();

  // Category
  const category: ReferenceCategory =
    text.includes("convert") ||
    text.includes("unit") ||
    text.includes("mph") ||
    text.includes("km") ||
    text.includes("celsius") ||
    text.includes("fahrenheit")
      ? "units"
      : text.includes("probability") || text.includes("chance") || text.includes("bayes")
        ? "probability"
        : text.includes("apr") || text.includes("interest") || text.includes("pv")
          ? "finance"
          : text.includes("derivative") || text.includes("integral") || text.includes("calculus")
            ? "math"
            : text.includes("emergency") || text.includes("urgent") || text.includes("triage")
              ? "emergency"
              : "systems";

  // Stakes/urgency (conservative heuristics)
  const urgency: Urgency =
    text.includes("now") || text.includes("asap") || text.includes("urgent")
      ? "high"
      : "medium";

  const stakes: Stakes =
    text.includes("safety") ||
    text.includes("medical") ||
    text.includes("legal") ||
    text.includes("compliance")
      ? "high"
      : "medium";

  return { category, stakes, urgency };
}

