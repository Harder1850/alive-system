// alive-system/ui-bridge/server.ts

import http from "http";
import { handleMemory } from "./memory.ts";

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

// ---- SERVER ----
const server = http.createServer((req, res) => {
  if (req.method !== "POST" || (req.url !== "/input" && req.url !== "/memory")) {
    res.statusCode = 404;
    return res.end();
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    try {
      let parsed: any;
      try {
        parsed = JSON.parse(body);
      } catch {
        // Some clients may send JSON with extra wrapping quotes (esp. on Windows shells).
        // Attempt one more parse pass after unwrapping.
        const unwrapped = typeof body === "string" ? body.trim() : "";
        if (unwrapped.startsWith('"') && unwrapped.endsWith('"')) {
          parsed = JSON.parse(JSON.parse(unwrapped));
        } else {
          throw new Error("Malformed JSON");
        }
      }

      if (req.url === "/memory") {
        const entry = handleMemory(parsed);
        res.setHeader("Content-Type", "application/json");
        return res.end(
          JSON.stringify({
            ok: true,
            id: entry.id,
            ts: entry.ts,
          })
        );
      }

      if (typeof parsed.input !== "string" || parsed.source !== "ui") {
        res.statusCode = 400;
        return res.end("Invalid payload");
      }

      const outputText = handleInput(parsed.input);

      const response = {
        output: outputText,
        type: "text",
        timestamp: new Date().toISOString(),
      };

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response));
    } catch (err) {
      res.statusCode = 400;

      if (req.url === "/memory") {
        res.setHeader("Content-Type", "application/json");
        return res.end(
          JSON.stringify({ ok: false, error: "Malformed JSON", detail: String(err) })
        );
      }

      const response = {
        output: "Malformed JSON",
        type: "text",
        timestamp: new Date().toISOString(),
      };

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response));
    }
  });
});

server.listen(PORT, () => {
  console.log(`[ui-bridge] listening on http://localhost:${PORT}`);
});
