export type DecisionMode = "emergency" | "urgent" | "tactical" | "strategic";

export interface ScienceFraming {
  mode: DecisionMode;
  // A short framing hint, not an authority claim.
  hint: string;
  // Guidance to upstream layers about output shape.
  verbosity: "minimal" | "short" | "normal";
  certainty_style: "probabilistic" | "bounded" | "high-level";
  lookup_required: boolean;
  lookup_reason?: string;
}

export function inferDecisionMode(input: string): DecisionMode {
  const text = input.toLowerCase();

  if (
    text.includes("emergency") ||
    text.includes("right now") ||
    text.includes("immediately") ||
    text.includes("seconds") ||
    text.includes("bleeding") ||
    text.includes("fire")
  ) {
    return "emergency";
  }

  if (text.includes("urgent") || text.includes("< 1 hour") || text.includes("today") || text.includes("asap")) {
    return "urgent";
  }

  if (text.includes("this week") || text.includes("days") || text.includes("policy") || text.includes("investment")) {
    return "strategic";
  }

  return "tactical";
}

export function scienceFrame(input: string): ScienceFraming {
  const mode = inferDecisionMode(input);
  const text = input.toLowerCase();

  // Hard boundary triggers
  const liability =
    text.includes("dosage") ||
    text.includes("prescribe") ||
    text.includes("protocol") ||
    text.includes("medical") ||
    text.includes("diagnose") ||
    text.includes("standard") ||
    text.includes("spec") ||
    text.includes("code compliance");

  if (liability) {
    return {
      mode,
      hint: "high liability: defer to professionals and primary references",
      verbosity: mode === "emergency" ? "minimal" : "short",
      certainty_style: "bounded",
      lookup_required: true,
      lookup_reason: "precision or liability-sensitive domain (protocols/specs/medical)"
    };
  }

  const reversibility = text.includes("irreversible") || text.includes("can't undo") || text.includes("one-way");
  const energyCost = text.includes("heavy") || text.includes("ship") || text.includes("battery") || text.includes("fuel");
  const safety = text.includes("safety") || text.includes("hazard") || text.includes("risk");

  const hintParts: string[] = [];
  if (energyCost) hintParts.push("high energy cost");
  if (reversibility) hintParts.push("low reversibility");
  if (safety) hintParts.push("tight safety margins");
  if (hintParts.length === 0) hintParts.push("constraint-first framing");

  return {
    mode,
    hint: hintParts.join(", "),
    verbosity: mode === "emergency" ? "minimal" : mode === "urgent" ? "short" : "normal",
    certainty_style: mode === "strategic" ? "high-level" : "bounded",
    lookup_required: false,
  };
}

