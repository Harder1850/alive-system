import fs from "fs";
import path from "path";

export type ReferenceCategory =
  | "math"
  | "probability"
  | "units"
  | "finance"
  | "systems"
  | "emergency";

export type ReferenceIndex = Record<string, any>;

export type Stakes = "low" | "medium" | "high";
export type Urgency = "low" | "medium" | "high";

export interface ReferenceDecision {
  consult_reference_layer: true;
  confidence_threshold: number;
  confidence: number;
  stakes: Stakes;
  urgency: Urgency;
  category: ReferenceCategory;
  lookup_required: boolean;
  reason: string;
  authority?: string;
}

let cachedIndex: ReferenceIndex | null = null;

function referenceRootDir() {
  // This file lives at alive-system/reference/reference-layer.ts
  return path.resolve(path.dirname(new URL(import.meta.url).pathname), ".");
}

export function loadReferenceIndex(): ReferenceIndex {
  if (cachedIndex) return cachedIndex;

  const indexPath = path.join(referenceRootDir(), "index.json");
  const raw = fs.readFileSync(indexPath, "utf-8");
  cachedIndex = JSON.parse(raw);
  return cachedIndex as ReferenceIndex;
}

export function decideReferenceAction(params: {
  category: ReferenceCategory;
  confidence: number;
  stakes: Stakes;
  urgency: Urgency;
}): ReferenceDecision {
  const { category, confidence, stakes, urgency } = params;
  const index = loadReferenceIndex();

  // Simple, explicit thresholds: higher stakes/urgency demands higher confidence to avoid lookup.
  const confidence_threshold =
    stakes === "high" || urgency === "high" ? 0.9 : stakes === "medium" ? 0.75 : 0.6;

  const categoryIndex = index[category] || {};

  const authority =
    stakes === "high"
      ? (categoryIndex.primary && categoryIndex.primary[0]) ||
        (categoryIndex.authoritative && categoryIndex.authoritative[0])
      : (categoryIndex.authoritative && categoryIndex.authoritative[0]) ||
        (categoryIndex.fast && categoryIndex.fast[0]) ||
        (categoryIndex.calculator && categoryIndex.calculator[0]) ||
        (categoryIndex.frameworks && categoryIndex.frameworks[0]);

  const lookup_required = confidence < confidence_threshold;

  const reason = lookup_required
    ? `low confidence (${confidence.toFixed(2)}) vs threshold (${confidence_threshold.toFixed(
        2
      )}), ${stakes} stakes, ${urgency} urgency`
    : `confidence (${confidence.toFixed(2)}) >= threshold (${confidence_threshold.toFixed(
        2
      )})`; // No lookup

  return {
    consult_reference_layer: true,
    confidence_threshold,
    confidence,
    stakes,
    urgency,
    category,
    lookup_required,
    reason,
    authority,
  };
}
