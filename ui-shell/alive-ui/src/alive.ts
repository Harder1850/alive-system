window.addEventListener("alive:input", (e: any) => {
  const text = e.detail;

  const response = `[alive] heard: "${text}"`;

  window.dispatchEvent(
    new CustomEvent("alive:output", {
      detail: response,
    })
  );
});

