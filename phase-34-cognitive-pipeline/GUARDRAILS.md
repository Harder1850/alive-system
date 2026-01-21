# Phase 34 Guardrails — Deterministic Cognitive Pipeline

## Non-negotiable prohibitions

- **No execution authority** (no actuators, no side effects beyond data files)
- **No background scheduling** (no timers, listeners, watchers, daemons)
- **No network calls**
- **No archive auto-recall** (archives are never read automatically)
- **No memory growth beyond cap** (v0 hard cap: 100 entries)
- **No inference / scoring / heuristics** beyond the deterministic rules in `router.ts`
- **No decision-making** beyond routing into discard/compress/archive

## Storage boundaries

Phase 34 may write only to:

- `.alive-data/` (compressed, finite memory)
- `.alive-archive/` (cold storage)

Any other filesystem mutation is forbidden.

## Removal safety

Deleting `phase-34-cognitive-pipeline/` must have **zero runtime effect**.
This phase must not be wired into any runner.

