// alive-system/ui-bridge/server.ts

import http from "http";

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
  if (req.method !== "POST" || req.url !== "/input") {
    res.statusCode = 404;
    return res.end();
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    try {
      const parsed = JSON.parse(body) as any;

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
    } catch {
      res.statusCode = 400;
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
