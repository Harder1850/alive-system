# alive-system (v0)

Minimal **orchestration-only** layer for ALIVE.

## What it does

- Runs **exactly once** and exits.
- Wires the sequence **Host → Body → Brain** (Brain access occurs only through the Body’s firewall/bridge).

## What it does NOT do

- No intelligence.
- No autonomy.
- No scheduling / retries / background loops.
- No decisions.
- No memory inspection.

**alive-system owns repetition (when/if it is ever added), not decisions.**

## Run

```bash
npm start
```

You should see a startup line, one Body lifecycle run, then a shutdown line.
