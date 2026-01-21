# Phase 34 — File-Backed Memory (Working + Long-Term)

This phase adds a **local, inspectable, deterministic** memory layer for Alive.

## Directories

### `.alive-data/` (active memory)

Working + short-term memory.

- `working.json` — current working state (focus, recent ids)
- `log.jsonl` — append-only event log (one JSON object per line)
- `index.json` — existing index file; Phase 34 code does **not** depend on it

### `.alive-archive/` (long-term memory)

Long-term reference library. Content is **only added when explicitly instructed**.

Archive is references, not copies. Keep pointers/summaries, not bloat.

## Mental model

- **Working memory ≠ archive**
- Working memory changes as your focus changes.
- Archive persists unless you delete it yourself.
- Alive “forgets” by losing focus, not by deleting your files.

