# alive-system (v0)

## Constitutional Audit

The system-wide constitutional audit is recorded in:
`alive-core/CONSTITUTIONAL_AUDITS.md`

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

## Execution Boundary

This repository does not contain execution authority.

Any interpretation, decision-making, or action based on observed patterns must occur
outside this system and under explicit human or policy control.

This separation is intentional and enforced.

## Phase Index

- **Phase 29 (complete):**  
  Deterministic cross-domain experience accumulation with zero intelligence and zero execution.

- **Phase 30 (design):**  
  Read-only pattern detection over accumulated experiences, still without execution authority.

## Intuition stacks

- **Science & Technology Intuition Stack:** `alive-system/science/`
- **Governance & Human Systems Intuition Stack:** `alive-system/governance/`
- **Cognition, Creativity, Ethics & Learning Stack:** `alive-system/cognition/`

## Unified reference

- Unified manifest: `alive-system/reference/manifest.md`
- Inter-layer interface: `alive-system/reference/interface.md`

## Intended Audience

This project is intended for systems engineers, auditors, and researchers interested in
constitutional AI boundaries and safe system architecture—not autonomous agents.
