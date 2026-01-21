# Phase 34 — File-Backed Memory Guardrails

This phase implements **local, inspectable, deterministic memory** backed by files.

## Hard rules

- ❌ No background tasks
- ❌ No scanning directories
- ❌ No deleting memory
- ❌ No re-writing archives
- ❌ No inference, tagging, or ranking

## Write policy

- Alive only writes memory when **explicitly instructed** by the user.
- `.alive-data/` is working/short-term memory (active + recent + append-only log).
- `.alive-archive/` is long-term library storage. **Nothing here is auto-deleted.**

## Reset / reversibility

- Deleting `.alive-data/` resets working memory.
- Deleting `.alive-archive/` destroys the library.
- No hidden state exists elsewhere.

## Legacy files

This phase is **additive**. Older files in `.alive-data/` (e.g. `context.json`, `memory.json`) are treated as **legacy/parallel**, not canonical.

