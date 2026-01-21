# Phase 33 — Replay Scheduling (Non-Semantic)

## Purpose

Phase 33 introduces a non-semantic replay scheduling mechanism that influences how often accumulated experiences are revisited for analysis—without assigning meaning, importance, belief, or authority.

This phase exists to answer a narrow question:

**How can the system allocate attention for repeated observation without deciding what matters?**

Phase 33 affects attention frequency only, not memory truth, interpretation, or execution.

## Core Principle

**Replay frequency is not importance.**

Phase 33 may increase or decrease how often certain experiences are re-read, but it must never imply value, relevance, correctness, or action.

## What Phase 33 Is Allowed to Do

Phase 33 MAY:

- Attach Replay Bias Tokens (RBTs) to bounded experience segments
- Influence sampling frequency for Phase 30 read-only analysis
- Schedule additional replays of tagged segments
- Expire replay bias automatically
- Emit replay scheduling artifacts that are inspectable and removable

## What Phase 33 Must NOT Do

Phase 33 MUST NOT:

- Assign importance, priority, or salience
- Modify or promote memory
- Interpret patterns
- Generate beliefs
- Trigger execution
- Influence Phase 31 or Phase 32 directly
- Persist replay bias indefinitely
- Create self-reinforcing loops
- Operate without explicit configuration

If a human can infer “this matters more,” Phase 33 is invalid.

## Replay Bias Token (RBT) Definition

A Replay Bias Token is a mechanical scheduling hint, not a semantic label.

Properties:

```json
{
  "token_type": "replay_bias",
  "target": "experience_segment_id",
  "multiplier": 1,
  "issued_at": "timestamp",
  "expires_at": "timestamp",
  "reason": "mechanical_condition_only"
}
```

Constraints:

- `multiplier` is capped (e.g., max 3×)
- Tokens expire automatically
- Tokens do not stack unbounded
- Tokens carry no descriptive meaning

## Input Surface

Phase 33 MAY read (read-only):

- Phase 29 experience logs
- Structural metadata (timestamps, segment boundaries)
- Mechanical state (e.g., “idle boundary reached”)

Phase 33 MAY NOT read:

- Phase 31 interpretations
- Phase 32 execution receipts
- External policy or authority files

## Output Surface

Phase 33 outputs replay scheduling artifacts only (advisory, non-authoritative, non-executable), e.g.:

```json
{
  "phase": "33",
  "advisory": true,
  "authoritative": false,
  "executable": false,
  "replay_schedule": [
    {
      "segment_id": "exp-123",
      "replay_multiplier": 2,
      "expires_at": "2026-02-01T00:00:00Z"
    }
  ]
}
```

Outputs:

- Must be deletable without behavior change
- Must not be consumed automatically
- Must not imply value or intent

## Relationship to Other Phases

| Phase | Role | Can Influence |
|------:|------|---------------|
| 29 | Experience accumulation | ❌ |
| 30 | Pattern detection | ❌ |
| 31 | Interpretation | ❌ |
| 32 | Execution | ❌ |
| 33 | Replay scheduling | Phase 30 sampling only |

Phase 33 may only affect **how often Phase 30 looks**, not what Phase 30 concludes.

## Determinism & Safety

- Given the same inputs, Phase 33 must emit the same replay schedule
- Replay bias must be bounded, time-limited, and inspectable
- Removing Phase 33 must leave the system functionally unchanged
- Replay bias must not accumulate across runs unless explicitly reissued

## Failure Conditions

Phase 33 fails if:

- Replay bias persists indefinitely
- Replay bias implies importance or correctness
- Replay bias affects execution paths
- Replay bias feeds back into memory promotion
- Replay bias becomes invisible or implicit

## Success Criteria

Phase 33 is complete when:

- Replay frequency can be adjusted without semantics
- Phase 30 behavior remains purely descriptive
- Phase 31 interpretations remain authority-bound
- Phase 32 execution remains untouched
- Deleting Phase 33 causes no side effects

## Explicit Boundary Statement

Phase 33 schedules attention.
It does not decide meaning.
It does not change truth.
It does not authorize action.

## Status

**Charter + documentation only. No implementation is authorized.**

## Conditions Required to Authorize Code

Replay bias must:

- be bounded
- be time-limited
- be non-semantic
- be removable without runtime impact

Replay bias must:

- not alter Phase 30 conclusions
- not persist without re-issuance
- not influence Phase 31 or Phase 32

Phase 33 code must:

- live outside the spine
- be manually invoked only
- emit advisory artifacts only
