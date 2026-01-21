window.addEventListener("alive:input", (e: any) => {
  const text = String(e.detail ?? "").trim();

  // Debug helper: expose fetch errors in the terminal output.
  const bridgeError = (err: unknown) => {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(err);
    window.dispatchEvent(
      new CustomEvent("alive:output", {
        detail: `[memory] bridge unavailable (${msg})`,
      })
    );
  };

  // Commands:
  // - remember this: <text>
  // - remember ref: <source> | <summary>
  if (text.toLowerCase().startsWith("remember this:")) {
    const content = text.slice("remember this:".length).trim();
    fetch("http://127.0.0.1:7331/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "note",
        content,
      }),
    })
      .then(async (r) => {
        const txt = await r.text();
        let data: any;
        try {
          data = JSON.parse(txt);
        } catch {
          throw new Error(`Non-JSON response (${r.status}): ${txt}`);
        }

        if (!r.ok || data?.ok === false) {
          throw new Error(`HTTP ${r.status}: ${JSON.stringify(data)}`);
        }

        window.dispatchEvent(
          new CustomEvent("alive:output", {
            detail: `[memory] saved note ${data.id ?? ""}`.trim(),
          })
        );
      })
      .catch(bridgeError);
    return;
  }

  if (text.toLowerCase().startsWith("remember ref:")) {
    const payload = text.slice("remember ref:".length).trim();
    const [sourceRaw, summaryRaw] = payload.split("|");
    const source = (sourceRaw ?? "").trim();
    const content = (summaryRaw ?? "").trim();

    fetch("http://127.0.0.1:7331/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "reference",
        source,
        content,
      }),
    })
      .then(async (r) => {
        const txt = await r.text();
        let data: any;
        try {
          data = JSON.parse(txt);
        } catch {
          throw new Error(`Non-JSON response (${r.status}): ${txt}`);
        }

        if (!r.ok || data?.ok === false) {
          throw new Error(`HTTP ${r.status}: ${JSON.stringify(data)}`);
        }

        window.dispatchEvent(
          new CustomEvent("alive:output", {
            detail: `[memory] saved ref ${data.id ?? ""}`.trim(),
          })
        );
      })
      .catch(bridgeError);
    return;
  }

  // Default stub response
  window.dispatchEvent(
    new CustomEvent("alive:output", {
      detail: `[alive] heard: "${text}"`,
    })
  );
});
