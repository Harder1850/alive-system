/**
 * alive-system/run-once.js
 *
 * Minimal orchestration layer.
 * HARD CONSTRAINTS:
 * - No loops/schedulers/retries/background autonomy.
 * - No decisions/memory inspection.
 * - Wiring/sequencing ONLY: Host -> Body -> Brain (via Body's firewall) once.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { startBody } from "../alive-body/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadConfig() {
  const configPath = path.join(__dirname, "configs", "demo.config.json");
  const raw = fs.readFileSync(configPath, "utf8");
  return JSON.parse(raw);
}

console.log("[system] alive-system v0 starting (one-shot orchestration)");

const config = loadConfig();

// Host output (single observation) -> Body input.
// NOTE: We intentionally do not import or run alive-host-cli here because it is a CLI
// that waits for stdin; alive-system provides the single observation directly.
const observation = {
  type: "host.stdin",
  payload: config?.demo?.input ?? "hello",
  timestamp: new Date().toISOString(),
};

await startBody({ observation });

console.log("[system] alive-system v0 shutdown (clean exit)");
