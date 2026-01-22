import { classifyIntent } from "./intent-classifier.ts";

export function routeInput(input: string) {
  const intent = classifyIntent(input);

  return {
    ok: true,
    intent,
    message: intent.needs_clarification
      ? intent.clarification_question
      : "Intent recognized.",
  };
}
