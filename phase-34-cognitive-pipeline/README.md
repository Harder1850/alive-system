# Phase 34 — Deterministic Cognitive Pipeline (Discard / Compress / Archive)

## Purpose

Phase 34 provides deterministic cognitive plumbing for ALIVE.
It routes every incoming item into **one and only one** of three outcomes:

- **Discard** (noise rejected early)
- **Compressed Memory** (finite, lossy, cognitive footprint)
- **Archive** (cold storage, recoverable, non-cognitive)

This is cognitive infrastructure, not intelligence.

## Pipeline Law (Discard / Compress / Archive)

For every `IngestItem`, the pipeline must choose exactly one action:

1. **discard** — the item is rejected (with a reason)
2. **compress** — the item is reduced to a short summary and written to finite memory
3. **archive** — the full item is written to cold storage as JSON

Nothing disappears silently.

## Finite cognition

Compressed memory is capped (v0: **100 entries**).
When the cap is exceeded, the oldest entries are evicted.

## Archive ≠ memory

The archive is **not** part of cognition.
Phase 34 never auto-reads archives.
Archives exist only for recoverability and audit.

## Data locations

At the repo root (data-only):

- `.alive-data/memory.json` — compressed, finite memory store
- `.alive-data/index.json` — reference index (reserved)
- `.alive-archive/` — cold storage (one JSON file per archived item)

Note: this phase is not wired into the runtime. If you run it manually, run from
the `alive-system` repo root (or set `cwd`) so `.alive-data/` and `.alive-archive/`
resolve correctly.

## Removal safety

Deleting `phase-34-cognitive-pipeline/` must have **zero runtime effect**.
This phase is not wired into the system.

## Explicit non-goals

- No autonomy
- No execution
- No background tasks (no timers, listeners, watchers)
- No inference / scoring
- No archive auto-recall
