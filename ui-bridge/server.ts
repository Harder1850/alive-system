// alive-system/ui-bridge/server.ts

import express from "express";
import bodyParser from "body-parser";
import { handleMemory } from "./memory.ts";
import { routeInput } from "../phase-35-intent/intent-router.ts";
import { summarizeLocalKnowledge } from "../phase-34-memory/query.ts";
import { existsSync } from "fs";
import path from "path";

// ---- CONFIG ----
const PORT = 7331;

// ---- PLACEHOLDER HANDLER ----
// Replace ONLY the body of handleInput() later
// with the existing ALIVE text processing entrypoint.
// Do NOT add memory writes or execution hooks here.
function handleInput(text: string): string {
  // TEMP behavior: echo with a prefix so wiring is visible
  return `ALIVE heard: ${text}`;
}

const app = express();

// Accept JSON payloads
app.use(bodyParser.json());

// ---- /input ----
app.post("/input", (req, res) => {
  const parsed = req.body as any;

  if (typeof parsed?.input !== "string" || parsed?.source !== "ui") {
    res.status(400).send("Invalid payload");
    return;
  }

  const outputText = handleInput(parsed.input);

  res.json({
    output: outputText,
    type: "text",
    timestamp: new Date().toISOString(),
  });
});

// ---- /memory ----
app.post("/memory", (req, res) => {
  try {
    const entry = handleMemory(req.body as any);
    res.json({
      ok: true,
      id: entry.id,
      ts: entry.ts,
    });
  } catch (err) {
    res.status(400).json({ ok: false, error: "Malformed JSON", detail: String(err) });
  }
});

// ---- /intent ----
app.post("/intent", (req, res) => {
  const { input } = req.body as any;

  if (typeof input !== "string") {
    res.status(400).json({ ok: false, error: "input must be a string" });
    return;
  }

  const result = routeInput(input);

  // If this is a read-only memory query, answer locally from user-owned files.
  if (result?.intent?.intent === "memory_query") {
    // Guardrail: memory_query must remain local-only.
    // - MUST NOT browse / call host-cli tools
    // - MUST NOT write to .alive-data/library/*.md
    // - MAY read .alive-data/library/*.md and .alive-data/memory.jsonl

    const libDir = path.resolve(".alive-data", "library");
    if (!existsSync(libDir)) {
      console.warn("[guardrail] .alive-data/library missing; returning empty local answer");
    }

    const topic = String(result.intent.args?.topic ?? "").trim();
    const answer = topic
      ? summarizeLocalKnowledge(topic)
      : "What topic should I search your local notes for?";

    res.json({
      ...result,
      answer,
    });
    return;
  }

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`[ui-bridge] listening on http://localhost:${PORT}`);
});
