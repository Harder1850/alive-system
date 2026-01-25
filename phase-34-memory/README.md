# Phase 34 — Memory (File-Backed)

## Purpose
Provide deterministic, local, file-backed memory for ALIVE.

This phase introduces:
- Working memory
- Append-only logs
- Indexed references

## Data Locations
- `.alive-data/working.json` — active working memory
- `.alive-data/log.jsonl` — append-only event log
- `.alive-data/index.json` — pointers only
- `.alive-archive/` — long-term references

## Design Rules
- Memory is finite
- Entries may be pruned
- Archives are not active cognition
- Logs are append-only
- No background mutation

## Allowed Operations
- Add memory entries
- Read memory entries
- Append logs

## Forbidden
- Autonomous cleanup
- Silent mutation
- Cross-phase writes

## Notes
This phase does **not** decide relevance.
That is handled in later phases.
