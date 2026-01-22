# Rapid Reference & Sanity Layer

This folder is **ALIVE’s Rapid Reference & Sanity Layer**.

## Purpose

Provide **authoritative bookmarks + decision heuristics** so ALIVE can choose the right authority under pressure **without becoming a knowledge base**.

This layer answers:

> “I don’t need theory — I need the right rule or authority now.”

## Non-negotiable rules

- **Not cognition** (no reasoning here)
- **Not memory** (no user state, no personalization)
- **Not browsing by default** (only used to decide *whether* to browse and *where*)
- **Read-only** at runtime
- **Indexed** (machine-readable `index.json`)
- **Zero writes at runtime** (no mutation, no persistence)
- **Versioned with the repo**

## Content rules

### What goes in

- Trusted sources (names only)
- One-line descriptions
- “When to use / when NOT to use”
- Decision heuristics
- Authority ranking

### What does NOT go in

- Explanations
- Tutorials
- Copied content
- Opinions
- Time-sensitive facts

This is **routing metadata**, not knowledge.

## How ALIVE uses this layer

- Consult **this layer before any internet lookup**
- If confidence ≥ threshold → **no lookup**
- If confidence < threshold → **lookup_required**
- ALIVE reports:
  - why lookup is needed
  - which authority it will consult

Example UI output:

```
[intent] lookup_required (low confidence, high stakes)
[reference] NIST identified as authoritative source
Do you want me to look this up?
```

⚠️ ALIVE never browses silently.

## Size & performance

- Total size target: **≤ 3 MB**
- Loaded at startup
- Cached in memory
- If it grows beyond this: **STOP and reassess**

## Naming guardrail

Internally refer to this as **Rapid Reference & Sanity Layer**.

Never call it:

- “knowledge base”
- “learning module”
- “memory”

## Design doctrine

“ALIVE does not try to know everything — it knows when it knows enough, and where to look when it doesn’t.”

