# Phase 29 — Cross-Domain Experience Accumulation (Zero Intelligence)

Goal: prove ALIVE can record heterogeneous reality safely; **no intelligence**, no reasoning, no correlation.

This phase is intentionally minimal and demonstrates experience accumulation without intelligence, analysis, or execution. Any additional capability belongs to later phases.

“ALIVE does not understand domains.
It records reality as immutable experience.”

## Setup

From `c:/Users/mikeh/dev/alive-system`:

```powershell
# Use one persistent data directory for both runs
$env:ALIVE_DATA_DIR = "$PWD\\.alive-data"
```

Optional helper (runs both steps and prints the resulting log):

```powershell
cd ..\alive-system
.\demos\phase29-run.ps1
```

### Expectations

- Each run emits **exactly one event** (or one error) and exits cleanly.
- `events.jsonl` grows linearly (append-only) across restarts.
- Events do not reference each other.
- No new authority is introduced; events are boring and auditable.

## Run 1 — Existing Legal Sensor (read-only)

```powershell
# Provide explicit host instruction (no crawling)
$env:ALIVE_LEGAL_QUERY_JSON = '{
  "type": "legal.query",
  "jurisdiction": "us",
  "sources": ["https://www.supremecourt.gov/opinions/23pdf/22-915_8o6b.pdf"],
  "requested_documents": ["case_opinion"]
}'

Remove-Item Env:ALIVE_ENVIRONMENT_URL -ErrorAction SilentlyContinue

cd ..\alive-system
npm start
```

Inspect the appended event:

```powershell
Get-Content "$env:ALIVE_DATA_DIR\events.jsonl"
```

You should see a `sense.legal.readonly` (or `sense.legal.readonly.error`) entry with a timestamp, source URL, and raw captured payload (as parsed document text).

## Run 2 — New Environment Sensor (read-only)

```powershell
# Provide explicit host instruction (single URL)
$env:ALIVE_ENVIRONMENT_URL = "https://api.weather.gov/gridpoints/SEW/131,68/forecast"
Remove-Item Env:ALIVE_LEGAL_QUERY_JSON -ErrorAction SilentlyContinue

cd ..\alive-system
npm start
```

Inspect `events.jsonl` again (same directory):

```powershell
Get-Content "$env:ALIVE_DATA_DIR\events.jsonl"
```

You should now see **two** entries total:

1) `sense.legal.readonly` (or error)
2) `sense.environment.readonly`

Confirm the environment event keeps **zero interpretation** and preserves:

- `source` (the exact URL)
- `timestamp` (ISO-8601)
- `payload` (raw response text)
- `provenance.fetched_at` and `provenance.content_type`

## Verification Checklist (before committing)

- [ ] Two different domain events exist in `$env:ALIVE_DATA_DIR\events.jsonl`
- [ ] They persist across restarts (Run 2 appends after Run 1)
- [ ] No event references another
- [ ] No new authority or reasoning is introduced
- [ ] Events remain boring/auditable primary materials
- [ ] Process exits cleanly each run
