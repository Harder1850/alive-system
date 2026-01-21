import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { fetch } from "@tauri-apps/plugin-http";

const term = new Terminal({
  cursorBlink: true,
  fontFamily: "monospace",
  fontSize: 14,
  theme: {
    background: "#000000",
    foreground: "#d0ffd0",
  },
});

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

const container = document.getElementById("terminal");
if (!container) throw new Error("Terminal container missing");

term.open(container);
fitAddon.fit();

term.writeln("ALIVE UI — ready.");
term.write("> ");

let buffer = "";

term.onData((data) => {
  if (data === "\r") {
    term.writeln("");
    const input = buffer;
    buffer = "";

    fetch("http://127.0.0.1:7331/input", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        type: "Json",
        payload: {
          input,
          source: "ui",
          timestamp: new Date().toISOString(),
        },
      },
    })
      .then((res) => res.text())
      .then((text) => {
        const data = JSON.parse(text);
        term.writeln(data.output ?? String(text));
        term.write("> ");
      })
      .catch((err) => {
        term.writeln(`[debug] ${String(err)}`);
        console.error(err);
        term.writeln("[error] UI bridge unavailable");
        term.write("> ");
      });
  } else if (data === "\u007f") {
    buffer = buffer.slice(0, -1);
  } else {
    buffer += data;
    term.write(data);
  }
});
