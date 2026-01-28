npm# Phase 28 — Cross-Run Legal Memory Demonstration (Read-Only)

Directive: **PHASE-28-LEGAL-MEMORY-DEMO**

This is a reproducible, documentation-only demo.

**ALIVE does not reason about law.
It records primary legal materials as immutable experience and refuses to hallucinate.**

## Goal

Prove, without adding intelligence or autonomy, that two **independent** runs on the same machine:

1. record primary legal materials as experience
2. persist that experience across restarts
3. accumulate experience append-only (no overwrites)

## Preconditions

- You have already implemented the read-only legal sensor in `alive-body`:
  - output event type: `sense.legal.readonly` (or `sense.legal.readonly.error`)
- You will run everything in **finite demo mode** (one run → exit).

## Choose a shared data directory

Pick a directory that both runs will write to:

```powershell
$env:ALIVE_DATA_DIR = "$PWD\.alive-data"
```

This ensures both runs append into the same `events.jsonl`.

## Run 1 — Statute (ICWA)

Set a single host-provided legal query (explicit URL list; no search):

```powershell
$env:ALIVE_LEGAL_QUERY_JSON = '{
  "type": "legal.query",
  "jurisdiction": "US-Federal",
  "sources": [
    "https://www.law.cornell.edu/uscode/text/25/chapter-21"
  ],
  "query_context": "Indian Child Welfare Act jurisdiction",
  "requested_documents": ["statute"]
}'

cd ..\alive-system
npm start
```

Expected:

- exactly one legal sensor observation is emitted (success or error)
- process exits cleanly

## Run 2 — Case Opinion (ICWA / Holyfield)

Set a second host-provided query (explicit URL list; no expansion):

```powershell
$env:ALIVE_LEGAL_QUERY_JSON = '{
  "type": "legal.query",
  "jurisdiction": "US-Federal",
  "sources": [
    "https://supreme.justia.com/cases/federal/us/490/30/"
  ],
  "query_context": "ICWA case opinion (Holyfield)",
  "requested_documents": ["case_opinion"]
}'

cd ..\alive-system
npm start
```

Expected:

- exactly one legal sensor observation is emitted (success or error)
- process exits cleanly

## Verification — Append-only accumulation

Locate the experience log:

```powershell
Get-ChildItem $env:ALIVE_DATA_DIR
```

Inspect `events.jsonl` and confirm:

- the file **grew** between Run 1 and Run 2 (line count increased)
- both runs’ legal observations exist
- timestamps differ
- provenance (URL) is preserved
- nothing is overwritten or reordered

Example audit commands:

```powershell
Get-Content "$env:ALIVE_DATA_DIR\events.jsonl" | Select-String "sense.legal.readonly"
Get-Content "$env:ALIVE_DATA_DIR\events.jsonl" | Select-String "sense.legal.readonly.error"
```

This phase is proof, not capability expansion.

