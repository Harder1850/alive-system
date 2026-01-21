import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import "./alive";

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

term.onData((data) => {
  if (data === "\r") {
    term.write("\r\n");
    window.dispatchEvent(
      new CustomEvent("alive:input", {
        detail: inputBuffer,
      })
    );
    inputBuffer = "";
    term.write("> ");
  } else if (data === "\u007f") {
    // backspace
    if (inputBuffer.length > 0) {
      inputBuffer = inputBuffer.slice(0, -1);
      term.write("\b \b");
    }
  } else {
    inputBuffer += data;
    term.write(data);
  }
});

let inputBuffer = "";

term.write("> ");

window.addEventListener("alive:output", (e: any) => {
  term.write("\r\n" + e.detail + "\r\n> ");
});
